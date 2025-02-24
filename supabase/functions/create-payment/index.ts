
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()
    
    if (!submissionId) {
      throw new Error('Missing submissionId')
    }

    // Hard-code the base URL for production
    const baseUrl = 'https://startup-engagee.vercel.app'

    // Create basic Stripe checkout session with fetch
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'success_url': `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${baseUrl}/dashboard?canceled=true`,
        'mode': 'payment',
        'client_reference_id': submissionId,
        'line_items[0][quantity]': '1',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][unit_amount]': '49900',
        'line_items[0][price_data][product_data][name]': 'Label Startup Engagée',
      }),
    })

    const session = await stripeResponse.json()

    if (!session.url) {
      throw new Error('Failed to create checkout session')
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
