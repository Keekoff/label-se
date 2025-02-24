
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()
    console.log('Received submissionId:', submissionId)

    if (!submissionId) {
      throw new Error('submissionId is required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get submission details
    const { data: submission, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError) {
      console.error('Error fetching submission:', submissionError)
      throw new Error('Submission not found')
    }

    if (!submission) {
      throw new Error('Submission not found')
    }

    console.log('Creating Stripe checkout session for submission:', submission.id)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
      success_url: `${req.headers.get('origin')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`,
      metadata: {
        submissionId: submissionId,
      },
    })

    console.log('Checkout session created:', session.id)

    // Return the session URL
    return new Response(
      JSON.stringify({ 
        data: { url: session.url },
        error: null 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in create-checkout-session:', error)
    return new Response(
      JSON.stringify({ 
        data: null,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
