
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { companyName } = await req.json()
    console.log(`Received request to fetch Airtable data for company: "${companyName}"`)

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: 'Le nom de l\'entreprise est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const airtableApiKey = Deno.env.get('AIRTABLE_API_KEY')
    if (!airtableApiKey) {
      return new Response(
        JSON.stringify({ error: 'Configuration Airtable manquante', details: 'AIRTABLE_API_KEY n\'est pas définie' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Construire la requête pour Airtable
    const baseId = 'app7al7op0zAJYssh' // Base ID for your Airtable
    const tableId = 'Entreprises' // Le nom exact de la table Airtable
    const encodedTableName = encodeURIComponent(tableId)
    
    // Construire la formule pour filtrer par nom d'entreprise
    const filterByFormula = encodeURIComponent(`{Company Name} = "${companyName}"`)
    
    const url = `https://api.airtable.com/v0/${baseId}/${encodedTableName}?filterByFormula=${filterByFormula}`
    
    console.log(`Fetching data from Airtable URL: ${url}`)

    // Appel API Airtable
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Airtable API error (${response.status}): ${errorText}`)
      return new Response(
        JSON.stringify({ 
          error: `Erreur API Airtable (${response.status})`, 
          details: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      )
    }

    const result = await response.json()
    console.log('Airtable API response:', JSON.stringify(result, null, 2))

    if (!result.records || result.records.length === 0) {
      console.log(`No data found for company: "${companyName}"`)
      return new Response(
        JSON.stringify({ 
          error: 'Entreprise non trouvée', 
          details: `Aucune donnée trouvée pour l'entreprise: "${companyName}"` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Extraire les données pertinentes du premier enregistrement correspondant
    const recordData = result.records[0] as AirtableRecord
    console.log('Found record:', JSON.stringify(recordData, null, 2))

    // Mapper les champs Airtable vers notre structure de données
    const formattedData = {
      companyName: companyName,
      // Prendre les valeurs des scores si elles existent
      governanceScore: recordData.fields['Governance Score'] || null,
      environmentalScore: recordData.fields['Environmental Score'] || null,
      socialImpactScore: recordData.fields['Social Impact Score'] || null,
      averageScore: recordData.fields['Average Score'] || null,
      echelonTexte: recordData.fields['Echelon Texte'] || null,
      dateValidation: recordData.fields['Date Validation'] || null,
      dateFinValidite: recordData.fields['Date Fin Validité'] || null,
      logoUrl: recordData.fields['Logo'] ? 
        (Array.isArray(recordData.fields['Logo']) && recordData.fields['Logo'].length > 0 ? 
          recordData.fields['Logo'][0].url : null) : null,
      // Add the specific field for social impact development
      developmentImpactSocialPositif: recordData.fields['Développement d\'impact social positif (%)'] || null,
    }

    console.log('Formatted data for response:', JSON.stringify(formattedData, null, 2))

    // Retourner les données formatées
    return new Response(
      JSON.stringify(formattedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in airtable-fetch function:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
