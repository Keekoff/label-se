import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "production",
    title: "Production : énergie & matériaux utilisés",
    description: "Les activités productives qui utilisent les processus et systèmes non polluants, qui préservent l'énergie et les ressources naturelles.",
    options: [
      {
        value: "A",
        label: "L'entreprise lutte contre le gaspillage des ressources pour ne pas encourager la surconsommation et donc la surproduction",
        justificatifs: [
          "Lettre d'engagement",
          "Identification des actions",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      {
        value: "B",
        label: "L'entreprise privilégie les matériaux recyclés et/ou pouvant être recyclables et/ou la production locale et/ou le circuit court dans les sourcing de ses matières premières et/ou emballages",
        justificatifs: [
          "Lettre d'engagement",
          "Identification des sources de matières premières et emballage",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      {
        value: "C",
        label: "L'entreprise privilégie les fournisseurs qui s'inscrivent dans une démarche éco-responsable et inclusive et/ou ayant une bonne performance RSE. Elle privilégie des produits faits de matières recyclées et recyclables",
        justificatifs: [
          "Lettre d'engagement",
          "Identification des fournisseurs de matières premières et emballage",
          "Audit des prestataires et fournisseurs"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "wasteManagement",
    title: "Recyclage & gestion des déchets",
    description: "Organisation et mise en œuvre des moyens de collecte, tri, transport et traitement des déchets.",
    options: [
      {
        value: "A",
        label: "L'entreprise communique sur son engagement en faveur du recyclage, sensibilise ses collaborateurs et a mis en place le tri sélectif dans ses locaux",
        justificatifs: [
          "Messages diffusés à tous les collaborateurs sur la thématique du tri (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)",
          "Affichage dans les locaux",
          "Présence de poubelles ou bacs de recyclage (photos)"
        ]
      },
      {
        value: "B",
        label: "L'entreprise utilise un service/prestataire pour assurer le tri sélectif et le recyclage de ses déchets (tri, piles, cartouches d'encre...)",
        justificatifs: [
          "Identification des fournisseurs en matière de tri des déchets",
          "Affichage dans les locaux",
          "Présence de poubelles ou bacs de recyclage (photos)"
        ]
      },
      {
        value: "C",
        label: "L'entreprise a mis en place une politique du zéro déchet : limite des impressions, vaisselle réutilisable et suppression des monodoses (bouteilles d'eau, café en dosette...), utilisation de produits d'entretien biodégradables...",
        justificatifs: [
          "Lettre d'engagement",
          "Preuves des actions concrètes (photos, vidéos, témoignages ...)",
          "Identification des fournisseurs et solutions utilisés"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "ecoDesign",
    title: "Éco-conception",
    description: "Intégration systématique des aspects environnementaux dès la conception et le développement de produits.",
    options: [
      {
        value: "A",
        label: "L'entreprise pratique l'éco-design, privilégie le choix des matières premières biosourcées, essaie d'optimiser la masse et le volume, choisit des processus de fabrication à impact réduit, optimise les emballages et les modes de distribution",
        justificatifs: [
          "Lettre d'engagement",
          "Preuves des processus de sourcing matières premières durables, et de fournisseurs privilégiant l'économie circulaire, l'éco-conception et tout mode de distribution visant à réduire leur impact",
          "Choix de fournisseurs ou prestataires engagés"
        ]
      },
      {
        value: "B",
        label: "L'entreprise développe ses produits/services via une approche d'éco-conception (conception, fabrication, logistique, distribution et usage). Elle prévoit une durée d'utilisation longue du produit, prend en compte le recyclage et sa valorisation",
        justificatifs: [
          "Lettre d'engagement",
          "Explications et détails du processus de développement produit"
        ]
      },
      {
        value: "C",
        label: "L'entreprise éco-conçoit ses produits et services au sens de la directive n° 2009/125 ou de la norme ISO 14062",
        justificatifs: [
          "Présentation du label éco-conception (valide ou en cours d'obtention)"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "continuousEvaluation",
    title: "Évaluation permanente",
    description: "Vérification continuelle des résultats, opportunités d'amélioration, et engagement dans une démarche d'amélioration continue.",
    options: [
      {
        value: "A",
        label: "L'entreprise audite ses produits/services et leur impact chaque année en menant des enquêtes client, en analysant les retours consommateurs (des produits, suite à la casse ou mal-façons)",
        justificatifs: [
          "Exemple de documents d'audit interne ou externe (enquêtes clients, questionnaire de satisfaction produit, NPS...)"
        ]
      },
      {
        value: "B",
        label: "L'entreprise pratique le surcyclage en visant à concevoir des produits d'une meilleure efficacité énergétique et moins polluant que les produits d'origine",
        justificatifs: [
          "Lettre d'engagement",
          "Preuve des actions engagées, audit d'impact des produits, détails des processus de fabrication et développement produit"
        ]
      },
      {
        value: "C",
        label: "L'entreprise a modifié le mode de production initial pour que les matériaux produits soient réutilisables ou recyclables",
        justificatifs: [
          "Lettre d'engagement",
          "Preuve des actions engagées, audit d'impact des produits, détails des processus de fabrication et développement produit"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "energyManagement",
    title: "Maîtrise et optimisation de la consommation de ressources énergétiques",
    description: "Gestion intelligente de la consommation d'énergie dans toutes les activités.",
    options: [
      {
        value: "A",
        label: "Éteindre son ordinateur et son écran à la fin de la journée, et débrancher tous les appareils électriques qui consomment de l’électricité en mode veille",
        justificatifs: [
          "Preuves des actions concrètes (photos, vidéos, témoignages ...)"
        ]
      },
      {
        value: "B",
        label: "Privilégier le chauffage électrique ou les énergies vertes (géothermie, éolien, solaire). Remplacer les thermostats analogiques par des thermostats numériques",
        justificatifs: [
          "Lettre d'engagement",
          "Preuves des actions concrètes (photos, vidéos, témoignages ...)",
          "Choix de fournisseurs ou prestataires engagés"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "carbonEmissions",
    title: "Plan de contrôle / limite des émissions carbones",
    description: "Maîtrise et réduction des émissions de gaz à effet de serre liées aux activités.",
    options: [
      {
        value: "A",
        label: "L'entreprise réalise un bilan carbone annuel ou prévoit de le faire dans les 2 ans",
        justificatifs: [
          "Présentation du plan de réduction d'impact, d'une certification ou labellisation en ce sens",
          "Lettre d'engagement",
          "Justificatif d'achat d'un crédit carbone"
        ]
      },
      {
        value: "B",
        label: "L'entreprise possède un plan pour réduire son impact carbone et/ou le compenser. Elle possède le «Label Bas Carbone» du Ministère de la Transition Écologique et Solidaire ou un équivalent. L'entreprise achète ou a déjà acheté des crédits carbone",
        justificatifs: [
          "Présentation du plan de réduction d'impact, d'un bilan carbone, d'une certification ou labellisation en ce sens",
          "Justificatif d'achat d'un crédit carbone",
          "Lettre d'engagement"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "circularEconomy",
    title: "Gestion participative & économie circulaire",
    description: "Modèle économique d'échange et de production qui vise à augmenter l'efficacité de l'utilisation des ressources.",
    options: [
      {
        value: "A",
        label: "L'entreprise met à disposition de ses collaborateurs les moyens d'expression, de contribution, de réalisation et d'amélioration des produits/services pour le développement de l'économie circulaire",
        justificatifs: [
          "Lettre d'engagement",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)",
          "Affichage dans les locaux",
          "Exemple de documents d'audit interne ou externe"
        ]
      },
      {
        value: "B",
        label: "L'entreprise partage ses bonnes pratiques sur l'économie circulaire, l'éco-design, l'éco-conception, la maîtrise et l'économie des ressources",
        justificatifs: [
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)",
          "Affichage dans les locaux",
          "Partage de bonnes pratiques auprès des collaborateurs et/ou en externe"
        ]
      },
      {
        value: "C",
        label: "L'entreprise a créé, développe ou contribue à un écosystème visant à assurer un cycle de vie produit optimisé. L'entreprise a développé des partenariats dans une logique d'économie circulaire",
        justificatifs: [
          "Preuve de l'existence de l'écosystème et des actions menées par l'entreprise",
          "Identification des partenaires (prestataires, fournisseurs, institutions, écoles...)"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "responsiblePurchasing",
    title: "Politique d'achats responsables",
    description: "Intégration de critères sociaux, sociétaux et environnementaux aux processus d'achat.",
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
        label: "L'entreprise a déployé une politique RSE et diffuse les normes d'achats responsables décrétées par l’AFNOR sous le n°NFX 50-135, déclinaison de la norme ISO 26000 auprès des collaborateurs",
        justificatifs: [
          "Identification du responsable RSE",
          "Présence du sujet et des actions RSE dans la feuille de route de l'année passée et à venir"
        ]
      },
      {
        value: "D",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  }
];
