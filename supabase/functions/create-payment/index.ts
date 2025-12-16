
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mapping des produits Stripe selon le nombre d'employés
const getStripeProductId = (employeeCount: string): string => {
  const count = parseInt(employeeCount) || 0;
  
  if (count <= 10) {
    return 'prod_SVd1sExPwVYNzT'; // 0 à 10 collaborateurs
  } else if (count <= 49) {
    return 'prod_SVdJmvwjJgTpX0'; // 11 à 49 collaborateurs
  } else if (count <= 99) {
    return 'prod_SVdKfWfUg6gNyq'; // 50 à 99 collaborateurs
  } else {
    return 'prod_SVdM7hUC29aJxi'; // 100 et plus collaborateurs
  }
};

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
      .select('*, nombre_employes, courriel, nom_entreprise')
      .eq('id', submissionId)
      .maybeSingle()

    if (submissionError || !submission) {
      console.error('Submission not found:', submissionError)
      throw new Error('Soumission non trouvée')
    }

    if (submission.payment_status === 'paid') {
      throw new Error('Le paiement a déjà été effectué pour cette soumission')
    }

    // Récupérer le bon produit selon le nombre d'employés
    const productId = getStripeProductId(submission.nombre_employes || '0');
    console.log('Using Stripe product:', productId, 'for employee count:', submission.nombre_employes);

    // Récupérer le prix du produit depuis Stripe
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1
    });

    if (prices.data.length === 0) {
      throw new Error('Aucun prix trouvé pour ce produit');
    }

    const priceId = prices.data[0].id;
    console.log('Using price ID:', priceId);

    console.log('Creating Stripe checkout session with:', {
      priceId,
      customerEmail: submission.courriel,
      companyName: submission.nom_entreprise,
      automaticTax: true,
      invoiceCreation: true
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}&submission_id=${submissionId}`,
      cancel_url: `${req.headers.get('origin')}/dashboard?success=false`,
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Label Startup Engagée - Certification annuelle',
          footer: 'Merci pour votre confiance ! Label Startup Engagée',
          metadata: {
            submission_id: submissionId,
            company_name: submission.nom_entreprise || ''
          }
        }
      },
      customer_email: submission.courriel || undefined,
      metadata: {
        submission_id: submissionId
      }
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
