
import { corsHeaders } from '../_shared/cors.ts'

// Définition des types pour nos données
type AirtableResponse = {
  records: Array<{
    id: string;
    fields: Record<string, any>;
  }>;
};

type EchelonData = {
  id: string;
  nom: string;
  gouvernance: {
    min: number;
    max: number;
  };
  social: {
    min: number;
    max: number;
  };
  environnement: {
    min: number;
    max: number;
  };
  total: {
    min: number;
    max: number;
  };
  couleur?: string;
};

Deno.serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Récupération des données d'échelons depuis Airtable");

    // Récupération de la clé API d'Airtable depuis les variables d'environnement
    const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
    
    if (!AIRTABLE_API_KEY) {
      throw new Error("Clé API Airtable manquante");
    }
    
    // ID de la base Airtable et nom de la table
    const baseId = 'app7al7op0zAJYssh';
    const tableName = 'Echelons';
    const encodedTableName = encodeURIComponent(tableName);
    
    // Construction de l'URL de l'API Airtable
    const url = `https://api.airtable.com/v0/${baseId}/${encodedTableName}`;
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
          details: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    const data: AirtableResponse = await response.json();
    console.log(`Reçu ${data.records.length} échelons depuis Airtable`);

    if (data.records.length === 0) {
      // Retourne un message spécifique lorsqu'aucune donnée n'est trouvée
      return new Response(
        JSON.stringify({ 
          error: 'Aucune donnée d\'échelon trouvée',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Transformation des données Airtable en format utilisable
    const echelons: EchelonData[] = data.records.map(record => {
      console.log("Traitement de l'échelon:", record.fields.Nom);
      
      return {
        id: record.id,
        nom: record.fields.Nom || '',
        gouvernance: {
          min: record.fields.Gouvernance_Min || 0,
          max: record.fields.Gouvernance_Max || 100
        },
        social: {
          min: record.fields.Social_Min || 0,
          max: record.fields.Social_Max || 100
        },
        environnement: {
          min: record.fields.Environnement_Min || 0,
          max: record.fields.Environnement_Max || 100
        },
        total: {
          min: record.fields.Total_Min || 0,
          max: record.fields.Total_Max || 100
        },
        couleur: record.fields.Couleur || '#8985FF'
      };
    });

    console.log(`Données d'échelons traitées:`, echelons);

    return new Response(
      JSON.stringify(echelons),
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
