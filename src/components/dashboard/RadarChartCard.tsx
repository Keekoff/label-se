
import { Card } from "@/components/ui/card";
import { SustainabilityRadarChart, RadarDataPoint } from "@/components/ui/charts/RadarChart";
import { useCompanyData } from "@/hooks/useCompanyData";

export const RadarChartCard = () => {
  const {
    companyData,
    isLoading
  } = useCompanyData();

  // Définition des valeurs maximales pour chaque critère
  const maxScores = [{
    subject: 'Diversité',
    maxScore: 5
  }, {
    subject: 'Égalité',
    maxScore: 5
  }, {
    subject: 'Handicap',
    maxScore: 6
  }, {
    subject: 'Santé des salariés/bien-être au travail',
    maxScore: 6
  }, {
    subject: 'Parentalité',
    maxScore: 4
  }, {
    subject: 'Formation',
    maxScore: 6
  }, {
    subject: 'Politique RSE',
    maxScore: 6
  }, {
    subject: 'Privacy/Data',
    maxScore: 4
  }, {
    subject: 'Transports',
    maxScore: 4
  }, {
    subject: 'Contribution associative',
    maxScore: 6
  }, {
    subject: 'Politique d\'achats responsables',
    maxScore: 6
  }, {
    subject: 'Numérique responsable',
    maxScore: 6
  }, {
    subject: 'Communication',
    maxScore: 5
  }, {
    subject: 'Relation fournisseurs et prestataires',
    maxScore: 6
  }, {
    subject: 'Prise en compte de l\'impact social',
    maxScore: 6
  }, {
    subject: 'Production : énergie & matériaux utilisés',
    maxScore: 6
  }, {
    subject: 'Recyclage & gestion des déchets',
    maxScore: 5
  }, {
    subject: 'Éco-conception',
    maxScore: 7
  }, {
    subject: 'Évaluation permanente',
    maxScore: 6
  }, {
    subject: 'Maîtrise et optimisation de la consommation de ressources énergétiques',
    maxScore: 2
  }, {
    subject: 'Plan de contrôle / limite des émissions carbones',
    maxScore: 6
  }, {
    subject: 'Gestion participative & économie circulaire',
    maxScore: 5
  }];

  // Construction des données du radar en combinant les scores maximum et les scores de l'entreprise
  const radarData: RadarDataPoint[] = maxScores.map(({
    subject,
    maxScore
  }) => {
    // Récupération du score de l'entreprise pour ce critère, ou valeur par défaut
    const myScore = companyData?.criteriaScores?.[subject] || 0;
    return {
      subject,
      myScore,
      maxScore
    };
  });
  
  if (isLoading) {
    return <Card className="p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[600px] md:col-span-2 chart-card bg-slate-50/90 backdrop-blur-sm">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </Card>;
  }
  
  return <Card className="p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[600px] md:col-span-2 chart-card backdrop-blur-sm bg-white">
      <SustainabilityRadarChart title="Analyse comparative des critères de durabilité" data={radarData} myScoreColor="#35DA56" maxScoreColor="#27017F" />
    </Card>;
};
