
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const getProductPrice = (employeeCount: string) => {
  switch (employeeCount) {
    case '0-10':
      return 49900 // 499€
    case '10-49':
      return 99900 // 999€
    case '50-99':
      return 149900 // 1,499€
    case '100 et plus':
      return 199900 // 1,999€
    default:
      return 49900 // Default to smallest price
  }
}

serve(async (req) => {
  console.log('Function invoked with method:', req.method)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()
    console.log('Processing submission:', submissionId)

    if (!submissionId) {
      throw new Error('submissionId is required')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('label_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      console.error('Submission error:', submissionError)
      throw new Error('Submission not found')
    }

    console.log('Creating checkout session...')
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Label Startup Engagée',
              description: 'Processus de labellisation Startup Engagée',
            },
            unit_amount: getProductPrice(submission.employee_count || '0-10'),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${new URL(req.url).origin}/dashboard?success=true`,
      cancel_url: `${new URL(req.url).origin}/dashboard?canceled=true`,
      client_reference_id: submissionId,
    })

    console.log('Checkout session created:', session.id)

    return new Response(
      JSON.stringify({
        data: { url: session.url },
        error: null
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        data: null,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
