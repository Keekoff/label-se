
import { corsHeaders } from '../_shared/cors.ts'

// Définition des types pour nos données
type AirtableResponse = {
  records: Array<{
    id: string;
    fields: Record<string, any>;
  }>;
};

type CompanyData = {
  companyName: string;
  governanceScore?: number;
  environmentalScore?: number;
  socialImpactScore?: number;
  averageScore?: number;
  // Nouveaux champs pour la certification
  echelonTexte?: string;
  logoUrl?: string;
  dateValidation?: string;
  dateFinValidite?: string;
};

Deno.serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName } = await req.json();
    console.log(`Recherche des données pour l'entreprise: ${companyName}`);

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: 'Nom d\'entreprise manquant' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Utilisation de la clé API fournie directement pour déboguer
    // Note: Dans un environnement de production, utilisez toujours Deno.env.get
    const AIRTABLE_API_KEY = "patTdMAtQE60dFXlO.06084a9769e60b4732dd2cc3459092d54194dcb13cb73c4fd1f59768d4ec6a66";
    
    console.log(`Utilisation de la clé API Airtable: ${AIRTABLE_API_KEY.substring(0, 10)}...`);

    // Encodage du nom de l'entreprise pour l'URL
    const encodedCompanyName = encodeURIComponent(companyName);
    
    // Mise à jour avec les bons IDs de base Airtable et le nom de table correct
    const baseId = 'app7al7op0zAJYssh';
    const tableName = 'Entreprises'; // Nom de table correct
    const encodedTableName = encodeURIComponent(tableName);
    
    // Construction de l'URL de l'API Airtable
    const url = `https://api.airtable.com/v0/${baseId}/${encodedTableName}?filterByFormula=FIND("${encodedCompanyName}",{Entreprise})`;
    console.log(`URL de l'API Airtable: ${url}`);

    // Envoi de la requête à Airtable
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Affichage détaillé du statut de la réponse pour le débogage
    console.log(`Statut de la réponse Airtable: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API Airtable: ${response.status} ${errorText}`);
      
      // Retourne des informations d'erreur détaillées
      return new Response(
        JSON.stringify({ 
          error: `Erreur Airtable: ${response.status}`, 
          details: errorText,
          requestUrl: url.replace(AIRTABLE_API_KEY, '[MASQUÉ]')
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    const data: AirtableResponse = await response.json();
    console.log(`Reçu ${data.records.length} enregistrements depuis Airtable`);

    if (data.records.length === 0) {
      // Retourne un message spécifique lorsqu'aucune donnée n'est trouvée
      return new Response(
        JSON.stringify({ 
          error: 'Aucune donnée trouvée pour cette entreprise',
          companyName: companyName 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Extraction des champs pertinents
    const record = data.records[0];
    console.log("Champs disponibles:", Object.keys(record.fields));
    
    // Obtenir et afficher les valeurs exactes pour le débogage
    const socialImpactScoreField = record.fields['Développement d\'impact social positif %'];
    console.log("Valeur brute du champ social impact:", socialImpactScoreField);
    
    // Mapping des champs Airtable en utilisant les noms exacts des champs
    const companyData: CompanyData = {
      companyName,
      governanceScore: record.fields['Gouvernance juste & inclusive %'] || 0,
      environmentalScore: record.fields['Maitrise d\'impact environnemental et développement durable %'] || 0,
      socialImpactScore: record.fields['Développement d\'impact social positif %'] || 0,
      averageScore: record.fields['TOTAL %'] || 0,
      // Champs pour la certification
      echelonTexte: record.fields['Echelon_texte'] || '',
      logoUrl: record.fields['Logo (from Millésime)']?.[0]?.url || '',
      dateValidation: record.fields['Date validation label'] || '',
      dateFinValidite: record.fields['Date fin validité label'] || ''
    };

    console.log(`Données d'entreprise traitées:`, companyData);

    return new Response(
      JSON.stringify(companyData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur lors de la récupération des données Airtable:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
