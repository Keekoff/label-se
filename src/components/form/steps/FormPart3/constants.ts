
import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "production",
    title: "1 - Contribution à la production durable",
    description: "Les activités productives qui utilisent les processus et systèmes non polluants, qui préservent l'énergie et les ressources naturelles.",
    options: [
      { value: "A", label: "Avoir conscience de l'impact des activités et faire en sorte de les minimiser" },
      { value: "B", label: "Utiliser exclusivement des ressources renouvelables" },
      { value: "C", label: "Produire de façon à réduire de 50% sa consommation de ressources" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "wasteManagement",
    title: "2 - Recyclage et gestion des déchets",
    description: "Organisation et mise en œuvre des moyens de collecte, tri, transport et traitement des déchets.",
    options: [
      { value: "A", label: "Adopter les pratiques de gestion des déchets, tri, recyclage" },
      { value: "B", label: "Collecter et trier tous les déchets du bureau" },
      { value: "C", label: "Mise en place du zéro déchet (plastique, papier)" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "ecoDesign",
    title: "3 - Éco-conception",
    description: "Intégration systématique des aspects environnementaux dès la conception et le développement de produits.",
    options: [
      { value: "A", label: "Recherche de l'optimisation des ressources utilisées" },
      { value: "B", label: "Choix explicite de solutions avec un moindre impact environnemental" },
      { value: "C", label: "Conception orientée 'impact positif' du début à la fin" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "continuousEvaluation",
    title: "4 - Évaluation permanente",
    description: "Vérification continuelle des résultats, opportunités d'amélioration, et engagement dans une démarche d'amélioration continue.",
    options: [
      { value: "A", label: "Mesure régulière des performances RSE" },
      { value: "B", label: "Utilisation d'outils de mesure d'impact" },
      { value: "C", label: "Obtention d'un label ou certification" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "energyManagement",
    title: "5 - Maîtrise des ressources énergétiques",
    description: "Gestion intelligente de la consommation d'énergie dans toutes les activités.",
    options: [
      { value: "A", label: "Mise en place d'un système d'extinction automatique des équipements" },
      { value: "B", label: "Utilisation exclusive d'énergies renouvelables" },
      { value: "C", label: "Optimisation complète de la consommation d'énergie" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "carbonEmissions",
    title: "6 - Plan de contrôle des émissions carbones",
    description: "Maîtrise et réduction des émissions de gaz à effet de serre liées aux activités.",
    options: [
      { value: "A", label: "Calcul de l'empreinte carbone" },
      { value: "B", label: "Mise en place d'un plan de réduction des émissions" },
      { value: "C", label: "Engagement à diminuer de 50% les gaz à effet de serre" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "circularEconomy",
    title: "7 - Gestion participative & économie circulaire",
    description: "Modèle économique d'échange et de production qui vise à augmenter l'efficacité de l'utilisation des ressources.",
    options: [
      { value: "A", label: "Sensibilisation et implication de toutes les parties prenantes" },
      { value: "B", label: "Partenariats avec acteurs de l'économie circulaire/sociale et solidaire" },
      { value: "C", label: "Offre de produits reconditionnés ou revalorisation de fin de vie" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "responsiblePurchasing",
    title: "8 - Achats responsables",
    description: "Intégration de critères sociaux, sociétaux et environnementaux aux processus d'achat.",
    options: [
      { value: "A", label: "Utilisation de critères sociaux et environnementaux pour les achats" },
      { value: "B", label: "Fournisseurs locaux privilégiés dans la chaîne d'approvisionnement" },
      { value: "C", label: "Politique d'achats responsables formalisée et communiquée" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  }
];
