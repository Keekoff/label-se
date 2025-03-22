
import { Question } from "../types";

export const socialImpactQuestion: Question = {
  id: "socialImpact",
  title: "6 - Prise en compte de l'impact social",
  description: "Effets de l'activité sur la société et les parties prenantes.",
  options: [
    { 
      value: "A", 
      label: "L'entreprise a analysé sa chaîne de valeur et sensibilise ses collaborateurs à la notion d'impact social à tous les niveaux de la chaîne",
      justificatifs: [
        "Information et communication en interne et en externe sur le sujet",
        "Audit des prestataires et fournisseurs"
      ]
    },
    { 
      value: "B", 
      label: "L'entreprise investit et/ou met à disposition des ressources pour développer des projets/produits pour le bien commun. Elle déploie des actions de prévention ou un investissement social qui permet d'éviter une dépense de réparation ou de compensation",
      justificatifs: [
        "Benchmark incluant la dimension durable et responsable",
        "Descriptions des projets, initiatives, actions...."
      ]
    },
    { 
      value: "C", 
      label: "L'entreprise a le statut d'ESS, d'entreprise à mission, de collectif ou tout autre statut attestant de son engagement et de son impact sociétal",
      justificatifs: [
        "Statut d'ESS de l'entreprise ou déclaration du caractère d'entreprise à mission",
        "Code éthique",
        "Charte sociale",
        "Affichage dans les locaux",
        "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)",
        "Règlement intérieur",
        "Présence sur le site web",
        "Messages diffusés à l'externe (réseaux sociaux, vidéo, articles de blog, tribunes, communiqués de toutes sortes...)"
      ]
    },
    { 
      value: "D", 
      label: "Ce critère ne s'applique pas à mon entreprise",
      justificatifs: ["N/A"]
    }
  ]
};
