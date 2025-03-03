
import { corsHeaders } from '../_shared/cors.ts';

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY') || '';
const AIRTABLE_BASE_ID = 'app7al7op0zAJYssh';
const AIRTABLE_TABLE_NAME = 'Echelons';

interface EchelonRecord {
  id: string;
  fields: {
    Echelon?: string;
    'Moyenne gouvernance juste et inclusive (%)'?: number;
    'Moyenne développement d\'impact social positif (%)'?: number;
    'Moyenne maitrise d\'impact environnement et développement durable (%)'?: number;
    'Score moyen total (%)'?: number;
  };
}

interface AirtableResponse {
  records: EchelonRecord[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data if any
    const requestData = req.method === 'POST' ? await req.json() : {};
    const echelonFilter = requestData.echelon || '';
    
    console.log('Fetching echelon data from Airtable, filter:', echelonFilter);
    
    // Build the URL with filter if provided
    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?view=Grid%20view`;
    
    if (echelonFilter) {
      // Filter by Echelon if provided
      url += `&filterByFormula={Echelon}="${echelonFilter}"`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', response.status, errorText);
      throw new Error(`Airtable API returned ${response.status}: ${errorText}`);
    }

    const data: AirtableResponse = await response.json();
    console.log(`Retrieved ${data.records.length} echelon records`);
    
    // Process the data to make it easier to use
    const processedData = data.records.map(record => ({
      id: record.id,
      echelon: record.fields.Echelon || '',
      governanceAverage: record.fields['Moyenne gouvernance juste et inclusive (%)'] || 0,
      socialImpactAverage: record.fields['Moyenne développement d\'impact social positif (%)'] || 0,
      environmentalAverage: record.fields['Moyenne maitrise d\'impact environnement et développement durable (%)'] || 0,
      totalAverage: record.fields['Score moyen total (%)'] || 0
    }));

    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in airtable-echelons function:', error.message);
    return new Response(
      JSON.stringify({
        error: 'Erreur lors de la récupération des données Airtable',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
