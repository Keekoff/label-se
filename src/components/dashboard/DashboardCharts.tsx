
import { Card } from "@/components/ui/card";
import { TieredBarChart, SustainabilityRadarChart, RadarDataPoint } from "@/components/ui/chart";

export const DashboardCharts = () => {
  // Données d'exemple - à remplacer par les vraies données plus tard
  const chartData = [
    { name: 'Vos résultats', value: 75 },
    { name: 'Moyenne globale', value: 65 }
  ];

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
        <TieredBarChart 
          title="Gouvernance juste et inclusive" 
          data={chartData}
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
          data={chartData}
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
          data={chartData}
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
          data={chartData}
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
