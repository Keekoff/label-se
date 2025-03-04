
import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only use companyName from the request, always using "Entreprises" as filterField
    const { companyName } = await req.json();
    const filterField = "Entreprises"; // Corrected from "Entreprise" to "Entreprises"
    
    if (!companyName) {
      return new Response(
        JSON.stringify({ 
          error: 'Nom d\'entreprise manquant',
          details: 'Veuillez fournir un nom d\'entreprise valide.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Recherche de l'entreprise par le champ "${filterField}": "${companyName}"`);

    // Construct the Airtable API URL with proper encoding
    const baseId = 'appiUmKvXnN1SSWtz';
    const tableId = 'tblMcrqK1NkZGpCsm';
    const apiKey = Deno.env.get('AIRTABLE_API_KEY');

    if (!apiKey) {
      throw new Error('Clé API Airtable manquante');
    }

    const encodedFilter = encodeURIComponent(`{${filterField}} = "${companyName}"`);
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${encodedFilter}`;

    console.log(`URL de requête Airtable: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur Airtable:', errorData);
      throw new Error(`Erreur Airtable: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Données Airtable reçues:', JSON.stringify(data));

    if (!data.records || data.records.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Entreprise non trouvée', 
          details: `Aucune entreprise trouvée avec le nom "${companyName}".`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get the fields from the first record
    const fields = data.records[0].fields;
    console.log('Champs extraits:', JSON.stringify(fields));
    
    // Print social impact field value for debugging
    console.log('Valeur du champ social impact:', fields['Développement d\'impact social positif (%)']);

    // Extract and format the required fields, ensuring proper handling of the social impact field
    const result = {
      companyName: fields[filterField] || companyName,
      governanceScore: fields['Gouvernance juste et inclusive (%)'] !== undefined ? 
        parseFloat(fields['Gouvernance juste et inclusive (%)']) / 100 : undefined,
      environmentalScore: fields['Maitrise d\'impact environnemental et développement durable (%)'] !== undefined ? 
        parseFloat(fields['Maitrise d\'impact environnemental et développement durable (%)']) / 100 : undefined,
      socialImpactScore: fields['Développement d\'impact social positif (%)'] !== undefined ? 
        parseFloat(fields['Développement d\'impact social positif (%)']) / 100 : undefined,
      averageScore: fields['Moyenne (%)'] !== undefined ? 
        parseFloat(fields['Moyenne (%)']) / 100 : undefined,
      echelonTexte: fields['Echelon'] || null,
      logoUrl: fields['Logo'] ? fields['Logo'][0].url : null,
      dateValidation: fields['Date Validation'] || null,
      dateFinValidite: fields['Date Fin Validité'] || null,
      // Add the raw percentage value for social impact
      "Développement d'impact social positif (%)": fields['Développement d\'impact social positif (%)']
    };

    console.log('Données formatées:', JSON.stringify(result));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur interne', 
        details: 'Une erreur s\'est produite lors de la récupération des données Airtable.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
