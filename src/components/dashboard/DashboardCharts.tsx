
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TieredBarChart } from "@/components/ui/chart";
import { CertificationBox } from "./CertificationBox";

interface DashboardChartsProps {
  companyName: string;
}

export const DashboardCharts = ({ companyName }: DashboardChartsProps) => {
  // Transform the data for the first chart
  const gouvernanceData = [
    { name: "Echelon 1", value: 46 },
    { name: "Echelon 2", value: 63 },
    { name: "Echelon 3", value: 81 },
    { name: "Résultats", value: 70 },
  ];

  // Transform the data for the second chart
  const impactData = [
    { name: "Echelon 1", value: 56 },
    { name: "Echelon 2", value: 73 },
    { name: "Echelon 3", value: 91 },
    { name: "Résultats", value: 85 },
  ];

  // Define tier references for both charts
  const tierLevels = {
    tier1: 33,
    tier2: 66,
    tier3: 90
  };

  // Custom tier labels
  const tierLabels = {
    tier1: "Niveau 1",
    tier2: "Niveau 2",
    tier3: "Niveau 3"
  };

  return (
    <div className="space-y-6">
      {companyName && <CertificationBox companyName={companyName} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Gouvernance juste et inclusive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <TieredBarChart
                data={gouvernanceData}
                tiers={tierLevels}
                title=""
                barColor="#35DA56"
                tierLabels={tierLabels}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Développement d'impact social positif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <TieredBarChart
                data={impactData}
                tiers={tierLevels}
                title=""
                barColor="#27017F"
                tierLabels={tierLabels}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
