import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TieredBarChart, SustainabilityRadarChart, RadarDataPoint } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define types for our chart data
type CompanyData = {
  companyName: string;
  governanceScore?: number;
  environmentalScore?: number;
  socialImpactScore?: number;
  averageScore?: number;
};

export const DashboardCharts = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Récupérer le nom de l'entreprise depuis Supabase
  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('label_submissions')
          .select('nom_entreprise')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data && data.nom_entreprise) {
          setCompanyName(data.nom_entreprise);
          console.log(`Nom d'entreprise récupéré: ${data.nom_entreprise}`);
        } else {
          console.log('Aucun nom d\'entreprise trouvé');
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données de votre entreprise",
          variant: "destructive"
        });
      }
    };

    fetchCompanyName();
  }, [toast]);

  // Récupérer les données depuis Airtable via notre Edge Function
  useEffect(() => {
    const fetchAirtableData = async () => {
      if (!companyName) return;
      
      setIsLoading(true);
      setError(null);
      setErrorDetails(null);
      
      try {
        console.log(`Fetching Airtable data for company: ${companyName}`);
        
        const { data, error } = await supabase.functions.invoke('airtable-fetch', {
          body: { companyName }
        });

        if (error) {
          console.error('Supabase function invocation error:', error);
          throw new Error(`Erreur d'invocation: ${error.message}`);
        }
        
        if (data.error) {
          console.error('Airtable error from function:', data.error, data.details || '');
          setErrorDetails(data.details || 'Aucun détail disponible');
          throw new Error(data.error);
        }
        
        console.log('Airtable data received:', data);
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching Airtable data:', error);
        setError(error.message || "Impossible de récupérer vos données depuis Airtable");
        toast({
          title: "Erreur de connexion à Airtable",
          description: "Problème de connexion à la base de données. Veuillez vérifier les autorisations et identifiants Airtable.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (companyName) {
      fetchAirtableData();
    } else {
      setIsLoading(false);
    }
  }, [companyName, toast]);

  // Données par défaut (affichées en attendant les données d'Airtable)
  const defaultChartData = [
    { name: 'Vos résultats', value: 0 },
    { name: 'Moyenne globale', value: 65 }
  ];

  // Conversion des données pour les graphiques
  const getGovernanceChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.governanceScore || 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65  // Valeur fixe pour la démonstration
      }
    ];
  };

  const getEnvironmentalChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.environmentalScore || 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65  // Valeur fixe pour la démonstration
      }
    ];
  };

  const getSocialImpactChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.socialImpactScore || 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65  // Valeur fixe pour la démonstration
      }
    ];
  };

  const getAverageChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.averageScore || 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65  // Valeur fixe pour la démonstration
      }
    ];
  };

  // Données pour le radar chart
  const radarData: RadarDataPoint[] = [
    { subject: 'Diversité', myScore: 65, maxScore: 90 },
    { subject: 'Égalité', myScore: 75, maxScore: 95 },
    { subject: 'Handicap', myScore: 60, maxScore: 85 },
    { subject: 'Santé des salariés', myScore: 70, maxScore: 90 },
    { subject: 'Parentalité', myScore: 80, maxScore: 95 },
    { subject: 'Formation', myScore: 65, maxScore: 90 },
    { subject: 'Politique RSE', myScore: 75, maxScore: 100 },
    { subject: 'Privacy/Data', myScore: 70, maxScore: 90 },
    { subject: 'Transports', myScore: 55, maxScore: 80 },
    { subject: 'Contribution associative', myScore: 60, maxScore: 85 },
    { subject: 'Achats responsables', myScore: 65, maxScore: 90 },
    { subject: 'Numérique responsable', myScore: 70, maxScore: 95 },
    { subject: 'Communication', myScore: 75, maxScore: 90 },
    { subject: 'Relation fournisseurs', myScore: 60, maxScore: 85 },
    { subject: 'Impact social', myScore: 70, maxScore: 95 },
    { subject: 'Production', myScore: 65, maxScore: 90 },
    { subject: 'Recyclage', myScore: 60, maxScore: 85 },
    { subject: 'Éco-conception', myScore: 70, maxScore: 95 },
    { subject: 'Évaluation permanente', myScore: 75, maxScore: 90 },
    { subject: 'Ressources énergétiques', myScore: 65, maxScore: 90 },
    { subject: 'Émissions carbone', myScore: 60, maxScore: 85 },
    { subject: 'Économie circulaire', myScore: 70, maxScore: 95 },
  ];

  // Afficher un message de chargement ou d'erreur
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 transition-all duration-200 h-[400px] flex items-center justify-center">
            <div className="text-gray-500">Chargement des données...</div>
          </Card>
        ))}
      </div>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 transition-all duration-200 h-auto flex flex-col items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl p-4">
            <div className="text-red-500 font-medium text-lg">Erreur de récupération des données</div>
            <p className="text-gray-600">{error}</p>
            
            {errorDetails && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200 text-left overflow-auto max-h-60 w-full">
                <p className="text-sm font-medium text-gray-700 mb-2">Détails de l'erreur:</p>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">{errorDetails}</pre>
              </div>
            )}
            
            <div className="flex flex-col gap-2 mt-6">
              <p className="text-gray-500 text-sm">Informations de débogage:</p>
              <ul className="text-left text-xs text-gray-500 list-disc list-inside">
                <li>Base Airtable ID: app7al7op0zAJYssh</li>
                <li>Table: Company Data</li>
                <li>Nom d'entreprise utilisé: {companyName || "Non défini"}</li>
              </ul>
              <p className="text-gray-500 text-sm mt-4">Veuillez vérifier votre connexion à Airtable ou contacter l'assistance.</p>
            </div>
          </div>
        </Card>
        
        {/* Afficher les graphiques avec données par défaut même en cas d'erreur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
            <TieredBarChart 
              title="Gouvernance juste et inclusive" 
              data={defaultChartData}
              tiers={{
                tier1: 80,
                tier2: 60,
                tier3: 40
              }}
              barColor="#8985FF"
              tierLabels={{
                tier1: "Échelon 1",
                tier2: "Échelon 2",
                tier3: "Échelon 3"
              }}
            />
          </Card>
          
          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
            <TieredBarChart 
              title="Développement d'impact social positif" 
              data={defaultChartData}
              tiers={{
                tier1: 85,
                tier2: 65,
                tier3: 45
              }}
              barColor="#8985FF"
              tierLabels={{
                tier1: "Échelon 1",
                tier2: "Échelon 2",
                tier3: "Échelon 3"
              }}
            />
          </Card>

          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
            <TieredBarChart 
              title="Maitrise d'impact environnemental et développement durable" 
              data={defaultChartData}
              tiers={{
                tier1: 90,
                tier2: 70,
                tier3: 50
              }}
              barColor="#8985FF"
              tierLabels={{
                tier1: "Échelon 1",
                tier2: "Échelon 2",
                tier3: "Échelon 3"
              }}
            />
          </Card>

          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
            <TieredBarChart 
              title="Moyenne des labellisés" 
              data={defaultChartData}
              tiers={{
                tier1: 95,
                tier2: 75,
                tier3: 55
              }}
              barColor="#35DA56"
              tierLabels={{
                tier1: "Échelon 1",
                tier2: "Échelon 2",
                tier3: "Échelon 3"
              }}
            />
          </Card>
        </div>
      </div>
    );
  }

  // Si tout va bien, afficher les graphiques avec les données réelles
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
        <TieredBarChart 
          title="Gouvernance juste et inclusive" 
          data={getGovernanceChartData()}
          tiers={{
            tier1: 80,
            tier2: 60,
            tier3: 40
          }}
          barColor="#8985FF"
          tierLabels={{
            tier1: "Échelon 1",
            tier2: "Échelon 2",
            tier3: "Échelon 3"
          }}
        />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
        <TieredBarChart 
          title="Développement d'impact social positif" 
          data={getSocialImpactChartData()}
          tiers={{
            tier1: 85,
            tier2: 65,
            tier3: 45
          }}
          barColor="#8985FF"
          tierLabels={{
            tier1: "Échelon 1",
            tier2: "Échelon 2",
            tier3: "Échelon 3"
          }}
        />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
        <TieredBarChart 
          title="Maitrise d'impact environnemental et développement durable" 
          data={getEnvironmentalChartData()}
          tiers={{
            tier1: 90,
            tier2: 70,
            tier3: 50
          }}
          barColor="#8985FF"
          tierLabels={{
            tier1: "Échelon 1",
            tier2: "Échelon 2",
            tier3: "Échelon 3"
          }}
        />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
        <TieredBarChart 
          title="Moyenne des labellisés" 
          data={getAverageChartData()}
          tiers={{
            tier1: 95,
            tier2: 75,
            tier3: 55
          }}
          barColor="#35DA56"
          tierLabels={{
            tier1: "Échelon 1",
            tier2: "Échelon 2",
            tier3: "Échelon 3"
          }}
        />
      </Card>

      {/* Radar Chart */}
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[600px] md:col-span-2">
        <SustainabilityRadarChart 
          title="Analyse comparative des critères de durabilité" 
          data={radarData} 
          myScoreColor="#0EA5E9" 
          maxScoreColor="#35DA56" 
        />
      </Card>
    </div>
  );
};
