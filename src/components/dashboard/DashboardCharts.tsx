import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TieredBarChart, SustainabilityRadarChart, RadarDataPoint } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Award, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type CompanyData = {
  companyName: string;
  governanceScore?: number;
  environmentalScore?: number;
  socialImpactScore?: number;
  averageScore?: number;
  echelonTexte?: string;
  logoUrl?: string;
  dateValidation?: string;
  dateFinValidite?: string;
};

export const DashboardCharts = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hasSubmittedForm, setHasSubmittedForm] = useState<boolean>(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('label_submissions')
          .select('nom_entreprise, status')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data && data.nom_entreprise) {
          setCompanyName(data.nom_entreprise);
          setHasSubmittedForm(data.status !== 'draft');
          console.log(`Nom d'entreprise récupéré: ${data.nom_entreprise}`);
          console.log(`Statut du formulaire: ${data.status}`);
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

  const defaultChartData = [
    { name: 'Vos résultats', value: 0 },
    { name: 'Moyenne globale', value: 65 }
  ];

  const getGovernanceChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.governanceScore ? Math.round(companyData.governanceScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65 
      }
    ];
  };

  const getEnvironmentalChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.environmentalScore ? Math.round(companyData.environmentalScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65 
      }
    ];
  };

  const getSocialImpactChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.socialImpactScore ? Math.round(companyData.socialImpactScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65 
      }
    ];
  };

  const getAverageChartData = () => {
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.averageScore ? Math.round(companyData.averageScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: 65 
      }
    ];
  };

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non définie";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return dateString;
    }
  };

  const handleDownloadPDF = async () => {
    if (!chartsContainerRef.current) return;
    
    try {
      setIsPdfGenerating(true);
      toast({
        title: "Génération du PDF en cours",
        description: "Veuillez patienter pendant la création de votre rapport...",
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.setFontSize(16);
      pdf.setTextColor(39, 1, 127); // #27017F
      pdf.text("Rapport de Performance - Label Startup Engagée", pdfWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Entreprise: ${companyName}`, 20, 25);
      pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 32);

      if (companyData?.echelonTexte) {
        pdf.text(`Niveau: ${companyData.echelonTexte}`, 20, 39);
        pdf.text(`Validité: ${formatDate(companyData.dateValidation)} - ${formatDate(companyData.dateFinValidite)}`, 20, 46);
      }
      
      const charts = chartsContainerRef.current.querySelectorAll('.chart-card');
      const chartPromises = Array.from(charts).map(async (chart, index) => {
        const canvas = await html2canvas(chart as HTMLElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        const isEvenIndex = index % 2 === 0;
        const row = Math.floor(index / 2);
        
        const imgWidth = 80;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const xPos = isEvenIndex ? 15 : pdfWidth - imgWidth - 15;
        const yPos = 55 + (row * (imgHeight + 10));
        
        if (yPos + imgHeight > pdfHeight && index < charts.length - 1) {
          pdf.addPage();
          return { imgData, xPos, yPos: 20, imgWidth, imgHeight };
        }
        
        return { imgData, xPos, yPos, imgWidth, imgHeight };
      });
      
      const chartPositions = await Promise.all(chartPromises);
      
      chartPositions.forEach((chart, index) => {
        if (index === 4) {
          pdf.addPage();
          chart.yPos = 20;
        }
        
        pdf.addImage(chart.imgData, 'PNG', chart.xPos, chart.yPos, chart.imgWidth, chart.imgHeight);
      });
      
      pdf.save(`rapport_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: "PDF généré avec succès",
        description: "Votre rapport a été téléchargé.",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {hasSubmittedForm && (
        <div className="bg-white border-2 border-[#35DA56] rounded-lg p-4 shadow-sm animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="text-[#35DA56] h-5 w-5" />
                <h3 className="font-semibold text-gray-800">Certification : Label Startup Engagée</h3>
              </div>
              <p className="text-gray-600">Niveau : {companyData?.echelonTexte || "Non défini"}</p>
              <p className="text-gray-600">Début de validité : {formatDate(companyData?.dateValidation)}</p>
              <p className="text-gray-600">Fin de validité : {formatDate(companyData?.dateFinValidite)}</p>
            </div>
            <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              {companyData?.logoUrl ? (
                <img 
                  src={companyData.logoUrl} 
                  alt="Logo du label" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 text-sm text-center">Image du label<br/>(à venir)</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
          disabled={isLoading || isPdfGenerating}
          className="bg-white hover:bg-[#27017F] hover:text-white border-[#35DA56] text-[#27017F]"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger mes données
        </Button>
      </div>

      <div ref={chartsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card">
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

        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card">
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

        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card">
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

        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card">
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

        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[600px] md:col-span-2 chart-card">
          <SustainabilityRadarChart 
            title="Analyse comparative des critères de durabilité" 
            data={radarData} 
            myScoreColor="#0EA5E9" 
            maxScoreColor="#35DA56" 
          />
        </Card>
      </div>
    </div>
  );
};
