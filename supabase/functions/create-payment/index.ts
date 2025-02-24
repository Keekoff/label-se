
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabaseClient = createClient(supabaseUrl || '', supabaseKey || '')

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()
    console.log('Processing payment for submission:', submissionId)

    if (!submissionId) {
      throw new Error('ID de soumission manquant')
    }

    // Get submission and check if payment already exists
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

    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'
    console.log('Base URL for redirects:', baseUrl)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}&submission_id=${submissionId}`,
      cancel_url: `${baseUrl}/dashboard?success=false`,
      client_reference_id: submissionId,
      metadata: {
        submission_id: submissionId,
        user_id: submission.user_id
      },
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

    console.log('Stripe session created:', session.id)

    // Pre-update the submission with pending status
    const { error: updateError } = await supabaseClient
      .from('label_submissions')
      .update({ 
        payment_status: 'pending',
        payment_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    if (updateError) {
      console.error('Error updating submission status:', updateError)
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
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
