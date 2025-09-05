
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
  // Champ spécifique pour le développement d'impact social positif
  developpementImpactSocialPositifPercentage?: number;
  // Champ pour le score insuffisant
  insufficientScore?: boolean;
  // Scores des critères pour le radar chart
  criteriaScores?: {
    [key: string]: number;
  };
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
    const tableName = 'Entreprises'; // Nom correct de la table
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
    const socialImpactField = record.fields['Développement d\'impact social positif (%)'];
    console.log("Valeur brute du champ développement d'impact social positif:", socialImpactField);
    
    // Déboguer spécifiquement la valeur Echelon_texte
    console.log("Valeur de Echelon_texte:", record.fields['Echelon_texte']);
    
    // Récupération du champ "Score insuffisant"
    const scoreInsuffisantRaw = record.fields['Score insuffisant'];
    console.log(`Valeur brute du champ Score insuffisant: ${scoreInsuffisantRaw}`);
    
    // Parse robuste du champ "Score insuffisant"
    let insufficientScore = false;
    if (scoreInsuffisantRaw !== undefined && scoreInsuffisantRaw !== null) {
      if (typeof scoreInsuffisantRaw === 'string') {
        insufficientScore = scoreInsuffisantRaw.toLowerCase().trim() === 'oui';
      } else if (typeof scoreInsuffisantRaw === 'boolean') {
        insufficientScore = scoreInsuffisantRaw;
      } else if (Array.isArray(scoreInsuffisantRaw)) {
        insufficientScore = scoreInsuffisantRaw.some(val => 
          typeof val === 'string' && val.toLowerCase().trim() === 'oui'
        );
      }
    }
    console.log(`Score insuffisant traité: ${insufficientScore}`);
    
    // Liste des critères pour le radar chart
    const criteriaFields = [
      { name: "Diversité", field: "Score Diversité" },
      { name: "Égalité", field: "Score Egalité" }, // Fixed: removed accent in field name
      { name: "Handicap", field: "Score Handicap" },
      { name: "Santé des salariés/bien-être au travail", field: "Score Santé des salariés/bien-être au travail" },
      { name: "Parentalité", field: "Score Parentalité" },
      { name: "Formation", field: "Score Formation" },
      { name: "Politique RSE", field: "Score Politique RSE" },
      { name: "Privacy/Data", field: "Score Privacy/Data" },
      { name: "Transports", field: "Score Transports" },
      { name: "Contribution associative", field: "Score Contribution associative" },
      { name: "Politique d'achats responsables", field: "Score Politique d'achats responsables" },
      { name: "Numérique responsable", field: "Score Numérique responsable" },
      { name: "Communication", field: "Score Communication" },
      { name: "Relation fournisseurs et prestataires", field: "Score Relation fournisseurs et prestataires" },
      { name: "Prise en compte de l'impact social", field: "Score Prise en compte de l'impact social" },
      { name: "Production : énergie & matériaux utilisés", field: "Score Production : énergie & matériaux utilisés" },
      { name: "Recyclage & gestion des déchets", field: "Score Recyclage & gestion des déchets" },
      { name: "Éco-conception", field: "Score Eco-conception" }, // Fixed: removed accent in field name
      { name: "Évaluation permanente", field: "Score Évaluation permanente" },
      { name: "Maîtrise et optimisation de la consommation de ressources énergétiques", field: "Score Maîtrise et optimisation de la consommation de ressources énergétiques" },
      { name: "Plan de contrôle / limite des émissions carbones", field: "Score Plan de controle / limite des émissions carbones" }, // Corrigé : suppression de l'accent dans le nom du champ
      { name: "Gestion participative & économie circulaire", field: "Score Gestion participative & économie circulaire" }
    ];
    
    // Récupération des scores des critères
    const criteriaScores: { [key: string]: number } = {};
    for (const criteria of criteriaFields) {
      const score = record.fields[criteria.field];
      if (score !== undefined) {
        criteriaScores[criteria.name] = Number(score);
        console.log(`Score pour ${criteria.name}: ${score}`);
      } else {
        console.log(`Aucun score trouvé pour ${criteria.name}`);
        criteriaScores[criteria.name] = 0; // Valeur par défaut
      }
    }
    
    // Mapping des champs Airtable en utilisant les noms exacts des champs
    const companyData: CompanyData = {
      companyName,
      governanceScore: record.fields['Gouvernance juste & inclusive %'] || 0,
      environmentalScore: record.fields['Maitrise d\'impact environnemental et développement durable %'] || 0,
      socialImpactScore: record.fields['Développement d\'impact social positif %'] || 0,
      averageScore: record.fields['TOTAL %'] || 0,
      // Champ spécifique pour le développement d'impact social positif
      developpementImpactSocialPositifPercentage: record.fields['Développement d\'impact social positif (%)'] || 0,
      // Champs pour la certification
      echelonTexte: record.fields['Echelon_texte'] || '',
      logoUrl: record.fields['Logo (from Millésime)']?.[0]?.url || '',
      dateValidation: record.fields['Date validation label'] || '',
      dateFinValidite: record.fields['Date fin validité label'] || '',
      // Champ pour le score insuffisant
      insufficientScore: insufficientScore,
      // Scores des critères pour le radar chart
      criteriaScores
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
