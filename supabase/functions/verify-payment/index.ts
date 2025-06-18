
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
    const { sessionId, submissionId } = await req.json()
    console.log('Verifying payment for session:', sessionId, 'submission:', submissionId)

    if (!sessionId || !submissionId) {
      throw new Error('ID de session et de soumission requis')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    // Vérifier le statut de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log('Stripe session status:', session.payment_status)

    if (session.payment_status === 'paid') {
      // Mettre à jour le statut de paiement dans la base de données
      const { error: updateError } = await supabaseClient
        .from('label_submissions')
        .update({ 
          payment_status: 'paid',
          payment_date: new Date().toISOString()
        })
        .eq('id', submissionId)

      if (updateError) {
        console.error('Error updating payment status:', updateError)
        throw new Error('Erreur lors de la mise à jour du statut de paiement')
      }

      console.log('Payment status updated successfully for submission:', submissionId)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Paiement vérifié et statut mis à jour',
          paymentStatus: 'paid'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Paiement non confirmé',
          paymentStatus: session.payment_status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la vérification'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
