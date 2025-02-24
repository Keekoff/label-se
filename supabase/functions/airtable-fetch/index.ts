
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const BASE_ID = 'app7al7op0zAJYssh';
const TABLE_NAME = 'Entreprises';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY is not set');
    }

    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
    console.log('Fetching from Airtable:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully retrieved data from Airtable');

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in airtable-fetch function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
