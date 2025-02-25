
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface AirtableRecord {
  id: string;
  fields: {
    Identifiant?: string;
    Réponse?: string;
    "Idée de justificatifs"?: string;
    Entreprise?: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the user's JWT token from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user session from the JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Error getting user');
    }

    // Get user's company name from their label submission
    const { data: submission, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('company_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (submissionError || !submission?.company_name) {
      throw new Error('Error getting company name');
    }

    // Fetch data from Airtable
    const airtableResponse = await fetch(
      'https://api.airtable.com/v0/apphVGTsH9QXBfiAw/Admissions',
      {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
        },
      }
    );

    if (!airtableResponse.ok) {
      throw new Error('Airtable API error');
    }

    const airtableData = await airtableResponse.json();
    
    // Filter records for the user's company
    const userRecords = airtableData.records
      .filter((record: AirtableRecord) => 
        record.fields.Entreprise === submission.company_name
      )
      .map((record: AirtableRecord) => ({
        id: record.id,
        identifier: record.fields.Identifiant || '',
        response: record.fields.Réponse || '',
        document: record.fields["Idée de justificatifs"] || ''
      }));

    return new Response(JSON.stringify(userRecords), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
