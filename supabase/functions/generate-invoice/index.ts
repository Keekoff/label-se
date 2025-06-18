
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import jsPDF from 'https://esm.sh/jspdf@2.5.1'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { format } from 'https://esm.sh/date-fns@3.6.0'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || ''

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL ou clé manquante')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })

    // Get request body
    const { paymentId } = await req.json()

    if (!paymentId) {
      throw new Error('L\'ID de paiement est requis')
    }

    console.log('Récupération du paiement avec ID:', paymentId)

    // Fetch payment information - try by payment_id first, then by id
    let payment = null
    let error = null

    // First try to find by payment_id
    if (paymentId !== 'N/A' && paymentId) {
      const { data, error: paymentError } = await supabase
        .from('label_submissions')
        .select('id, created_at, payment_date, nom_entreprise, payment_id, adresse, ville, code_postal, payment_status, prenom, amount_paid, currency, discount_applied, stripe_invoice_id, stripe_session_id')
        .eq('payment_id', paymentId)
        .maybeSingle()

      payment = data
      error = paymentError
    }

    // If not found by payment_id, try by id
    if (!payment && !error) {
      const { data, error: idError } = await supabase
        .from('label_submissions')
        .select('id, created_at, payment_date, nom_entreprise, payment_id, adresse, ville, code_postal, payment_status, prenom, amount_paid, currency, discount_applied, stripe_invoice_id, stripe_session_id')
        .eq('id', paymentId)
        .maybeSingle()

      payment = data
      error = idError
    }

    if (error) {
      console.error('Erreur lors de la récupération du paiement:', error)
      throw new Error('Erreur lors de la récupération du paiement: ' + error.message)
    }

    if (!payment) {
      console.error('Paiement non trouvé pour ID:', paymentId)
      throw new Error('Paiement introuvable avec l\'ID: ' + paymentId)
    }

    // Vérifier si le paiement est marqué comme payé
    if (payment.payment_status !== 'paid') {
      throw new Error(`Ce paiement n'est pas encore marqué comme payé (statut: ${payment.payment_status})`)
    }

    console.log('Paiement trouvé:', payment)

    // Si on a une facture Stripe, essayer de la récupérer directement
    if (payment.stripe_invoice_id && stripeKey) {
      try {
        console.log('Tentative de récupération de la facture Stripe:', payment.stripe_invoice_id)
        const invoice = await stripe.invoices.retrieve(payment.stripe_invoice_id)
        console.log('Facture Stripe trouvée:', invoice.id)
        
        // Récupérer le PDF de la facture Stripe
        const invoicePdf = await stripe.invoices.retrieveUpcoming({
          customer: invoice.customer as string,
        })
        
        if (invoice.invoice_pdf) {
          // Rediriger vers le PDF Stripe officiel
          return new Response(null, {
            status: 302,
            headers: {
              ...corsHeaders,
              'Location': invoice.invoice_pdf
            }
          })
        }
      } catch (stripeError) {
        console.log('Impossible de récupérer la facture Stripe, génération d\'une facture personnalisée:', stripeError)
      }
    }

    // Générer une facture PDF personnalisée si pas de facture Stripe disponible
    const doc = new jsPDF()
    
    // Calculer les montants
    const amountPaid = payment.amount_paid || 80000 // fallback vers l'ancien montant
    const discountApplied = payment.discount_applied || 0
    const originalAmount = amountPaid + discountApplied
    const currency = payment.currency || 'eur'
    
    // Convertir de centimes vers euros
    const amountPaidEur = (amountPaid / 100).toFixed(2)
    const discountAppliedEur = (discountApplied / 100).toFixed(2)
    const originalAmountEur = (originalAmount / 100).toFixed(2)
    
    // Construire l'adresse de facturation
    const addressComponents = [
      payment.adresse,
      payment.code_postal && payment.ville ? `${payment.code_postal} ${payment.ville}` : null
    ].filter(Boolean)
    
    const addressLines = addressComponents.length > 0 ? addressComponents : ['Adresse non disponible']
    
    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURE', 105, 30, { align: 'center' })
    
    // Company info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Label Startup Engagée', 15, 50)
    doc.text('45 rue de l\'Innovation', 15, 57)
    doc.text('75008 Paris', 15, 64)
    doc.text('France', 15, 71)
    doc.text('SIRET: 12345678900010', 15, 78)
    
    // Customer info
    doc.setFont('helvetica', 'bold')
    doc.text('Facturé à:', 130, 50)
    doc.setFont('helvetica', 'normal')
    
    let customerName = payment.nom_entreprise || 'Client'
    if (payment.prenom) {
      customerName = `${payment.prenom} - ${customerName}`
    }
    doc.text(customerName, 130, 57)
    
    // Add address lines
    let yPos = 64
    addressLines.slice(0, 3).forEach((line) => {
      doc.text(line, 130, yPos)
      yPos += 7
    })
    
    // Invoice details
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Numéro de facture:', 15, 95)
    doc.text('Date de facturation:', 15, 102)
    doc.text('Date de paiement:', 15, 109)
    doc.text('Référence:', 15, 116)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`INV-${payment.id.substring(0, 8)}`, 75, 95)
    doc.text(format(new Date(payment.created_at), 'dd/MM/yyyy'), 75, 102)
    
    const paymentDateToUse = payment.payment_date || payment.created_at
    doc.text(format(new Date(paymentDateToUse), 'dd/MM/yyyy'), 75, 109)
    
    doc.text(payment.payment_id || payment.id.substring(0, 8), 75, 116)
    
    // Table header
    doc.setFont('helvetica', 'bold')
    doc.rect(15, 130, 180, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text('Description', 20, 137)
    doc.text('Quantité', 100, 137)
    doc.text('Prix unitaire', 130, 137)
    doc.text('Total HT', 170, 137)
    
    // Table content
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text('Label Startup Engagée - Certification annuelle', 20, 150)
    doc.text('1', 100, 150)
    
    // Calculer le prix unitaire HT (en retirant la TVA de 20%)
    const unitPriceHT = (amountPaid / 1.20).toFixed(2)
    doc.text(`${unitPriceHT} €`, 130, 150)
    doc.text(`${unitPriceHT} €`, 170, 150)
    
    let currentY = 160
    
    // Afficher la remise si elle existe
    if (discountApplied > 0) {
      doc.setTextColor(255, 0, 0) // Rouge pour la remise
      doc.text('Remise appliquée (code promo)', 20, currentY)
      doc.text('1', 100, currentY)
      doc.text(`-${(discountApplied / 1.20).toFixed(2)} €`, 130, currentY)
      doc.text(`-${(discountApplied / 1.20).toFixed(2)} €`, 170, currentY)
      currentY += 10
      doc.setTextColor(0, 0, 0) // Retour au noir
    }
    
    // Total section
    doc.line(15, currentY, 195, currentY)
    currentY += 10
    
    doc.setFont('helvetica', 'bold')
    doc.text('Total HT:', 130, currentY)
    doc.text('TVA (20%):', 130, currentY + 7)
    doc.text('Total TTC:', 130, currentY + 14)
    
    const totalHT = (amountPaid / 1.20).toFixed(2)
    const tva = (amountPaid - (amountPaid / 1.20)).toFixed(2)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`${totalHT} €`, 170, currentY)
    doc.text(`${tva} €`, 170, currentY + 7)
    doc.setFont('helvetica', 'bold')
    doc.text(`${amountPaidEur} €`, 170, currentY + 14)
    
    // Footer
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(39, 1, 127) // #27017F
    doc.text('Merci pour votre confiance !', 105, 210, { align: 'center' })
    doc.text('Label Startup Engagée - www.label-startup-engagee.fr', 105, 270, { align: 'center' })
    
    // Convert to ArrayBuffer
    const pdfBytes = doc.output('arraybuffer')
    
    return new Response(
      pdfBytes,
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="facture_${payment.id.substring(0, 8)}.pdf"` 
        } 
      }
    )
  } catch (error) {
    console.error('Erreur de génération de facture:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Vérifiez que le paiement existe et qu\'il est marqué comme payé'
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
