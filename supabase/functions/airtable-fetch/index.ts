
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
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

    // Encode the company name for the URL
    const encodedCompanyName = encodeURIComponent(companyName);
    
    // Replace with your actual Airtable Base ID and table name
    const baseId = 'appJkbdvhP9HUu82h';
    const tableName = 'Company Data';
    
    // Fetch data from Airtable
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula={Entreprise}="${encodedCompanyName}"`;
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
      return new Response(
        JSON.stringify({ error: `Erreur Airtable: ${response.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    const data: AirtableResponse = await response.json();
    console.log(`Received ${data.records.length} records from Airtable`);

    if (data.records.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Aucune donnée trouvée pour cette entreprise' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Extract the relevant fields
    const record = data.records[0];
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
