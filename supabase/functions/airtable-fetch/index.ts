
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer la requête OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Extraire les données du corps de la requête
    const { companyName } = await req.json();
    
    if (!companyName) {
      return new Response(
        JSON.stringify({ 
          error: "Nom d'entreprise manquant", 
          details: "Le paramètre 'companyName' est requis" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Récupérer les clés Airtable depuis les variables d'environnement
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID");
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return new Response(
        JSON.stringify({ 
          error: "Configuration Airtable manquante", 
          details: "Veuillez configurer les variables d'environnement AIRTABLE_API_KEY et AIRTABLE_BASE_ID" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Construire l'URL de l'API Airtable
    const tableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Entreprises`;
    const queryParams = new URLSearchParams({
      filterByFormula: `SEARCH("${companyName.replace(/"/g, '\\"')}", {Nom})`,
      view: "Grid view",
    }).toString();

    // Effectuer la requête à l'API Airtable
    const response = await fetch(`${tableUrl}?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur Airtable (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.records || data.records.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Aucune donnée trouvée", 
          details: `Aucune entreprise trouvée avec le nom '${companyName}'`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Extraire et formater les données
    const record = data.records[0].fields;
    
    // Préparer l'objet de retour avec toutes les données nécessaires
    const result = {
      companyName: record.Nom || companyName,
      governanceScore: record["Score Gouvernance"] || 0,
      environmentalScore: record["Score Environnement"] || 0,
      socialImpactScore: record["Score Social"] || 0,
      averageScore: record["Score Moyen"] || 0,
      // Nouveaux champs demandés
      echelonTexte: record["Echelon_texte"] || "Non déterminé",
      totalPercentage: record["TOTAL %"] || "0%",
      logoUrl: record["Logo (from Millésime)"]?.[0]?.url || null
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Erreur:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erreur lors de la récupération des données", 
        details: error.message 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
