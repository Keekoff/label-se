
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import jsPDF from 'jspdf'
import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'

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
      throw new Error('Supabase URL or key missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get request body
    const { paymentId } = await req.json()

    if (!paymentId) {
      throw new Error('Payment ID is required')
    }

    // Fetch payment information
    const { data: payment, error } = await supabase
      .from('label_submissions')
      .select('id, created_at, nom_entreprise, payment_id')
      .eq('payment_id', paymentId)
      .single()

    if (error || !payment) {
      console.error('Error fetching payment:', error)
      throw new Error('Paiement introuvable')
    }

    // Generate PDF invoice
    const doc = new jsPDF()
    
    // Add logo (if you want to add this later)
    // const logoWidth = 40
    // doc.addImage(logoBase64, 'PNG', 15, 15, logoWidth, logoWidth * 0.5)
    
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
    doc.text(payment.nom_entreprise || 'Client', 130, 57)
    
    // Invoice details
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Numéro de facture:', 15, 95)
    doc.text('Date de facturation:', 15, 102)
    doc.text('Référence:', 15, 109)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`INV-${payment.id.substring(0, 8)}`, 75, 95)
    doc.text(format(new Date(payment.created_at), 'dd/MM/yyyy'), 75, 102)
    doc.text(payment.payment_id, 75, 109)
    
    // Table header
    doc.setFont('helvetica', 'bold')
    doc.rect(15, 120, 180, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text('Description', 20, 127)
    doc.text('Quantité', 100, 127)
    doc.text('Prix', 130, 127)
    doc.text('Total', 170, 127)
    
    // Table content
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text('Label Startup Engagée - Certification annuelle', 20, 140)
    doc.text('1', 100, 140)
    doc.text('800,00 €', 130, 140)
    doc.text('800,00 €', 170, 140)
    
    // Total
    doc.line(15, 150, 195, 150)
    doc.setFont('helvetica', 'bold')
    doc.text('Total HT:', 130, 160)
    doc.text('TVA (20%):', 130, 167)
    doc.text('Total TTC:', 130, 174)
    
    doc.setFont('helvetica', 'normal')
    doc.text('666,67 €', 170, 160)
    doc.text('133,33 €', 170, 167)
    doc.text('800,00 €', 170, 174)
    
    // Footer
    doc.setFontSize(10)
    doc.text('Merci pour votre confiance!', 105, 200, { align: 'center' })
    doc.text('Label Startup Engagée - www.label-startup-engagee.fr', 105, 270, { align: 'center' })
    
    // Convert to ArrayBuffer
    const pdfBytes = doc.output('arraybuffer')
    
    return new Response(
      pdfBytes,
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="facture_${paymentId}.pdf"` 
        } 
      }
    )
  } catch (error) {
    console.error('Error generating invoice:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
