
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const getProductId = (employeeCount: string) => {
  switch (employeeCount) {
    case '0-10':
      return 'prod_NHyVzzHvOvmb60'
    case '10-49':
      return 'prod_NHyZfxWCJ4sEJp'
    case '50-99':
      return 'prod_NHyaFhaE7s6DIM'
    case '100 et plus':
      return 'prod_NHybiSinytNjFD'
    default:
      throw new Error('Invalid employee count')
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get submission details
    const { data: submission, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      throw new Error('Submission not found')
    }

    const productId = getProductId(submission.employee_count)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product: productId,
            unit_amount: 0, // Price will be defined in Stripe Dashboard
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`,
      metadata: {
        submissionId: submissionId,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
