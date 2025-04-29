
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const { submissionId } = await req.json()
    console.log('Processing payment for submission:', submissionId)

    if (!submissionId) {
      throw new Error('ID de soumission manquant')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { data: submission, error: submissionError } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('id', submissionId)
      .maybeSingle()

    if (submissionError || !submission) {
      console.error('Submission not found:', submissionError)
      throw new Error('Soumission non trouvée')
    }

    if (submission.payment_status === 'paid') {
      throw new Error('Le paiement a déjà été effectué pour cette soumission')
    }

    console.log('Creating Stripe checkout session')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}&submission_id=${submissionId}`,
      cancel_url: `${req.headers.get('origin')}/dashboard?success=false`,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Label Startup Engagée',
            description: 'Processus de labellisation Startup Engagée'
          },
          unit_amount: 49900
        },
        quantity: 1
      }]
    })

    console.log('Updating submission status to pending')
    await supabaseClient
      .from('label_submissions')
      .update({ 
        payment_status: 'pending',
        payment_id: session.id,
      })
      .eq('id', submissionId)

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Une erreur est survenue' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
