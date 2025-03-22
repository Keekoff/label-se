
import { Question } from "../types";

export const communicationQuestion: Question = {
  id: "communication",
  title: "4 - Communication",
  description: "Messages et supports adressés aux consommateurs.",
  options: [
    { 
      value: "A", 
      label: "L'entreprise met en avant ses actions pour réduire son empreinte écologique",
      justificatifs: [
        "Preuves des actions de communication, campagnes, articles, prises de parole...."
      ]
    },
    { 
      value: "B", 
      label: "L'entreprise privilégie des moyens de communication plus responsables : supports, PLV, goodies...",
      justificatifs: [
        "Preuve de l'évaluation de l'impact écologique et social de la production des supports de communication",
        "Choix de consommables pouvant être recyclés",
        "Choix de fournisseurs engagés"
      ]
    },
    { 
      value: "C", 
      label: "L'entreprise encourage les comportements plus responsables auprès de son audience et de ses consommateurs dans sa communication",
      justificatifs: [
        "Partage de bonnes pratiques auprès des collaborateurs et/ou en externe",
        "Publication d'études ou benchmark",
        "Présentation des actions et de leur ROI"
      ]
    },
    { 
      value: "D", 
      label: "Ce critère ne s'applique pas à mon entreprise",
      justificatifs: ["N/A"]
    }
  ]
};
