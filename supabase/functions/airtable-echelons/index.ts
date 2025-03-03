
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY") || "";
const AIRTABLE_BASE_ID = "app7al7op0zAJYssh";
const AIRTABLE_TABLE_NAME = "Echelons";

// Définir les noms exacts des champs dans Airtable
const GOVERNANCE_FIELD = "Moyenne gouvernance juste et inclusive (%)";
const SOCIAL_IMPACT_FIELD = "Moyenne développement d'impact social positif (%)";
const ENVIRONMENTAL_FIELD = "Moyenne maitrise d'impact environnemental et DD (%)";
const TOTAL_AVERAGE_FIELD = "Moyenne globale (%)";

serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Analyser le corps de la requête pour obtenir la valeur de filtre d'échelon
    const requestData = await req.json();
    const echelonFilter = requestData.echelon;
    
    if (!AIRTABLE_API_KEY) {
      throw new Error("La clé API Airtable n'est pas configurée");
    }
    
    console.log('Récupération des données d\'échelon depuis Airtable, filtre:', echelonFilter);
    
    // Construire l'URL avec un filtre si fourni
    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    if (echelonFilter) {
      // Filtrer par Échelon si fourni
      url += `?filterByFormula={Echelon}="${echelonFilter}"`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API Airtable: ${response.status} ${errorText}`);
      throw new Error(`L'API Airtable a retourné ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Données Airtable reçues:', JSON.stringify(data));
    
    // Traiter et formater les données
    const transformedData = data.records.map(record => {
      // S'assurer que nous utilisons les noms de champs corrects et convertissons en nombres
      const governanceAverage = parseInt(record.fields[GOVERNANCE_FIELD] || '0', 10);
      const socialImpactAverage = parseInt(record.fields[SOCIAL_IMPACT_FIELD] || '0', 10);
      const environmentalAverage = parseInt(record.fields[ENVIRONMENTAL_FIELD] || '0', 10);
      const totalAverage = parseInt(record.fields[TOTAL_AVERAGE_FIELD] || '0', 10);
      
      return {
        id: record.id,
        echelon: record.fields.Echelon || '',
        governanceAverage: governanceAverage,
        socialImpactAverage: socialImpactAverage,
        environmentalAverage: environmentalAverage,
        totalAverage: totalAverage
      };
    });
    
    console.log('Données transformées:', JSON.stringify(transformedData));
    
    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Erreur dans la fonction airtable-echelons:', error.message);
    
    return new Response(
      JSON.stringify({ 
        error: "Erreur lors de la récupération des données depuis Airtable", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
