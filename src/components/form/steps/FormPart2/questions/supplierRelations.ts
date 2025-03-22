
import { Question } from "../types";

export const supplierRelationsQuestion: Question = {
  id: "supplierRelations",
  title: "5 - Relations fournisseurs et prestataires",
  description: "Collaboration équilibrée et durable avec les partenaires.",
  options: [
    { 
      value: "A", 
      label: "L'entreprise apporte un soin particulier au choix de ses fournisseurs et notamment de leur impact. Elle privilégie les entreprises ayant un impact positif sur l'économie locale, limitant les intermédiaires, autant que possible",
      justificatifs: [
        "Benchmark incluant la dimension durable et responsable",
        "Audit des prestataires et fournisseurs",
        "Mise en concurrence d'offres en incluant les paramètres durable et responsable pour privilégier les offres de prestataires engagés"
      ]
    },
    { 
      value: "B", 
      label: "L'entreprise accompagne ses fournisseurs et prestataires dans le développement d'une démarche plus durable et responsable. Elle créé, contribue et/ou participe au développement d'un écosystème et/ou d'une communauté engagés au niveau local",
      justificatifs: [
        "Contribution ou participation à des initiatives durables et responsables locales",
        "Organisations d'événements pour réunir la communauté",
        "Partage de bonnes pratiques auprès des collaborateurs et/ou en externe"
      ]
    },
    { 
      value: "C", 
      label: "Ce critère ne s'applique pas à mon entreprise",
      justificatifs: ["N/A"]
    }
  ]
};
