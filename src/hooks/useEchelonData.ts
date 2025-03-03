
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCompanyData } from '@/hooks/useCompanyData';

export type EchelonData = {
  id: string;
  echelon: string;
  governanceAverage: number;
  socialImpactAverage: number;
  environmentalAverage: number;
  totalAverage: number;
};

export const useEchelonData = () => {
  const { toast } = useToast();
  const { companyData } = useCompanyData();
  const [isLoading, setIsLoading] = useState(true);
  const [echelonData, setEchelonData] = useState<EchelonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEchelonData = async () => {
      if (!companyData?.echelonTexte) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Gérer le cas où echelonTexte pourrait être un tableau
        let echelonValue: string;
        if (Array.isArray(companyData.echelonTexte)) {
          echelonValue = companyData.echelonTexte[0] || '';
        } else {
          echelonValue = companyData.echelonTexte;
        }
        
        console.log('Récupération des données d\'échelon depuis Airtable pour l\'échelon:', echelonValue);
        
        const { data, error } = await supabase.functions.invoke('airtable-echelons', {
          body: { echelon: echelonValue }
        });

        if (error) {
          console.error('Erreur d\'invocation de fonction Supabase:', error);
          throw new Error(`Erreur d'invocation: ${error.message}`);
        }
        
        if (data.error) {
          console.error('Erreur Airtable depuis la fonction:', data.error, data.details || '');
          throw new Error(data.error);
        }
        
        console.log('Données d\'échelon reçues:', data);
        
        // Si nous avons des données et c'est un tableau avec au moins un élément
        if (Array.isArray(data) && data.length > 0) {
          // Filtrer les données par l'échelon de l'entreprise
          const matchingEchelonData = data.find(item => item.echelon === echelonValue);
          
          if (matchingEchelonData) {
            console.log(`Données d'échelon correspondantes trouvées pour l'échelon ${echelonValue}:`, matchingEchelonData);
            
            // Convertir les valeurs en nombres et s'assurer qu'elles sont bien des pourcentages
            const processedData = {
              ...matchingEchelonData,
              // S'assurer que les valeurs sont des nombres
              governanceAverage: typeof matchingEchelonData.governanceAverage === 'number' ? matchingEchelonData.governanceAverage : 0,
              socialImpactAverage: typeof matchingEchelonData.socialImpactAverage === 'number' ? matchingEchelonData.socialImpactAverage : 0,
              environmentalAverage: typeof matchingEchelonData.environmentalAverage === 'number' ? matchingEchelonData.environmentalAverage : 0,
              totalAverage: typeof matchingEchelonData.totalAverage === 'number' ? matchingEchelonData.totalAverage : 0
            };
            
            console.log('Valeurs d\'échelon à utiliser:', {
              gouvernance: processedData.governanceAverage,
              socialImpact: processedData.socialImpactAverage,
              environmental: processedData.environmentalAverage,
              total: processedData.totalAverage
            });
            
            setEchelonData(processedData);
          } else {
            // Si aucune correspondance exacte n'est trouvée, utiliser le premier élément (comportement précédent)
            console.warn(`Aucune donnée exacte trouvée pour l'échelon ${echelonValue}, utilisation des valeurs par défaut.`);
            
            const processedData = {
              ...data[0],
              // S'assurer que les valeurs sont des nombres
              governanceAverage: typeof data[0].governanceAverage === 'number' ? data[0].governanceAverage : 0,
              socialImpactAverage: typeof data[0].socialImpactAverage === 'number' ? data[0].socialImpactAverage : 0,
              environmentalAverage: typeof data[0].environmentalAverage === 'number' ? data[0].environmentalAverage : 0,
              totalAverage: typeof data[0].totalAverage === 'number' ? data[0].totalAverage : 0
            };
            
            setEchelonData(processedData);
          }
        } else {
          console.warn('Aucune donnée d\'échelon trouvée pour:', echelonValue);
          // Si aucune donnée n'est trouvée, créer un ensemble de données par défaut pour éviter les erreurs
          setEchelonData({
            id: "default",
            echelon: echelonValue,
            governanceAverage: 0,
            socialImpactAverage: 0,
            environmentalAverage: 0,
            totalAverage: 0
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données d\'échelon Airtable:', error);
        setError(error.message || "Impossible de récupérer les données d'échelons depuis Airtable");
        toast({
          title: "Erreur de connexion à Airtable",
          description: "Problème lors de la récupération des données d'échelons.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEchelonData();
  }, [companyData?.echelonTexte, toast]);

  return {
    isLoading,
    echelonData,
    error
  };
};
