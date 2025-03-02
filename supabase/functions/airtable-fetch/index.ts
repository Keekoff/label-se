
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Return error with CORS headers
function createErrorResponse(message: string, details: string = "", status: number = 400) {
  return new Response(
    JSON.stringify({ 
      error: message, 
      details: details 
    }),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status 
    }
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { companyName } = await req.json();
    
    if (!companyName) {
      return createErrorResponse("Nom d'entreprise manquant");
    }

    console.log(`Fetching data for company: "${companyName}"`);

    // Ensure we have the API key
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    if (!AIRTABLE_API_KEY) {
      return createErrorResponse("Clé API Airtable manquante", "", 500);
    }

    // Define base ID and table name
    const BASE_ID = "app7al7op0zAJYssh";
    const TABLE_NAME = "Entreprises";
    
    // Build URL with company name filter
    const companyNameEncoded = encodeURIComponent(companyName);
    const apiUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula={Raison+sociale}="${companyNameEncoded}"`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`Airtable API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      return createErrorResponse(
        `Erreur de l'API Airtable: ${response.status}`,
        errorText,
        response.status
      );
    }

    const responseData = await response.json();
    console.log("Airtable response:", JSON.stringify(responseData, null, 2));

    if (!responseData.records || responseData.records.length === 0) {
      return createErrorResponse(
        "Entreprise non trouvée",
        `Aucune correspondance pour "${companyName}" dans la table "${TABLE_NAME}"`,
        404
      );
    }

    // Extract relevant fields from the first matching record
    const record = responseData.records[0];
    const fields = record.fields;

    // Map Airtable fields to our response format
    const data = {
      companyName: fields["Raison sociale"] || companyName,
      governanceScore: fields["% Gouvernance juste et inclusive"] || 0,
      environmentalScore: fields["% Maitrise d'impact environnemental et développement durable"] || 0,
      socialImpactScore: fields["% Développement d'impact social positif"] || 0,
      averageScore: fields["TOTAL %"] || 0,
      echelonTexte: fields["Echelon_texte"] || "",
      totalScore: fields["TOTAL %"] || 0,
      logoUrl: fields["Logo (from Millésime)"]?.[0]?.url || null,
    };

    console.log("Processed data:", JSON.stringify(data, null, 2));

    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return createErrorResponse(
      "Erreur de traitement",
      error.message || "Une erreur inconnue est survenue",
      500
    );
  }
});
