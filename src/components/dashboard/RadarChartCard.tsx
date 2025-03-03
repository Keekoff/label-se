import { Card } from "@/components/ui/card";
import { SustainabilityRadarChart, RadarDataPoint } from "@/components/ui/charts/RadarChart";
export const RadarChartCard = () => {
  const radarData: RadarDataPoint[] = [{
    subject: 'Diversité',
    myScore: 65,
    maxScore: 90
  }, {
    subject: 'Égalité',
    myScore: 75,
    maxScore: 95
  }, {
    subject: 'Handicap',
    myScore: 60,
    maxScore: 85
  }, {
    subject: 'Santé des salariés',
    myScore: 70,
    maxScore: 90
  }, {
    subject: 'Parentalité',
    myScore: 80,
    maxScore: 95
  }, {
    subject: 'Formation',
    myScore: 65,
    maxScore: 90
  }, {
    subject: 'Politique RSE',
    myScore: 75,
    maxScore: 100
  }, {
    subject: 'Privacy/Data',
    myScore: 70,
    maxScore: 90
  }, {
    subject: 'Transports',
    myScore: 55,
    maxScore: 80
  }, {
    subject: 'Contribution associative',
    myScore: 60,
    maxScore: 85
  }, {
    subject: 'Achats responsables',
    myScore: 65,
    maxScore: 90
  }, {
    subject: 'Numérique responsable',
    myScore: 70,
    maxScore: 95
  }, {
    subject: 'Communication',
    myScore: 75,
    maxScore: 90
  }, {
    subject: 'Relation fournisseurs',
    myScore: 60,
    maxScore: 85
  }, {
    subject: 'Impact social',
    myScore: 70,
    maxScore: 95
  }, {
    subject: 'Production',
    myScore: 65,
    maxScore: 90
  }, {
    subject: 'Recyclage',
    myScore: 60,
    maxScore: 85
  }, {
    subject: 'Éco-conception',
    myScore: 70,
    maxScore: 95
  }, {
    subject: 'Évaluation permanente',
    myScore: 75,
    maxScore: 90
  }, {
    subject: 'Ressources énergétiques',
    myScore: 65,
    maxScore: 90
  }, {
    subject: 'Émissions carbone',
    myScore: 60,
    maxScore: 85
  }, {
    subject: 'Économie circulaire',
    myScore: 70,
    maxScore: 95
  }];
  return <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[600px] md:col-span-2 chart-card bg-slate-50">
      <SustainabilityRadarChart title="Analyse comparative des critères de durabilité" data={radarData} myScoreColor="#0EA5E9" maxScoreColor="#35DA56" />
    </Card>;
};