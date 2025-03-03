
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
    return [
      { 
        name: 'Vos résultats', 
        value: companyData?.governanceScore ? Math.round(companyData.governanceScore * 100) : 0 
      },
      { 
        name: 'Moyenne globale', 
        value: echelonData?.governanceAverage || 65 
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
        value: echelonData?.environmentalAverage || 65 
      }
    ];
  };

  const getSocialImpactChartData = () => {
    // Loguer la valeur brute du score d'impact social
    console.log("Social Impact Score:", companyData?.socialImpactScore);
    
    // Si socialImpactScore est déjà un pourcentage (ex: 66 et non 0.66)
    // on l'utilise directement, sinon on le convertit de décimal à pourcentage
    const socialImpactValue = companyData?.socialImpactScore 
      ? (companyData.socialImpactScore > 1 ? Math.round(companyData.socialImpactScore) : Math.round(companyData.socialImpactScore * 100))
      : 0;
      
    console.log("Social Impact Value for chart:", socialImpactValue);
    
    return [
      { 
        name: 'Vos résultats', 
        value: socialImpactValue
      },
      { 
        name: 'Moyenne globale', 
        value: echelonData?.socialImpactAverage || 65 
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
        value: echelonData?.totalAverage || 65 
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
