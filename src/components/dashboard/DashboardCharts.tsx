
import { Card } from "@/components/ui/card";
import { TieredBarChart } from "@/components/ui/chart";

export const DashboardCharts = () => {
  // Données d'exemple - à remplacer par les vraies données plus tard
  const chartData = [
    { name: 'Vos résultats', value: 75 },
    { name: 'Moyenne globale', value: 65 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <TieredBarChart 
          title="Impact Environnemental" 
          data={chartData}
          tiers={{
            tier1: 80,
            tier2: 60,
            tier3: 40
          }}
        />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <TieredBarChart 
          title="Répartition RSE" 
          data={chartData}
          tiers={{
            tier1: 85,
            tier2: 65,
            tier3: 45
          }}
        />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <TieredBarChart 
          title="Progression Mensuelle" 
          data={chartData}
          tiers={{
            tier1: 90,
            tier2: 70,
            tier3: 50
          }}
        />
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <TieredBarChart 
          title="Objectifs Atteints" 
          data={chartData}
          tiers={{
            tier1: 95,
            tier2: 75,
            tier3: 55
          }}
        />
      </Card>
    </div>
  );
};
