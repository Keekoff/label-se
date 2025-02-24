
import { Card } from "@/components/ui/card";
import { LineChart, BarChart, PieChart } from "@/components/ui/chart";

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-lg font-semibold mb-4">Impact Environnemental</h3>
        <div className="h-64">
          <LineChart 
            data={[
              { name: 'Jan', value: 400 },
              { name: 'Fév', value: 300 },
              { name: 'Mar', value: 600 },
              { name: 'Avr', value: 500 },
            ]}
          />
        </div>
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-lg font-semibold mb-4">Répartition RSE</h3>
        <div className="h-64">
          <PieChart 
            data={[
              { name: 'Social', value: 35 },
              { name: 'Environnement', value: 40 },
              { name: 'Gouvernance', value: 25 },
            ]}
          />
        </div>
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-lg font-semibold mb-4">Progression Mensuelle</h3>
        <div className="h-64">
          <BarChart 
            data={[
              { name: 'T1', value: 65 },
              { name: 'T2', value: 75 },
              { name: 'T3', value: 85 },
              { name: 'T4', value: 90 },
            ]}
          />
        </div>
      </Card>

      <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <h3 className="text-lg font-semibold mb-4">Objectifs Atteints</h3>
        <div className="h-64">
          <BarChart 
            data={[
              { name: 'Obj 1', value: 90 },
              { name: 'Obj 2', value: 75 },
              { name: 'Obj 3', value: 85 },
              { name: 'Obj 4', value: 95 },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};
