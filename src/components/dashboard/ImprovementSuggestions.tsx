
import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCompanyData } from "@/hooks/useCompanyData";

// Define the improvement axes and their importance order
const improvementAxes = [
  {
    criteria: "Diversité",
    axis: "En termes de gouvernance, la promotion de la diversité est désormais un must-have pour les startups. Il est important de faire que chacun se sente le bienvenu et ayant sa place dans le monde du travail quelque soit son sexe, son origine ou encore son âge. Lors de vos recrutements, sur vos annonces, n'hésitez pas à le mettre en avant.",
    order: 1
  },
  {
    criteria: "Égalité",
    axis: "",
    order: 2
  },
  {
    criteria: "Handicap",
    axis: "Oeuvrer en faveur de l'inclusion des personnes en situation de handicap est un point à ne pas ignorer. Le handicap n'empêche pas le talent ! Si vous n'embauchez pas tout de suite, vous pouvez choisir de faire appel à des prestataires qui favorisent l'emploi des personnes handicapées, des entreprises adaptées ou des ESAT. Voire, le devenir vous-même.",
    order: 3
  },
  {
    criteria: "Santé des salariés/bien-être au travail",
    axis: "Il s'agit de l'un des critères les plus importants pour une gouvernance juste et inclusive. Il est indispensable pour une startup de mettre en œuvre un maximum d'actions en ce sens. Respect du temps de travail, communications limitées aux heures de bureau, matériel et ergonomie des bureaux. Il est de votre responsabilité de veiller à l'équilibre vie professionnelle et vie personnelle des collaborateurs de l'entreprise.",
    order: 4
  },
  {
    criteria: "Parentalité",
    axis: "",
    order: 5
  },
  {
    criteria: "Formation",
    axis: "Assurer l'employabilité des collaborateurs est un critère important pour une gouvernance juste et inclusive. Cela permet également de maintenir et assurer le meilleur niveau de compétence possible et donc une performance optimale. Motivation et productivité sont encouragées par des formations régulières tant sur les soft que les hard skills.",
    order: 6
  },
  {
    criteria: "Politique RSE",
    axis: "Développer une politique RSE est la preuve d'un véritable engagement de l'entreprise. C'est rechercher des solutions et mettre en place des actions en faveur d'une culture et d'un impact positif. Double avantage : une garantie pour les collaborateurs et futures recrues une entreprise alignée à leurs valeurs ; la possibilité de devenir un exemple à suivre pour son secteur.",
    order: 7
  },
  {
    criteria: "Privacy/Data",
    axis: "Les logiques de respect de la vie privée et des données personnelles sont très importantes. La CNIL veille et le RGPD est devenu la norme pour toutes les structures peu importe leur taille. Il ne faut pas les négliger et s'y conformer au plus tôt dans la vie de l'entreprise. La collecte et le stockage des données sont d'autant plus des sujets important pour les startups de la tech.",
    order: 8
  },
  {
    criteria: "Transports",
    axis: "",
    order: 9
  },
  {
    criteria: "Contribution associative",
    axis: "",
    order: 10
  },
  {
    criteria: "Politique d'achats responsables",
    axis: "On peut faire le lien ici entre achats responsable et impact social positif, 2 indicateurs sur lesquels la marge de progression est importante. Privilégier le sourcing auprès de fournisseurs engagés participe à développer une chaîne de valeur positive et à rayonner dans votre écosystème. Être prescripteur compte.",
    order: 11
  }
];

// Filter out criteria without improvement axes
const validImprovementAxes = improvementAxes.filter(item => item.axis !== "");

export const ImprovementSuggestions = () => {
  const { companyData, isLoading } = useCompanyData();

  const topImprovementSuggestions = useMemo(() => {
    if (!companyData?.criteriaScores || isLoading) return [];

    // Create an array of criteria with their scores
    const criteriaWithScores = Object.entries(companyData.criteriaScores)
      .map(([criteria, score]) => ({ criteria, score }))
      // Filter only criteria that have improvement axes
      .filter(item => validImprovementAxes.some(axis => axis.criteria === item.criteria));

    // Sort by score (ascending) to get the lowest scores first
    const sortedCriteria = criteriaWithScores.sort((a, b) => a.score - b.score);

    // Get the two most important improvement areas based on:
    // 1. Lowest scores
    // 2. If tied, prefer the one with higher importance (lower order number)
    const topTwoCriteria = sortedCriteria.slice(0, Math.min(4, sortedCriteria.length))
      .sort((a, b) => {
        // If scores are significantly different, sort by score
        if (Math.abs(a.score - b.score) > 0.5) return a.score - b.score;
        
        // If scores are close, sort by importance order
        const orderA = validImprovementAxes.find(axis => axis.criteria === a.criteria)?.order || 999;
        const orderB = validImprovementAxes.find(axis => axis.criteria === b.criteria)?.order || 999;
        return orderA - orderB;
      })
      .slice(0, 2);

    // Map to full improvement axis objects
    return topTwoCriteria.map(item => {
      const axisInfo = validImprovementAxes.find(axis => axis.criteria === item.criteria);
      return {
        criteria: item.criteria,
        score: item.score,
        axis: axisInfo?.axis || "",
        order: axisInfo?.order || 999
      };
    });
  }, [companyData, isLoading]);

  if (isLoading) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Pistes d'amélioration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i} className="h-64 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Chargement...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-100 animate-pulse rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (topImprovementSuggestions.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Pistes d'amélioration</h2>
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-gray-600">Aucune piste d'amélioration n'a pu être identifiée. Veuillez consulter votre rapport complet pour plus de détails.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Pistes d'amélioration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topImprovementSuggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/90 backdrop-blur-sm"
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <span className="h-6 w-6 bg-[#35DA56] text-white rounded-full flex items-center justify-center text-sm mr-2">
                  {index + 1}
                </span>
                {suggestion.criteria}
                <span className="ml-auto text-sm bg-red-50 text-red-700 px-2 py-1 rounded-full">
                  Score: {suggestion.score}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{suggestion.axis}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
