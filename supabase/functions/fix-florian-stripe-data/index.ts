
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
    console.log('Recherche des données Stripe pour Florian...')

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    // Rechercher le client Stripe de Florian
    const customers = await stripe.customers.list({
      email: 'florian.gardesse@gmail.com',
      limit: 1
    })

    if (customers.data.length === 0) {
      console.log('Aucun client Stripe trouvé pour Florian')
      return new Response(
        JSON.stringify({ success: false, message: 'Aucun client Stripe trouvé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const customer = customers.data[0]
    console.log('Client Stripe trouvé:', customer.id)

    // Rechercher les sessions de checkout pour ce client
    const sessions = await stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 10
    })

    console.log(`${sessions.data.length} sessions trouvées`)

    // Rechercher les factures pour ce client
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 10
    })

    console.log(`${invoices.data.length} factures trouvées`)

    // Trouver la session/facture qui correspond au paiement de Florian (1€)
    let matchingSession = null
    let matchingInvoice = null

    for (const session of sessions.data) {
      if (session.payment_status === 'paid' && session.amount_total === 100) {
        matchingSession = session
        console.log('Session correspondante trouvée:', session.id)
        break
      }
    }

    for (const invoice of invoices.data) {
      if (invoice.status === 'paid' && invoice.amount_paid === 100) {
        matchingInvoice = invoice
        console.log('Facture correspondante trouvée:', invoice.id)
        break
      }
    }

    // Mettre à jour les données de Florian dans Supabase
    const updateData: any = {}
    
    if (matchingSession) {
      updateData.stripe_session_id = matchingSession.id
    }
    
    if (matchingInvoice) {
      updateData.stripe_invoice_id = matchingInvoice.id
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseClient
        .from('label_submissions')
        .update(updateData)
        .eq('courriel', 'florian.gardesse@gmail.com')
        .eq('nom_entreprise', 'Papacito')

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError)
        throw updateError
      }

      console.log('Données mises à jour:', updateData)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        customer_id: customer.id,
        session_id: matchingSession?.id || null,
        invoice_id: matchingInvoice?.id || null,
        sessions_found: sessions.data.length,
        invoices_found: invoices.data.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
