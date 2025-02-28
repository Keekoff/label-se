
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Autorisation
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Aucun jeton d\'authentification fourni' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Documents factices pour le moment
    const mockDocuments = [
      {
        id: "1",
        identifier: "Politique d'inclusion",
        response: "Diversité",
        document: "Charte de diversité"
      },
      {
        id: "2",
        identifier: "Économie d'énergie",
        response: "Gestion énergétique",
        document: "Rapport de consommation énergétique"
      },
      {
        id: "3",
        identifier: "Achats responsables",
        response: "Charte fournisseurs",
        document: "Liste de fournisseurs certifiés"
      }
    ]

    return new Response(
      JSON.stringify(mockDocuments),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erreur:', error.message)
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors du traitement de votre demande' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
