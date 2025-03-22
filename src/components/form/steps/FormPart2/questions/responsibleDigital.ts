
import { Question } from "../types";

export const responsibleDigitalQuestion: Question = {
  id: "responsibleDigital",
  title: "3 - Numérique responsable",
  description: "Réduction de l'empreinte sociale et environnementale du numérique.",
  options: [
    { 
      value: "A", 
      label: "L'entreprise favorise une communication dématérialisée responsable et encourage l'utilisation de moteurs de recherche engagés",
      justificatifs: [
        "Évite les mails internes au maximum",
        "Limite le stockage des données inutiles",
        "Nettoyage régulier des boites mail",
        "Propose les alternatives telles qu'Ecosia ou Lilo comme moteur de recherche"
      ]
    },
    { 
      value: "B", 
      label: "L'entreprise développe une démarche d'achats éco-responsable pour ses achats d'équipements en favorisant notamment le recours à du matériel reconditionné, la location, le matériel écolabellisé…",
      justificatifs: [
        "Usage modéré de l'impression",
        "Choix de consommables pouvant être recyclés",
        "Choix de fournisseurs engagés",
        "Achats de matériels reconditionnés"
      ]
    },
    { 
      value: "C", 
      label: "L'entreprise est engagée dans une démarche de sobriété numérique, elle s'informe, monitor et contrôle l'impact qu'a ses choix en termes d'outils, de plateformes, d'hébergement",
      justificatifs: [
        "Choix de prestataires et de solutions engagés",
        "Analyse de son impact numérique (scoring, label, outils, audit ....)",
        "Recherche de solutions pour améliorer l'existant (benchmark, solutions proposées en interne ...)"
      ]
    },
    { 
      value: "D", 
      label: "Ce critère ne s'applique pas à mon entreprise",
      justificatifs: ["N/A"]
    }
  ]
};
