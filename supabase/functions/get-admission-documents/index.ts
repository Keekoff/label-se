
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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
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

    // First, let's check if the user exists and get their email
    const { data: userDetails, error: userError2 } = await supabaseClient.auth.admin.getUserById(user.id);
    console.log('User details:', userDetails);

    if (userError2) {
      console.error('Error getting user details:', userError2);
      throw userError2;
    }

    // Get user's specific submissions
    const { data: userSubmissions, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('email', userDetails?.user?.email);

    if (submissionError) {
      console.error('Submission error:', submissionError);
      throw new Error('Failed to get company data');
    }

    console.log('User submissions found:', userSubmissions);

    if (!userSubmissions || userSubmissions.length === 0) {
      throw new Error('No submissions found for user');
    }

    const submission = userSubmissions[0];
    console.log('Using submission:', submission);

    if (!submission.company_name) {
      throw new Error('Company name not found in submission');
    }

    console.log('Using company name:', submission.company_name);

    // Get Airtable API key
    const airtableApiKey = Deno.env.get('AIRTABLE_API_KEY');
    if (!airtableApiKey) {
      throw new Error('Airtable API key not configured');
    }

    console.log('Making Airtable API request...');
    
    // Fetch from Airtable
    const airtableResponse = await fetch(
      'https://api.airtable.com/v0/apphVGTsH9QXBfiAw/Admissions',
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!airtableResponse.ok) {
      const responseText = await airtableResponse.text();
      console.error('Airtable error response:', responseText);
      throw new Error(`Airtable API error: ${airtableResponse.status} - ${responseText}`);
    }

    const airtableData = await airtableResponse.json();
    console.log('Airtable response received. Number of records:', airtableData.records?.length);

    // Filter and map records for user's company
    const userRecords = airtableData.records
      .filter((record: AirtableRecord) => {
        console.log(`Checking record:`, record);
        console.log(`Looking for company "${submission.company_name}" in:`, record.fields.Entreprises);
        
        return Array.isArray(record.fields.Entreprises) && 
          record.fields.Entreprises.some(company => 
            company.trim().toLowerCase() === submission.company_name.trim().toLowerCase()
          );
      })
      .map((record: AirtableRecord) => ({
        id: record.id,
        identifier: record.fields.Identifiant || '',
        response: record.fields.Réponse || '',
        document: record.fields["Idée de justificatifs"] || ''
      }));

    console.log('Found matching records:', userRecords);

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
