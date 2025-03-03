
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_BASE_ID = 'appjcjjyt3QRyCZsx';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: 'Company name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Fetching Airtable data for company: ${companyName}`);
    console.log(`Utilisation de la clé API Airtable: ${AIRTABLE_API_KEY?.substring(0, 10)}...`);

    // Fetch performance metrics data
    const performanceResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Performance%20RSE?filterByFormula={company_name}="${encodeURIComponent(companyName)}"`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const performanceData = await performanceResponse.json();
    console.log('Performance data response received');

    // Fetch company certification data
    const companyResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Entreprises?filterByFormula={Nom}="${encodeURIComponent(companyName)}"`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const companyData = await companyResponse.json();
    console.log('Company data response received');
    
    // Log the raw data for debugging
    console.log('Company raw data:', JSON.stringify(companyData));

    // Extract certification data if available
    let certificationData = null;
    if (companyData && companyData.records && companyData.records.length > 0) {
      const company = companyData.records[0].fields;
      certificationData = {
        level: company['Echelon_texte'] || 'Non défini',
        logo: company['Logo (from Millésime)'] ? company['Logo (from Millésime)'][0] : null,
        startDate: company['Date validation label'] || null,
        endDate: company['Date fin validité label'] || null
      };
    }

    // Combine all data
    const responseData = {
      performance: performanceData.records || [],
      certification: certificationData
    };
    
    console.log('Airtable data received:', JSON.stringify(responseData));

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching Airtable data:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred while fetching data' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
