import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "diversity",
    title: "Diversité",
    description: "Votre entreprise est-elle engagée en faveur de la diversité ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise fournit un espace de travail non-discriminant et offre des outils d'expression en cas de non-respect de la diversité, propos racistes, stigmatisants ou discriminatoires (âge, genre, orientation sexuelle, religion, croyances...)",
        justificatifs: [
          "Affichage dans les locaux",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise possède et communique sur un code éthique / charte sociale auprès de tous ses collaborateurs et publiquement",
        justificatifs: [
          "Affichage dans les locaux",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      {
        value: "option3",
        label: "La lutte contre les discriminations est intégrée au processus des RH",
        justificatifs: [
          "Présence dans la feuille de route stratégique des RH",
          "Actions menées par les RH sur le sujet (événement, messages aux collaborateurs)",
          "Présence dans les questionnaires d'entretien annuel"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "equality",
    title: "Égalité",
    description: "Votre entreprise est-elle engagée en faveur de l'égalité ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise fournit un espace de travail non-discriminant et offre des outils d'expression en cas de non-respect de l'égalité, propos mysogynes ou discriminatoires de toute sorte",
        justificatifs: [
          "Affichage dans les locaux",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise possède et communique sur un code éthique / charte sociale auprès de tous ses collaborateurs et publiquement",
        justificatifs: [
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
        value: "option3",
        label: "L'entreprise veille à une stricte égalité salariale et de traitement entre ses collaborateurs, ceci est intégré au processus des RH",
        justificatifs: [
          "Existence d'une grille salariale et accessible aux collaborateurs",
          "Actions menées par les RH pour promouvoir une culture d'égalité salariale"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "handicap",
    title: "Handicap",
    description: "Votre entreprise est-elle engagée en faveur de l'intégration des personnes en situation de handicap ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise précise dans ses offres de stages et d'emploi que les postes sont ouverts aux personnes en situation de handicap",
        justificatifs: [
          "Publication des offres d'emploi et de stages précisant l'ouverture du poste aux personnes en situation de handicap"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise communique sur son engagement en faveur de l'inclusion des personnes en situation de handicap et met tout en oeuvre pour que les postes de travail et les accès aux infrastructures soient adaptés",
        justificatifs: [
          "Postes de travail et locaux accessibles aux personnes en situation de handicap (ergonomie, accès PMR etc...)"
        ]
      },
      {
        value: "option3",
        label: "L’entreprise a plus de 20 salariés et répond positivement à l’obligation d’emploi de travailleurs handicapés (OETH). Les salariés handicapés représentent bien 6 % de l’effectif de l’entreprise",
        justificatifs: [
          "Preuve administrative de la réponse positive à l'OETH"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "health",
    title: "Santé des salariés/bien-être au travail",
    description: "Votre entreprise est-elle engagée en faveur de la santé et du bien-être au travail ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise veille à l'équilibre vie pro/vie perso de ses salariés en mettant en place des actions pour limiter les communications (appels/sms/emails/messageries) en dehors des horaires de travail",
        justificatifs: [
          "Aucun email n'est envoyé le week-end, aucune communication n'implique une réponse hors des horaires de travail (lettre d'engagement)"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise a fait le choix d'un mobilier ergonomique, de produits sains (entretiens, snacks...) et lorsqu'elle met en place des activités autour du bien-être elle s'assure qu'elles soient accessibles à tous",
        justificatifs: [
          "Choix du matériel par les collaborateurs pour assurer une prise en main optimale",
          "Taille des bureaux et espace personnel suffisants pour chaque collaborateur même en cas de flex-office",
          "Evénement et/ou repas de team building sains et inclusifs, cours de yoga, de sport, massages assis, visite d'ostéopathe en entreprise..."
        ]
      },
      {
        value: "option3",
        label: "L'entreprise construit et déploie une politique QVT/HSE et met tout en oeuvre pour permettre l'amélioration des points négatifs relatifs au sujet mis en avant par les collaborateurs lors des entretiens",
        justificatifs: [
          "Présence dans les questionnaires d'entretien annuel",
          "Exemple de convocation à la médecine du travail, planning de visites médicales...",
          "Actions pour palier les retours des collaborateurs pour améliorer les conditions de travail",
          "Présence dans la feuille de route stratégique des RH"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "parentality",
    title: "Parentalité",
    description: "Votre entreprise est-elle engagée en faveur de la parentalité ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise facilite le retour en poste des parents après les congés maternité et paternité",
        justificatifs: [
          "Procédure de reprise de l'activité adaptée aux futurs parents"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise facilite le télétravail",
        justificatifs: [
          "Contrats de travail précisant la possibilité de travailler certains jours de la semaine en télétravail",
          "Politique globale favorisant le télétravail et la flexibilité"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise prévoit un congé paternité étendu",
        justificatifs: [
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
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "training",
    title: "Formation",
    description: "Votre entreprise est-elle engagée en faveur de la formation ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise met en place des sessions d'information et de formations auprès de toutes ses équipes",
        justificatifs: [
          "Mise en place d'interventions d'experts",
          "Organisation de sessions de formations à de nouveaux outils",
          "Communication d'un plan de formation global",
          "Mise en place de sessions d'échanges entre collaborateurs",
          "Partage de process",
          "Consultation des équipes terrain par les managers et/ou la direction"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise inclut le sujet formation lors de ses entretiens annuels. L'entreprise dispose d'un budget et d'un plan de formation pour l'ensemble des collaborateurs et le met à exécution chaque année",
        justificatifs: [
          "Présence dans les questionnaires d'entretien annuel",
          "Existence d'un plan de formation des salariés",
          "Présence du sujet dans la feuille de route stratégique de l'entreprise"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise contribue à developper l'employabilité de son personnel et propose une montée en compétence régulière et des actions favorisant la mobilité interne, même externe ou encore de GPEC",
        justificatifs: [
          "Proposition de formations orientées sur les soft-skills (prise de parole en public, management, gestion du stress...)",
          "Accompagnement des salariés grâce à la mise en place d'un bilan de compétences si nécessaire"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "csr",
    title: "Politique RSE",
    description: "Votre entreprise a-t-elle mis en place une politique RSE ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise sensibilise ses collaborateurs aux enjeux autour de la RSE et met en place des actions en ce sens",
        justificatifs: [
          "Liste et description des actions de sensibilisation",
          "Communication des actions de sensibilisation auprès des collaborateurs"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise a la volonté de se doter d'un responsable RSE dans les 2 ans",
        justificatifs: [
          "Lettre d'engagement",
          "Annonce de recrutement, fiche de poste..."
        ]
      },
      {
        value: "option3",
        label: "L'entreprise dispose d'un responsable (ou est en cours de recrutement) et a mis en place une politique RSE",
        justificatifs: [
          "Identification du responsable RSE",
          "Présence du sujet et des actions RSE dans la feuille de route de l'année passée et à venir"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "privacy",
    title: "Privacy/Data",
    description: "Votre entreprise est-elle engagée en faveur de la protection des données ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise s'engage à respecter la vie privée de ses salariés",
        justificatifs: [
          "Lettre d'engagement",
          "Mention au contrat de travail ou dans règlement intérieur."
        ]
      },
      {
        value: "option2",
        label: "L'entreprise offre tous les outils et processus utiles pour le respect de la vie privée, la sécurité et la confidentialité",
        justificatifs: [
          "Mise en place d'outils de sécurisation des mots de passe",
          "Limitation des partages de comptes et de mots de passe associés",
          "Mise en place de processus de protection des données et de bonnes pratiques et diffusion de ces derniers"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise dispose d'une personne dédiée ou d'un DPO, et remplie les obligations du RGPD quand à l'accès et au stockage des données personnelles",
        justificatifs: [
          "Identification du DPO",
          "Description des actions de mise en conformité avec le RGPD"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  },
  {
    id: "transport",
    title: "Transports",
    description: "Votre entreprise est-elle engagée en faveur des mobilités durables ?",
    options: [
      {
        value: "option1",
        label: "L'entreprise sensibilise ses collaborateurs aux alternatives de mobilités douces",
        justificatifs: [
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)",
          "Exemples de communication"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise privilégie les transports en commun et les mobilités douces pour les déplacements professionnels de courte distance. Elle privilégie le train pour les plus longues distances",
        justificatifs: [
          "Lettre d'engagement",
          "Preuves des voyages en train et autres moyens de transports responsables"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise co-finance l'achat ou la location d'un mode de transport doux (vélo électrique / trottinette électrique)",
        justificatifs: [
          "Lettre d'engagement",
          "Preuves d'achat des modes de transport doux"
        ]
      },
      {
        value: "option4",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      }
    ]
  }
];
