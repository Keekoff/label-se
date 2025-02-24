
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId } = await req.json();
    
    if (!submissionId) {
      throw new Error('Missing submissionId');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://startup-engagee.vercel.app/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://startup-engagee.vercel.app/dashboard?canceled=true',
      mode: 'payment',
      client_reference_id: submissionId,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Label Startup Engagée',
          },
          unit_amount: 49900,
        },
        quantity: 1,
      }],
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
})
