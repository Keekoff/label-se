
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()
    
    if (!submissionId) {
      throw new Error('Missing submissionId')
    }

    // Check if user already has a valid payment for this year
    const { data: submission, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      throw new Error('Submission not found')
    }

    const currentYear = new Date().getFullYear()
    const { data: existingPayment } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('user_id', submission.user_id)
      .eq('payment_status', 'paid')
      .gte('updated_at', `${currentYear}-01-01`)
      .lte('updated_at', `${currentYear}-12-31`)
      .maybeSingle()

    if (existingPayment) {
      throw new Error('Un paiement a déjà été effectué cette année')
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${Deno.env.get('SITE_URL')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('SITE_URL')}/dashboard?canceled=true`,
      client_reference_id: submissionId,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Label Startup Engagée',
              description: 'Processus de labellisation Startup Engagée',
            },
            unit_amount: 49900,
          },
          quantity: 1,
        },
      ],
      metadata: {
        submission_id: submissionId,
        user_id: submission.user_id,
      },
    })

    if (!session.url) {
      throw new Error('Failed to create checkout session')
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error:', errorMessage)
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})
