
import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "contribution_associative",
    title: "1 - Contribution associative",
    description: "Soutien à des projets associatifs ou pro bono.",
    options: [
      { value: "A", label: "Soutien non financier à des associations." },
      { value: "B", label: "Engagement salarié sur temps de travail pour des ONG." },
      { value: "C", label: "Contribution financière à des initiatives sociales." },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "politique_achats_responsables",
    title: "2 - Politique d'achats responsables",
    description: "Sélection de fournisseurs éthiques et écoresponsables.",
    options: [
      { value: "A", label: "Mobilier/équipements de seconde main et faible impact." },
      { value: "B", label: "Fournisseurs certifiés éthiques/écoresponsables." },
      { value: "C", label: "Politique RSE alignée sur normes AFNOR/ISO 26000." },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "numerique_responsable",
    title: "3 - Numérique responsable",
    description: "Réduction de l'empreinte sociale et environnementale du numérique.",
    options: [
      { value: "A", label: "Communication dématérialisée responsable." },
      { value: "B", label: "Achats d'équipements reconditionnés/écologiques." },
      { value: "C", label: "Démarche active de sobriété numérique." },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "communication",
    title: "4 - Communication",
    description: "Messages et supports adressés aux consommateurs.",
    options: [
      { value: "A", label: "Mise en avant des actions écologiques." },
      { value: "B", label: "Supports de communication responsables (PLV, goodies)." },
      { value: "C", label: "Encouragement de comportements responsables via la communication." },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "relations_fournisseurs_prestataires",
    title: "5 - Relations fournisseurs et prestataires",
    description: "Collaboration équilibrée et durable avec les partenaires.",
    options: [
      { value: "A", label: "Choix de fournisseurs à impact local positif." },
      { value: "B", label: "Accompagnement des fournisseurs vers une démarche durable." },
      { value: "C", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  },
  {
    id: "impact_social",
    title: "6 - Prise en compte de l'impact social",
    description: "Effets de l'activité sur la société et les parties prenantes.",
    options: [
      { value: "A", label: "Analyse de la chaîne de valeur et sensibilisation des équipes." },
      { value: "B", label: "Investissement dans des projets à impact social." },
      { value: "C", label: "Statut ESS ou entreprise à mission." },
      { value: "D", label: "Ce critère ne s'applique pas à mon entreprise" }
    ]
  }
];
