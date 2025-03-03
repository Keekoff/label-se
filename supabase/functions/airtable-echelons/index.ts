
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY") || "";
const AIRTABLE_BASE_ID = "app7al7op0zAJYssh";
const AIRTABLE_TABLE_NAME = "Echelons";

// Define the exact field names from Airtable
const GOVERNANCE_FIELD = "Moyenne gouvernance juste et inclusive (%)";
const SOCIAL_IMPACT_FIELD = "Moyenne développement d'impact social positif (%)";
const ENVIRONMENTAL_FIELD = "Moyenne maitrise d'impact environnemental et DD (%)";
const TOTAL_AVERAGE_FIELD = "Moyenne globale (%)";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body to get echelon filter value
    const requestData = await req.json();
    const echelonFilter = requestData.echelon;
    
    if (!AIRTABLE_API_KEY) {
      throw new Error("Airtable API key is not configured");
    }
    
    console.log('Fetching echelon data from Airtable, filter:', echelonFilter);
    
    // Build the URL with filter if provided
    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    if (echelonFilter) {
      // Filter by Echelon if provided
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
      console.error(`Airtable API error: ${response.status} ${errorText}`);
      throw new Error(`Airtable API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Received Airtable data:', JSON.stringify(data));
    
    // Process and format the data
    const transformedData = data.records.map(record => {
      // Make sure we're using the correct field names and converting to numbers
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
    
    console.log('Transformed data:', JSON.stringify(transformedData));
    
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
    console.error('Error in airtable-echelons function:', error.message);
    
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
