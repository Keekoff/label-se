
import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "associativeContribution",
    title: "1 - Contribution associative",
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  }
];
