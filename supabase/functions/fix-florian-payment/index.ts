
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    // Rechercher la soumission de Florian par email
    const { data: submission, error: findError } = await supabaseClient
      .from('label_submissions')
      .select('*')
      .eq('courriel', 'florian.gardesse@gmail.com')
      .eq('nom_entreprise', 'Papacito')
      .maybeSingle()

    if (findError) {
      console.error('Error finding submission:', findError)
      throw new Error('Erreur lors de la recherche de la soumission')
    }

    if (!submission) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Soumission de Florian non trouvée'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Found submission for Florian:', submission.id, 'Current status:', submission.payment_status)

    // Mettre à jour le statut de paiement
    const { error: updateError } = await supabaseClient
      .from('label_submissions')
      .update({ 
        payment_status: 'paid',
        payment_date: new Date().toISOString()
      })
      .eq('id', submission.id)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
      throw new Error('Erreur lors de la mise à jour du statut de paiement')
    }

    console.log('Payment status updated successfully for Florian')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Statut de paiement de Florian mis à jour avec succès',
        submissionId: submission.id,
        previousStatus: submission.payment_status,
        newStatus: 'paid'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Fix payment error:', error)
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
