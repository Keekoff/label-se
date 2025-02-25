
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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // Using service role key to bypass RLS
    
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

    // Now get all submissions to check what we have
    const { data: allSubmissions, error: allSubError } = await supabaseClient
      .from('label_submissions')
      .select('*');

    console.log('All submissions in database:', allSubmissions);

    // Get user's specific submissions
    const { data: userSubmissions, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('user_id', user.id);

    if (submissionError) {
      console.error('Submission error:', submissionError);
      throw new Error('Failed to get company data');
    }

    console.log('User submissions found:', userSubmissions);

    if (!userSubmissions || userSubmissions.length === 0) {
      // If no submissions found by user_id, try by email
      const { data: emailSubmissions, error: emailError } = await supabaseClient
        .from('label_submissions')
        .select('*')
        .eq('email', userDetails?.user?.email);

      console.log('Submissions by email:', emailSubmissions);

      if (emailError) {
        console.error('Email submission error:', emailError);
        throw new Error('Failed to get submissions by email');
      }

      if (!emailSubmissions || emailSubmissions.length === 0) {
        throw new Error('No submissions found for user');
      }

      userSubmissions = emailSubmissions;
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
      throw new Error(`Airtable API error: ${airtableResponse.status}`);
    }

    const airtableData = await airtableResponse.json();
    console.log('Airtable records:', JSON.stringify(airtableData.records, null, 2));

    // Filter and map records for user's company
    const userRecords = airtableData.records
      .filter((record: AirtableRecord) => {
        console.log(`Checking record:`, record);
        console.log(`Looking for company "${submission.company_name}" in:`, record.fields.Entreprises);
        
        return Array.isArray(record.fields.Entreprises) && 
          record.fields.Entreprises.some(company => 
            company.trim() === submission.company_name.trim()
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
