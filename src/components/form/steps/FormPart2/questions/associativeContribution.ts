
import { Question } from "../types";

export const associativeContributionQuestion: Question = {
  id: "associativeContribution",
  title: "Contribution associative",
  description: "Soutien à des projets associatifs ou pro bono.",
  options: [
    { 
      value: "A", 
      label: "L'entreprise apporte un soutien (non-financier) à un ou plusieurs projets associatifs",
      justificatifs: [
        "Description des projets et preuves des soutiens (mentions par l'association, mentions site web, témoignages collaborateurs...)"
      ]
    },
    { 
      value: "B", 
      label: "L'entreprise prévoit que ses salariés prennent sur le temps de travail pour s'engager auprès d'une ONG ou d'une association",
      justificatifs: [
        "Liste des ONG/associations/événements partenaires",
        "Preuves de l'existence de ces journées par des photos, témoignages collaborateurs, vidéos...",
        "Mention dans les annonces d'emploi",
        "Mention dans les contrats de travail et/ou dans tout autre document transmis par l'entreprise"
      ]
    },
    { 
      value: "C", 
      label: "L'entreprise contribue financièrement à des initiatives, projets, ONG, associations",
      justificatifs: [
        "Liste des ONG/associations/événements partenaires",
        "Preuves administratives des dons"
      ]
    },
    { 
      value: "D", 
      label: "Ce critère ne s'applique pas à mon entreprise",
      justificatifs: ["N/A"]
    }
  ]
};
