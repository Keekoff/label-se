
import { Card } from "@/components/ui/card";
import { TieredBarChart } from "@/components/ui/charts/TieredBarChart";
import { CompanyData } from "@/hooks/useCompanyData";
import { useEchelonData } from "@/hooks/useEchelonData";

interface BarChartsGridProps {
  companyData: CompanyData | null;
}

export const BarChartsGrid = ({ companyData }: BarChartsGridProps) => {
  const { echelonData, isLoading: isEchelonDataLoading } = useEchelonData();

  // Données par défaut pour les utilisateurs non premium
  const defaultData = [
    { name: 'Vos résultats', value: 0 },
    { name: 'Moyenne globale', value: 65 }
  ];

  // Trouver les données d'échelon par défaut (utilise le premier élément si disponible)
  const getDefaultEchelonValues = () => {
    if (!echelonData || !Array.isArray(echelonData) || echelonData.length === 0) {
      return { governanceAverage: 0, socialImpactAverage: 0, environmentalAverage: 0, totalAverage: 0 };
    }
    return echelonData[0];
  };

  const getGovernanceChartData = () => {
    if (!companyData) return defaultData;
    
    const defaultEchelon = getDefaultEchelonValues();
    const governanceAverage = defaultEchelon.governanceAverage || 0;
    console.log('Valeur moyenne de gouvernance à afficher:', governanceAverage);
    return [{
      name: 'Vos résultats',
      value: companyData?.governanceScore ? Math.round(companyData.governanceScore * 100) : 0
    }, {
      name: 'Moyenne globale',
      value: governanceAverage
    }];
  };
  
  const getEnvironmentalChartData = () => {
    if (!companyData) return defaultData;
    
    const defaultEchelon = getDefaultEchelonValues();
    const environmentalAverage = defaultEchelon.environmentalAverage || 0;
    console.log('Valeur moyenne environnementale à afficher:', environmentalAverage);
    return [{
      name: 'Vos résultats',
      value: companyData?.environmentalScore ? Math.round(companyData.environmentalScore * 100) : 0
    }, {
      name: 'Moyenne globale',
      value: environmentalAverage
    }];
  };
  
  const getSocialImpactChartData = () => {
    if (!companyData) return defaultData;
    
    const socialImpactValue = companyData?.developpementImpactSocialPositifPercentage !== undefined 
      ? Math.round(companyData.developpementImpactSocialPositifPercentage * 100) 
      : companyData?.socialImpactScore 
        ? Math.round(companyData.socialImpactScore * 100) 
        : 0;
        
    const defaultEchelon = getDefaultEchelonValues();
    const socialImpactAverage = defaultEchelon.socialImpactAverage || 0;
    console.log("Social Impact Value for chart:", socialImpactValue);
    console.log("Social Impact Average for chart:", socialImpactAverage);
    return [{
      name: 'Vos résultats',
      value: socialImpactValue
    }, {
      name: 'Moyenne globale',
      value: socialImpactAverage
    }];
  };
  
  const getAverageChartData = () => {
    if (!companyData) return defaultData;
    
    const defaultEchelon = getDefaultEchelonValues();
    const totalAverage = defaultEchelon.totalAverage || 0;
    console.log('Valeur moyenne totale à afficher:', totalAverage);
    return [{
      name: 'Vos résultats',
      value: companyData?.averageScore ? Math.round(companyData.averageScore * 100) : 0
    }, {
      name: 'Moyenne globale',
      value: totalAverage
    }];
  };

  // Récupérer les valeurs des tiers depuis echelonData ou utiliser des valeurs par défaut
  const getAverageTierValues = () => {
    if (!echelonData || !Array.isArray(echelonData) || echelonData.length === 0) {
      return {
        tier1: 95,
        tier2: 75, 
        tier3: 55
      };
    }

    // Si nous avons les données mais que l'entreprise n'a pas d'échelon spécifié
    if (!companyData?.echelonTexte) {
      // Par défaut, on prend le premier élément disponible
      const firstEchelon = echelonData[0];
      return {
        tier1: firstEchelon?.tier1Total || 95,
        tier2: firstEchelon?.tier2Total || 75,
        tier3: firstEchelon?.tier3Total || 55
      };
    }

    // Récupérer l'échelon de l'entreprise
    let echelonValue = Array.isArray(companyData.echelonTexte) 
      ? companyData.echelonTexte[0] 
      : companyData.echelonTexte;

    console.log('Recherche des valeurs de tiers pour échelon:', echelonValue);
    console.log('Données d\'échelon disponibles:', echelonData);

    // Trouver l'entrée d'échelon correspondante
    const matchingEchelon = echelonData.find(item => item.echelon === echelonValue);
    
    if (matchingEchelon) {
      console.log('Échelon correspondant trouvé:', matchingEchelon);
      return {
        tier1: matchingEchelon.tier1Total || 95,
        tier2: matchingEchelon.tier2Total || 75,
        tier3: matchingEchelon.tier3Total || 55
      };
    } else {
      console.log('Aucun échelon correspondant trouvé, utilisation des valeurs par défaut');
      return {
        tier1: 95,
        tier2: 75,
        tier3: 55
      };
    }
  };

  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card bg-white">
        <TieredBarChart title="Gouvernance juste et inclusive" data={getGovernanceChartData()} tiers={{
        tier1: 33,
        tier2: 54,
        tier3: 87
      }} barColor="#8985FF" tierLabels={{
        tier1: "Échelon 1",
        tier2: "Échelon 2",
        tier3: "Échelon 3"
      }} />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card bg-white">
        <TieredBarChart title="Développement d'impact social positif" data={getSocialImpactChartData()} tiers={{
        tier1: 29,
        tier2: 57,
        tier3: 80
      }} barColor="#8985FF" tierLabels={{
        tier1: "Échelon 1",
        tier2: "Échelon 2",
        tier3: "Échelon 3"
      }} />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card bg-white">
        <TieredBarChart title="Maitrise d'impact environnemental et développement durable" data={getEnvironmentalChartData()} tiers={{
        tier1: 41,
        tier2: 59,
        tier3: 81
      }} barColor="#8985FF" tierLabels={{
        tier1: "Échelon 1",
        tier2: "Échelon 2",
        tier3: "Échelon 3"
      }} />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px] chart-card bg-white">
        <TieredBarChart title="Moyenne des labellisés" data={getAverageChartData()} tiers={getAverageTierValues()} barColor="#35DA56" tierLabels={{
        tier1: "Échelon 1",
        tier2: "Échelon 2",
        tier3: "Échelon 3"
      }} />
      </Card>
    </div>;
};
