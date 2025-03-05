
import { Card } from "@/components/ui/card";
import { SustainabilityRadarChart, RadarDataPoint } from "@/components/ui/charts/RadarChart";

export const RadarChartCard = () => {
  const radarData: RadarDataPoint[] = [
    { subject: 'Diversité', myScore: 5, maxScore: 10 },
    { subject: 'Égalité', myScore: 5, maxScore: 10 },
    { subject: 'Handicap', myScore: 6, maxScore: 10 },
    { subject: 'Santé des salariés', myScore: 6, maxScore: 10 },
    { subject: 'Parentalité', myScore: 4, maxScore: 10 },
    { subject: 'Formation', myScore: 6, maxScore: 10 },
    { subject: 'Politique RSE', myScore: 6, maxScore: 10 },
    { subject: 'Privacy/Data', myScore: 4, maxScore: 10 },
    { subject: 'Transports', myScore: 4, maxScore: 10 },
    { subject: 'Contribution associative', myScore: 6, maxScore: 10 },
    { subject: 'Achats responsables', myScore: 6, maxScore: 10 },
    { subject: 'Numérique responsable', myScore: 6, maxScore: 10 },
    { subject: 'Communication', myScore: 5, maxScore: 10 },
    { subject: 'Relation fournisseurs', myScore: 6, maxScore: 10 },
    { subject: 'Impact social', myScore: 6, maxScore: 10 },
    { subject: 'Production', myScore: 6, maxScore: 10 },
    { subject: 'Recyclage', myScore: 5, maxScore: 10 },
    { subject: 'Éco-conception', myScore: 7, maxScore: 10 },
    { subject: 'Évaluation permanente', myScore: 6, maxScore: 10 },
    { subject: 'Ressources énergétiques', myScore: 2, maxScore: 10 },
    { subject: 'Émissions carbone', myScore: 6, maxScore: 10 },
    { subject: 'Économie circulaire', myScore: 5, maxScore: 10 }
  ];

  return (
    <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[600px] md:col-span-2 chart-card bg-slate-50">
      <SustainabilityRadarChart 
        title="Analyse comparative des critères de durabilité" 
        data={radarData} 
        myScoreColor="#35DA56" 
        maxScoreColor="#27017F" 
      />
    </Card>
  );
};
