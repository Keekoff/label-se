
import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "production",
    title: "1 - Production : énergie et matériaux utilisés",
    description: "Optimisation des ressources et réduction des polluants.",
    options: [
      { value: "A", label: "Lutte contre le gaspillage des ressources" },
      { value: "B", label: "Utilisation de matériaux recyclés/localisés" },
      { value: "C", label: "Collaboration avec fournisseurs écoresponsables certifiés" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "recyclage_gestion_dechets",
    title: "2 - Recyclage et gestion des déchets",
    description: "Traitement des déchets pour réintégration dans de nouveaux cycles.",
    options: [
      { value: "A", label: "Tri sélectif et sensibilisation au recyclage" },
      { value: "B", label: "Prestataire dédié au tri/recyclage" },
      { value: "C", label: "Politique zéro déchet (limitation des impressions, suppression des monodoses)" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "eco_conception",
    title: "3 - Éco-conception",
    description: "Intégration des impacts environnementaux dans le cycle de vie des produits.",
    options: [
      { value: "A", label: "Pratique de l'éco-design et processus à impact réduit" },
      { value: "B", label: "Développement de produits durables via l'éco-conception" },
      { value: "C", label: "Conformité à la norme ISO 14062 ou directive européenne" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "evaluation_permanente",
    title: "4 - Évaluation permanente",
    description: "Amélioration continue des produits/services.",
    options: [
      { value: "A", label: "Audit annuel des impacts via retours clients" },
      { value: "B", label: "Surcyclage pour une meilleure efficacité énergétique" },
      { value: "C", label: "Production de matériaux réutilisables/recyclables" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "maitrise_ressources_energetiques",
    title: "5 - Maîtrise des ressources énergétiques",
    description: "Réduction de la consommation énergétique.",
    options: [
      { value: "A", label: "Extinction des appareils électriques en fin de journée" },
      { value: "B", label: "Énergies vertes et thermostats numériques" },
      { value: "C", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "plan_controle_emissions_carbones",
    title: "6 - Plan de contrôle des émissions carbones",
    description: "Mesure et réduction de l'empreinte carbone.",
    options: [
      { value: "A", label: "Bilan carbone annuel ou prévu sous 2 ans" },
      { value: "B", label: "Label Bas Carbone ou compensation des émissions" },
      { value: "C", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "gestion_participative_economie_circulaire",
    title: "7 - Gestion participative & économie circulaire",
    description: "Création de cycles de vie positifs pour les produits.",
    options: [
      { value: "A", label: "Implication des collaborateurs dans l'économie circulaire" },
      { value: "B", label: "Partage de bonnes pratiques avec l'écosystème" },
      { value: "C", label: "Développement de produits intégrés à une logique circulaire" },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  }
];
