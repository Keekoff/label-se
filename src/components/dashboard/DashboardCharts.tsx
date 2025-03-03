
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TieredBarChart } from "@/components/ui/chart";
import { CertificationBox } from "./CertificationBox";

interface DashboardChartsProps {
  companyName: string;
}

export const DashboardCharts = ({ companyName }: DashboardChartsProps) => {
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
                axisName=""
                value={[46, 63, 81, 70]}
                valueLabel={["Echelon 1", "Echelon 2", "Echelon 3", "Résultats"]}
                categories={[]}
                yAxisAnnotations={[
                  {
                    y: 33,
                    text: ''
                  },
                  {
                    y: 66,
                    text: ''
                  },
                ]}
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
                axisName=""
                value={[56, 73, 91, 85]}
                valueLabel={["Echelon 1", "Echelon 2", "Echelon 3", "Résultats"]}
                categories={[]}
                yAxisAnnotations={[
                  {
                    y: 33,
                    text: ''
                  },
                  {
                    y: 66,
                    text: ''
                  },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
