
export const QUESTIONS = [
  {
    id: "production",
    title: "Systèmes de production durables",
    description: "Comment l'entreprise intègre-t-elle des pratiques durables dans ses processus de production ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise a identifié ses principaux impacts environnementaux et mis en place des actions pour les réduire",
        justificatifs: [
          "Analyse des impacts environnementaux",
          "Plan d'action environnemental"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a optimisé ses processus de production pour réduire sa consommation de ressources et ses émissions",
        justificatifs: [
          "Description des optimisations réalisées",
          "Mesure des réductions obtenues (énergie, eau, déchets, etc.)"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a mis en place un système de management environnemental certifié (ISO 14001, EMAS) et améliore continuellement sa performance environnementale",
        justificatifs: [
          "Certification environnementale",
          "Indicateurs de performance environnementale"
        ]
      }
    ]
  },
  {
    id: "wasteManagement",
    title: "Gestion des déchets",
    description: "Comment l'entreprise gère-t-elle ses déchets ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise trie ses déchets et les recycle quand c'est possible",
        justificatifs: [
          "Preuves de tri et recyclage",
          "Contrats avec des prestataires de collecte et traitement"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place une politique de réduction des déchets à la source et favorise leur valorisation",
        justificatifs: [
          "Politique de gestion des déchets",
          "Mesures mises en place pour réduire les déchets",
          "Taux de valorisation des déchets"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise tend vers le zéro déchet et a mis en place une démarche d'économie circulaire",
        justificatifs: [
          "Stratégie zéro déchet",
          "Exemples de circuits circulaires mis en place",
          "Résultats obtenus"
        ]
      }
    ]
  },
  {
    id: "ecoDesign",
    title: "Éco-conception des produits/services",
    description: "Comment l'entreprise intègre-t-elle des critères environnementaux dans la conception de ses produits/services ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise prend en compte certains critères environnementaux dans la conception de ses produits/services",
        justificatifs: [
          "Liste des critères environnementaux pris en compte",
          "Exemples de produits/services éco-conçus"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place une démarche structurée d'éco-conception pour tous ses produits/services",
        justificatifs: [
          "Méthodologie d'éco-conception",
          "Analyse du cycle de vie des produits/services"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise propose des produits/services innovants à forte valeur environnementale et communique de manière transparente sur leurs impacts",
        justificatifs: [
          "Description des innovations environnementales",
          "Communication sur les impacts environnementaux"
        ]
      }
    ]
  },
  {
    id: "continuousEvaluation",
    title: "Évaluation continue de l'empreinte environnementale",
    description: "Comment l'entreprise évalue-t-elle et réduit-elle son empreinte environnementale globale ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise mesure ses principaux impacts environnementaux (consommation d'énergie, d'eau, émissions de CO2)",
        justificatifs: [
          "Mesures des consommations et émissions",
          "Outils utilisés pour le suivi"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a défini des objectifs de réduction de son empreinte environnementale et suit régulièrement ses progrès",
        justificatifs: [
          "Objectifs environnementaux",
          "Indicateurs de suivi",
          "Résultats obtenus"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise réalise un bilan environnemental complet (incluant le scope 3) et le publie régulièrement",
        justificatifs: [
          "Bilan environnemental",
          "Méthodologie utilisée",
          "Communication des résultats"
        ]
      }
    ]
  },
  {
    id: "energyManagement",
    title: "Maîtrise et optimisation de la consommation de ressources énergétiques",
    description: "Comment l'entreprise optimise-t-elle sa consommation d'énergie ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "Éteindre son ordinateur et son écran à la fin de la journée, et débrancher tous les appareils électriques qui consomment de l'électricité en mode veille",
        justificatifs: [
          "Charte des bonnes pratiques",
          "Mesures de sensibilisation des collaborateurs"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place un plan d'efficacité énergétique et utilise des équipements économes en énergie",
        justificatifs: [
          "Plan d'efficacité énergétique",
          "Liste des équipements économes installés",
          "Mesure des économies réalisées"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise utilise des énergies renouvelables et vise la neutralité carbone pour sa consommation énergétique",
        justificatifs: [
          "Contrats d'approvisionnement en énergie renouvelable",
          "Installations de production d'énergie renouvelable",
          "Stratégie de neutralité carbone"
        ]
      }
    ]
  },
  {
    id: "carbonEmissions",
    title: "Émissions de gaz à effet de serre",
    description: "Comment l'entreprise réduit-elle ses émissions de gaz à effet de serre ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise a identifié ses principales sources d'émissions et mis en place des actions pour les réduire",
        justificatifs: [
          "Inventaire des émissions",
          "Plan d'action pour la réduction"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a fixé des objectifs chiffrés de réduction de ses émissions et les suit régulièrement",
        justificatifs: [
          "Objectifs de réduction",
          "Indicateurs de suivi",
          "Résultats obtenus"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a une stratégie bas-carbone alignée sur l'Accord de Paris et compense ses émissions résiduelles",
        justificatifs: [
          "Stratégie bas-carbone",
          "Alignement avec des standards reconnus (SBTi, etc.)",
          "Projets de compensation"
        ]
      }
    ]
  },
  {
    id: "circularEconomy",
    title: "Économie circulaire",
    description: "Comment l'entreprise intègre-t-elle les principes de l'économie circulaire dans son activité ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise favorise le réemploi, la réparation et le recyclage de ses produits/équipements",
        justificatifs: [
          "Exemples de pratiques de réemploi/réparation/recyclage",
          "Partenariats avec des acteurs du recyclage"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a repensé ses produits/services selon les principes de l'économie circulaire (durabilité, réparabilité, recyclabilité)",
        justificatifs: [
          "Description des modifications apportées aux produits/services",
          "Résultats en termes de durabilité et recyclabilité"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a transformé son modèle d'affaires pour s'inscrire pleinement dans l'économie circulaire (économie de fonctionnalité, symbiose industrielle, etc.)",
        justificatifs: [
          "Description du nouveau modèle d'affaires",
          "Indicateurs de performance circulaire",
          "Reconnaissance externe de la démarche"
        ]
      }
    ]
  }
];
