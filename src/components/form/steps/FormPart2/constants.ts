
export const QUESTIONS = [
  {
    id: "responsiblePurchasing",
    title: "Politique d'achats responsables",
    description: "Comment l'entreprise intègre-t-elle des critères éthiques, sociaux et environnementaux dans ses achats ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise prend en compte des critères sociaux et environnementaux dans le choix de certains fournisseurs",
        justificatifs: [
          "Liste des critères pris en compte",
          "Exemples de fournisseurs sélectionnés sur ces critères"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a déployé une politique RSE et diffuse les normes d'achats responsables décrétées par l'AFNOR sous le n°NFX 50-135, déclinaison de la norme ISO 26000 auprès des collaborateurs",
        justificatifs: [
          "Document présentant la politique d'achats responsables",
          "Charte fournisseurs"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a intégré des critères RSE dans tous ses appels d'offres et évalue régulièrement ses fournisseurs sur ces critères",
        justificatifs: [
          "Exemples d'appels d'offres incluant des critères RSE",
          "Méthodologie d'évaluation des fournisseurs"
        ]
      }
    ]
  },
  {
    id: "socialImpact",
    title: "Prise en compte de l'impact social",
    description: "Comment l'entreprise contribue-t-elle positivement à la société ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise soutient ponctuellement des causes sociales ou environnementales (dons, mécénat, bénévolat)",
        justificatifs: [
          "Liste des actions de soutien",
          "Montant des dons"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise investit et/ou met à disposition des ressources pour développer des projets/produits pour le bien commun. Elle déploie des actions de prévention ou un investissement social qui permet d'éviter une dépense de réparation ou de compensation",
        justificatifs: [
          "Document présentant les projets et investissements",
          "Budget alloué à ces actions"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a intégré l'impact social positif dans son modèle d'affaires et mesure régulièrement sa contribution sociétale",
        justificatifs: [
          "Description du modèle d'affaires à impact",
          "Méthode de mesure de l'impact social"
        ]
      }
    ]
  },
  {
    id: "qualityOfLife",
    title: "Qualité de vie au travail",
    description: "Comment l'entreprise favorise-t-elle le bien-être et l'épanouissement de ses collaborateurs ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise respecte les obligations légales en matière de conditions de travail et de santé-sécurité",
        justificatifs: [
          "Document unique d'évaluation des risques",
          "Mesures de prévention mises en place"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place des actions spécifiques pour améliorer la qualité de vie au travail (équilibre vie pro/perso, prévention des RPS, aménagement des espaces)",
        justificatifs: [
          "Document présentant les actions mises en place",
          "Résultats d'enquêtes de satisfaction"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a une politique globale de QVT et mesure régulièrement la satisfaction et l'engagement de ses collaborateurs",
        justificatifs: [
          "Politique de QVT",
          "Indicateurs de suivi",
          "Plan d'action suite aux enquêtes"
        ]
      }
    ]
  },
  {
    id: "localDevelopment",
    title: "Développement local et ancrage territorial",
    description: "Comment l'entreprise contribue-t-elle au développement de son territoire d'implantation ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise privilégie, quand c'est possible, les fournisseurs et prestataires locaux",
        justificatifs: [
          "Liste des fournisseurs locaux",
          "Part des achats réalisés localement"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise participe activement à la vie locale (partenariats avec des écoles, associations, collectivités) et crée des emplois sur son territoire",
        justificatifs: [
          "Document présentant les partenariats locaux",
          "Nombre d'emplois créés localement"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a une stratégie d'ancrage territorial et mesure son impact économique local",
        justificatifs: [
          "Stratégie d'ancrage territorial",
          "Étude d'impact économique local"
        ]
      }
    ]
  },
  {
    id: "ethicalGovernance",
    title: "Gouvernance éthique et transparente",
    description: "Comment l'entreprise assure-t-elle une gouvernance éthique et transparente ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise respecte les lois et réglementations en vigueur et communique clairement sur ses activités",
        justificatifs: [
          "Documents légaux (statuts, K-bis, etc.)",
          "Communication institutionnelle"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place un code éthique et des procédures anti-corruption, et forme ses collaborateurs sur ces sujets",
        justificatifs: [
          "Code éthique ou charte d'entreprise",
          "Procédures anti-corruption",
          "Programme de formation"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise intègre des parties prenantes externes dans sa gouvernance et publie des informations extra-financières",
        justificatifs: [
          "Structure de gouvernance",
          "Rapport RSE ou extra-financier"
        ]
      }
    ]
  }
];
