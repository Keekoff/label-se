
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
    </div>
  );
};
