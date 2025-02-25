
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface AirtableRecord {
  id: string;
  fields: {
    Identifiant?: string;
    Réponse?: string;
    "Idée de justificatifs"?: string;
    Entreprises?: string[];
    Email?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get user data
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError) {
      console.error('User auth error:', userError);
      throw new Error('Authentication failed');
    }

    if (!user?.email) {
      throw new Error('User email not found');
    }

    console.log('Authenticated user email:', user.email);

    // Get user's company name from Supabase
    const { data: submission, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('company_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (submissionError) {
      console.error('Error fetching company data:', submissionError);
      throw new Error('Error fetching company data');
    }

    if (!submission?.company_name) {
      throw new Error('Company name not found');
    }

    const companyName = submission.company_name;
    console.log('User company name:', companyName);

    // Get Airtable API key
    const airtableApiKey = Deno.env.get('AIRTABLE_API_KEY');
    if (!airtableApiKey) {
      throw new Error('Airtable API key not configured');
    }

    // Fetch from Airtable
    const airtableResponse = await fetch(
      'https://api.airtable.com/v0/apphVGTsH9QXBfiAw/Admissions',
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!airtableResponse.ok) {
      console.error('Airtable response error:', await airtableResponse.text());
      throw new Error(`Airtable API error: ${airtableResponse.status}`);
    }

    const airtableData = await airtableResponse.json();
    
    console.log('Total Airtable records:', airtableData.records.length);
    
    // Filter and map records for user's company
    const userRecords = airtableData.records
      .filter((record: AirtableRecord) => {
        const hasCompany = Array.isArray(record.fields.Entreprises) && 
          record.fields.Entreprises.includes(companyName);
        console.log(
          `Checking if ${companyName} is in`,
          record.fields.Entreprises,
          '->',
          hasCompany
        );
        return hasCompany;
      })
      .map((record: AirtableRecord) => ({
        id: record.id,
        identifier: record.fields.Identifiant || '',
        response: record.fields.Réponse || '',
        document: record.fields["Idée de justificatifs"] || ''
      }));

    console.log('Filtered records for company:', userRecords.length);

    return new Response(
      JSON.stringify(userRecords),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
