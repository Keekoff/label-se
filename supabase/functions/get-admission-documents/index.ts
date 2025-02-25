
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface AirtableRecord {
  id: string;
  fields: {
    Identifiant?: string;
    Réponse?: string;
    "Idée de justificatifs"?: string;
    Entreprises?: string[];
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
    
    // Get the user first
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Failed to get user');
    }

    console.log('User ID:', user.id);

    // Get user's submission with company name
    const { data: submission, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('company_name')
      .eq('user_id', user.id)
      .eq('status', 'submitted')
      .single();

    if (submissionError) {
      console.error('Submission error:', submissionError);
      throw new Error('Failed to get company data');
    }

    if (!submission?.company_name) {
      console.error('No company name found for user:', user.id);
      throw new Error('Company name not found');
    }

    console.log('Found company name:', submission.company_name);

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
      console.error('Airtable response:', await airtableResponse.text());
      throw new Error(`Airtable API error: ${airtableResponse.status}`);
    }

    const airtableData = await airtableResponse.json();
    console.log('Total Airtable records:', airtableData.records.length);
    
    // Filter and map records for user's company
    const userRecords = airtableData.records
      .filter((record: AirtableRecord) => {
        const hasCompany = Array.isArray(record.fields.Entreprises) && 
          record.fields.Entreprises.includes(submission.company_name);
        console.log(
          `Record ${record.id}: checking if ${submission.company_name} is in`,
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

    console.log('Matching records found:', userRecords.length);

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
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
