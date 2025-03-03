
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'
import { format } from 'https://esm.sh/date-fns@2.30.0'
import { fr } from 'https://esm.sh/date-fns@2.30.0/locale'

// Configuration des en-têtes CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gérer la requête OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Récupérer les données de la requête
    const { paymentId } = await req.json()

    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: 'ID de paiement manquant' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialiser le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Récupérer les détails du paiement depuis la base de données
    const { data: paymentData, error: paymentError } = await supabase
      .from('label_submissions')
      .select('id, created_at, payment_id, nom_entreprise, payment_status, user_id, montant')
      .eq('payment_id', paymentId)
      .single()

    if (paymentError || !paymentData) {
      console.error('Erreur lors de la récupération des détails du paiement:', paymentError)
      return new Response(
        JSON.stringify({ error: 'Impossible de trouver le paiement demandé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Récupérer les informations de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', paymentData.user_id)
      .single()

    // Générer le PDF
    const doc = new jsPDF()
    
    // Ajouter le titre et les informations d'en-tête
    doc.setFillColor(53, 218, 86) // #35DA56
    doc.rect(0, 0, 210, 30, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('FACTURE', 105, 20, { align: 'center' })
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    
    // Informations de l'entreprise émettrice
    doc.text('Label Startup Engagée', 15, 45)
    doc.text('SIRET: 123 456 789 00010', 15, 52)
    doc.text('123 Avenue des Startups', 15, 59)
    doc.text('75001 Paris, France', 15, 66)
    
    // Informations de facturation
    const dateFacture = format(new Date(paymentData.created_at), 'dd/MM/yyyy')
    const numeroFacture = `LSE-${paymentData.payment_id.substring(0, 8)}`
    
    doc.text(`Facture N° : ${numeroFacture}`, 140, 45)
    doc.text(`Date : ${dateFacture}`, 140, 52)
    
    // Informations du client
    doc.text('Facturé à :', 15, 85)
    doc.setFontSize(11)
    doc.text(paymentData.nom_entreprise || 'Client', 15, 92)
    
    if (userData) {
      if (userData.address) doc.text(userData.address, 15, 99)
      if (userData.email) doc.text(userData.email, 15, 106)
    }
    
    // Ligne de séparation
    doc.setDrawColor(220, 220, 220)
    doc.line(15, 115, 195, 115)
    
    // En-têtes du tableau
    doc.setFillColor(240, 240, 240)
    doc.rect(15, 120, 180, 10, 'F')
    
    doc.setFontSize(10)
    doc.text('Description', 20, 127)
    doc.text('Montant HT', 140, 127)
    doc.text('TVA', 165, 127)
    doc.text('Montant TTC', 185, 127)
    
    // Ligne d'article
    const montantHT = paymentData.montant ? (paymentData.montant / 1.2) : 500
    const montantTVA = paymentData.montant ? (paymentData.montant - montantHT) : 100
    const montantTTC = paymentData.montant || 600
    
    doc.setFontSize(10)
    doc.text('Label Startup Engagée - Certification', 20, 140)
    doc.text(`${montantHT.toFixed(2)} €`, 140, 140, { align: 'right' })
    doc.text('20%', 165, 140, { align: 'right' })
    doc.text(`${montantTTC.toFixed(2)} €`, 185, 140, { align: 'right' })
    
    // Ligne de séparation
    doc.line(15, 150, 195, 150)
    
    // Total
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text('Total HT :', 140, 160, { align: 'right' })
    doc.text(`${montantHT.toFixed(2)} €`, 185, 160, { align: 'right' })
    
    doc.text('TVA (20%) :', 140, 167, { align: 'right' })
    doc.text(`${montantTVA.toFixed(2)} €`, 185, 167, { align: 'right' })
    
    doc.text('Total TTC :', 140, 174, { align: 'right' })
    doc.text(`${montantTTC.toFixed(2)} €`, 185, 174, { align: 'right' })
    
    // Pied de page
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.text('Label Startup Engagée - SAS au capital de 10 000 € - RCS Paris 123 456 789', 105, 260, { align: 'center' })
    doc.text('TVA Intracommunautaire : FR12345678900010', 105, 265, { align: 'center' })
    doc.text('Siège social : 123 Avenue des Startups, 75001 Paris, France', 105, 270, { align: 'center' })
    
    // Convertir le PDF en données binaires
    const pdfOutput = doc.output('arraybuffer')
    
    // Renvoyer le PDF généré
    return new Response(
      pdfOutput,
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="facture_${paymentData.nom_entreprise.replace(/\s+/g, '_')}_${dateFacture.replace(/\//g, '-')}.pdf"` 
        },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération de la facture', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
