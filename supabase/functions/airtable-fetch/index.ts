
import { corsHeaders } from '../_shared/cors.ts'

// Define types for our data
type AirtableResponse = {
  records: Array<{
    id: string;
    fields: Record<string, any>;
  }>;
};

type CompanyData = {
  companyName: string;
  governanceScore?: number;
  environmentalScore?: number;
  socialImpactScore?: number;
  averageScore?: number;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName } = await req.json();
    console.log(`Fetching data for company: ${companyName}`);

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: 'Nom d\'entreprise manquant' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get the Airtable API key from Supabase secrets
    const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
    
    if (!AIRTABLE_API_KEY) {
      console.error('AIRTABLE_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Configuration de l\'API Airtable manquante' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Encode the company name for the URL - ensure proper encoding for special characters
    const encodedCompanyName = encodeURIComponent(companyName);
    
    // Update with your correct Airtable Base ID and table name
    // Note: Double-check these values with your Airtable account
    const baseId = 'appJkbdvhP9HUu82h'; 
    const tableName = 'Company%20Data'; // URL encoded table name
    
    // Log the API key (first few characters for debugging)
    console.log(`Using Airtable API Key: ${AIRTABLE_API_KEY.substring(0, 5)}...`);
    
    // Fetch data from Airtable - use the correct API URL format
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=FIND("${encodedCompanyName}",{Entreprise})`;
    console.log(`Fetching from Airtable URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Airtable API error: ${response.status} ${errorText}`);
      
      // Return more detailed error information
      return new Response(
        JSON.stringify({ 
          error: `Erreur Airtable: ${response.status}`, 
          details: errorText,
          requestUrl: url.replace(AIRTABLE_API_KEY, '[REDACTED]') // Don't expose the full API key
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    const data: AirtableResponse = await response.json();
    console.log(`Received ${data.records.length} records from Airtable`);

    if (data.records.length === 0) {
      // Return a specific message when no data is found
      return new Response(
        JSON.stringify({ 
          error: 'Aucune donnée trouvée pour cette entreprise',
          companyName: companyName 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Extract the relevant fields
    const record = data.records[0];
    
    // Make sure to match the exact field names from your Airtable
    const companyData: CompanyData = {
      companyName,
      governanceScore: record.fields['Gouvernance juste & inclusive %'] || 0,
      environmentalScore: record.fields['Maitrise d\'impact environnemental et développement durable %'] || 0,
      socialImpactScore: record.fields['Développement d\'impact social positif %'] || 0,
      averageScore: record.fields['Moyenne globale %'] || 0
    };

    console.log(`Processed company data:`, companyData);

    return new Response(
      JSON.stringify(companyData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching Airtable data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
