
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Configuration du client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Variables d\'environnement Supabase manquantes')
      return new Response(
        JSON.stringify({ error: 'Erreur de configuration du serveur' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Récupérer les paramètres de la requête
    const url = new URL(req.url)
    const submissionId = url.searchParams.get('submissionId')

    // Valider les paramètres obligatoires
    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'ID de soumission requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Récupération des documents pour la soumission spécifiée
    console.log(`Récupération des justificatifs pour la soumission: ${submissionId}`);
    
    const { data, error } = await supabase
      .from('form_justificatifs')
      .select('*')
      .eq('submission_id', submissionId);

    if (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des documents' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Nombre de justificatifs trouvés: ${data ? data.length : 0}`);
    
    return new Response(
      JSON.stringify(data || []),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur:', error.message);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors du traitement de votre demande' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
