
import { Card } from "@/components/ui/card";
import { SustainabilityRadarChart, RadarDataPoint } from "@/components/ui/charts/RadarChart";

export const RadarChartCard = () => {
  const radarData: RadarDataPoint[] = [
    { subject: 'Diversité', myScore: 3, maxScore: 5 },
    { subject: 'Égalité', myScore: 3, maxScore: 5 },
    { subject: 'Handicap', myScore: 4, maxScore: 6 },
    { subject: 'Santé des salariés/bien-être au travail', myScore: 4, maxScore: 6 },
    { subject: 'Parentalité', myScore: 2, maxScore: 4 },
    { subject: 'Formation', myScore: 4, maxScore: 6 },
    { subject: 'Politique RSE', myScore: 4, maxScore: 6 },
    { subject: 'Privacy/Data', myScore: 2, maxScore: 4 },
    { subject: 'Transports', myScore: 2, maxScore: 4 },
    { subject: 'Contribution associative', myScore: 4, maxScore: 6 },
    { subject: 'Politique d\'achats responsables', myScore: 4, maxScore: 6 },
    { subject: 'Numérique responsable', myScore: 4, maxScore: 6 },
    { subject: 'Communication', myScore: 3, maxScore: 5 },
    { subject: 'Relation fournisseurs et prestataires', myScore: 4, maxScore: 6 },
    { subject: 'Prise en compte de l\'impact social', myScore: 4, maxScore: 6 },
    { subject: 'Production : énergie & matériaux utilisés', myScore: 4, maxScore: 6 },
    { subject: 'Recyclage & gestion des déchets', myScore: 3, maxScore: 5 },
    { subject: 'Éco-conception', myScore: 5, maxScore: 7 },
    { subject: 'Évaluation permanente', myScore: 4, maxScore: 6 },
    { subject: 'Maîtrise et optimisation de la consommation de ressources énergétiques', myScore: 1, maxScore: 2 },
    { subject: 'Plan de contrôle / limite des émissions carbones', myScore: 4, maxScore: 6 },
    { subject: 'Gestion participative & économie circulaire', myScore: 3, maxScore: 5 }
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
