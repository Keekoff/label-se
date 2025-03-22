
import { Question } from "../types";

export const responsiblePurchasingQuestion: Question = {
  id: "responsiblePurchasing",
  title: "2 - Politique d'achats responsables",
  description: "Sélection de fournisseurs éthiques et écoresponsables.",
  options: [
    { 
      value: "A", 
      label: "L'entreprise favorise le mobilier et les équipements informatiques de seconde-main, privilégie les ampoules à faible consommation et à longue durée et les piles rechargeables plutôt que les piles jetables",
      justificatifs: [
        "Lettre d'engagement",
        "Preuves d'achat des équipements responsables",
        "Contrats fournisseurs"
      ]
    },
    { 
      value: "B", 
      label: "L'entreprise privilégie les fournisseurs qui s'inscrivent dans une démarche éco-responsable et inclusive (ESAT) et/ou ayant une bonne performance RSE. Elle privilégie des produits faits de matières recyclées et recyclables",
      justificatifs: [
        "Identification du/des fournisseurs",
        "Identification d'un processus de sourcing produits/matières premières responsables"
      ]
    },
    { 
      value: "C", 
      label: "L'entreprise a déployé une politique RSE et diffuse les normes d'achats responsables décrétées par l'AFNOR sous le n°NFX 50-135, déclinaison de la norme ISO 26000 auprès des collaborateurs",
      justificatifs: [
        "Identification du responsable RSE",
        "Présence du sujet et des actions RSE dans la feuille de route de l'année passée et à venir"
      ]
    },
    { 
      value: "D", 
      label: "Ce critère ne s'applique pas à mon entreprise",
      justificatifs: ["N/A"]
    }
  ]
};
