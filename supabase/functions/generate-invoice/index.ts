
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import jsPDF from 'https://esm.sh/jspdf@2.5.1'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { format } from 'https://esm.sh/date-fns@3.6.0'

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

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL ou clé manquante')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get request body
    const { paymentId } = await req.json()

    if (!paymentId) {
      throw new Error('L\'ID de paiement est requis')
    }

    console.log('Récupération du paiement avec ID:', paymentId)

    // Fetch payment information avec plus de détails
    const { data: payment, error } = await supabase
      .from('label_submissions')
      .select('id, created_at, payment_date, nom_entreprise, payment_id, adresse, ville, code_postal, payment_status, prenom')
      .eq('payment_id', paymentId)
      .maybeSingle()

    if (error) {
      console.error('Erreur lors de la récupération du paiement:', error)
      throw new Error('Erreur lors de la récupération du paiement: ' + error.message)
    }

    if (!payment) {
      console.error('Paiement non trouvé pour ID:', paymentId)
      
      // Vérification supplémentaire - recherche par ID partiel
      const { data: partialMatches, error: partialError } = await supabase
        .from('label_submissions')
        .select('id, created_at, payment_date, nom_entreprise, payment_id, adresse, ville, code_postal, payment_status, prenom')
        .ilike('payment_id', `%${paymentId.substring(0, 20)}%`)
        .limit(1)
      
      if (partialError || !partialMatches || partialMatches.length === 0) {
        throw new Error('Paiement introuvable avec l\'ID: ' + paymentId)
      }
      
      console.log('Paiement trouvé avec correspondance partielle:', partialMatches[0])
      Object.assign(payment, partialMatches[0])
    }

    // Vérifier si le paiement est marqué comme payé
    if (payment.payment_status !== 'paid') {
      throw new Error(`Ce paiement n'est pas encore marqué comme payé (statut: ${payment.payment_status})`)
    }

    console.log('Paiement trouvé:', payment)

    // Construire l'adresse de facturation
    const addressComponents = [
      payment.adresse,
      payment.code_postal && payment.ville ? `${payment.code_postal} ${payment.ville}` : null
    ].filter(Boolean)
    
    const addressLines = addressComponents.length > 0 ? addressComponents : ['Adresse non disponible']

    // Generate PDF invoice
    const doc = new jsPDF()
    
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
    
    // Utiliser payment_date si disponible, sinon created_at
    const paymentDateToUse = payment.payment_date || payment.created_at
    doc.text(format(new Date(paymentDateToUse), 'dd/MM/yyyy'), 75, 109)
    
    doc.text(payment.payment_id || 'N/A', 75, 116)
    
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
    doc.text('666,67 €', 130, 150)
    doc.text('666,67 €', 170, 150)
    
    // Total section
    doc.line(15, 160, 195, 160)
    doc.setFont('helvetica', 'bold')
    doc.text('Total HT:', 130, 170)
    doc.text('TVA (20%):', 130, 177)
    doc.text('Total TTC:', 130, 184)
    
    doc.setFont('helvetica', 'normal')
    doc.text('666,67 €', 170, 170)
    doc.text('133,33 €', 170, 177)
    doc.setFont('helvetica', 'bold')
    doc.text('800,00 €', 170, 184)
    
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
