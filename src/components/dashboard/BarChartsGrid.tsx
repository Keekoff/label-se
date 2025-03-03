
import { Card } from "@/components/ui/card";
import { TieredBarChart } from "@/components/ui/charts/TieredBarChart";
import { CompanyData } from "@/hooks/useCompanyData";
import { useEchelonData } from "@/hooks/useEchelonData";

interface BarChartsGridProps {
  companyData: CompanyData | null;
}

export const BarChartsGrid = ({ companyData }: BarChartsGridProps) => {
  const { echelonData, isLoading: isEchelonDataLoading } = useEchelonData();

  const getGovernanceChartData = () => {
    const governanceAverage = echelonData?.governanceAverage || 0;
    console.log('Valeur moyenne de gouvernance à afficher:', governanceAverage);
    
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.governanceScore ? Math.round(companyData.governanceScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: governanceAverage
      }
    ];
  };

  const getEnvironmentalChartData = () => {
    const environmentalAverage = echelonData?.environmentalAverage || 0;
    console.log('Valeur moyenne environnementale à afficher:', environmentalAverage);
    
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.environmentalScore ? Math.round(companyData.environmentalScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: environmentalAverage
      }
    ];
  };

  const getSocialImpactChartData = () => {
    // Utiliser le nouveau champ developpementImpactSocialPositifPercentage s'il existe
    const socialImpactValue = companyData?.developpementImpactSocialPositifPercentage !== undefined
      ? Math.round(companyData.developpementImpactSocialPositifPercentage)
      : companyData?.socialImpactScore 
        ? (companyData.socialImpactScore > 1 ? Math.round(companyData.socialImpactScore) : Math.round(companyData.socialImpactScore * 100))
        : 0;
      
    const socialImpactAverage = echelonData?.socialImpactAverage || 0;
    console.log("Social Impact Value for chart:", socialImpactValue);
    console.log("Social Impact Average for chart:", socialImpactAverage);
    
    return [
      { 
        name: 'Vos résultats', 
        value: socialImpactValue
      },
      { 
        name: 'Moyenne globale', 
        value: socialImpactAverage
      }
    ];
  };

  const getAverageChartData = () => {
    const totalAverage = echelonData?.totalAverage || 0;
    console.log('Valeur moyenne totale à afficher:', totalAverage);
    
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.averageScore ? Math.round(companyData.averageScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: totalAverage
      }
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};
