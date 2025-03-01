
import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "diversity",
    title: "Diversité",
    description: "Votre entreprise est-elle engagée en faveur de la diversité?",
    options: [
      {
        value: "option1",
        label: "L'entreprise valorise la diversité et sensibilise ses collaborateurs sur le sujet",
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
        value: "option2",
        label: "L'entreprise a établi une liste de tous les types possibles de diversités au sein de son organisation et a initié une démarche pour y répondre",
        justificatifs: [
          "Existence d'un comité dédié à la diversité",
          "Mesures d'accompagnement pour les publics concernés",
          "Actions de sensibilisation particulières, par exemple lors des journées dédiées comme la journée de la femme, de la lutte contre les violences..."
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place des processus de recrutement sans discrimination, des programmes d'intégration ou dispositifs pour prévenir les stéréotypes et a identifié une personne de référence ou une personne de confiance sur le sujet",
        justificatifs: [
          "Guide d'entretien d'embauche ou documents relatifs au processus de recrutement de l'entreprise",
          "Identification d'un référent diversité",
          "Plan d'action diversité",
          "Exemple de processus de recrutement non discriminant comme les CV anonymes"
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
    description: "Votre entreprise est-elle engagée en faveur de l'égalité?",
    options: [
      {
        value: "option1",
        label: "L'entreprise respecte l'égalité salariale",
        justificatifs: [
          "Mesure de l'égalité salariale",
          "Lettre d'engagement",
          "Politique de rémunération"
        ]
      },
      {
        value: "option2",
        label: "L'entreprise a analysé et corrigé les inégalités de genre dans les avantages en nature et les autres avantages sociaux-économiques",
        justificatifs: [
          "Analyse globale des salaires",
          "Analyse chiffrée par poste",
          "Liste des avantages en nature proposés aux salarié.e.s et politique d'octroi"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise veille à la parité dans sa gouvernance et dans ses équipes de management",
        justificatifs: [
          "Rapport sur la parité",
          "Organigramme avec répartition H/F/NB",
          "Index égalité ou autre mesure"
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
    description: "Votre entreprise est-elle engagée en faveur de l'intégration des personnes en situation de handicap?",
    options: [
      {
        value: "option1",
        label: "L'entreprise sensibilise l'ensemble de ses collaborateurs aux questions autour du handicap",
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
        value: "option2",
        label: "L'entreprise s'engage à prendre en compte le handicap dans ses process de recrutement et adapte ses locaux pour faciliter l'accueil des personnes en situation de handicap",
        justificatifs: [
          "Guide d'entretien d'embauche ou documents relatifs au processus de recrutement de l'entreprise",
          "Photographie des locaux aménagés pour l'accueil des personnes en situation de handicap"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise alloue des moyens humains et financiers importants pour intégrer les personnes en situation de handicap et aller au-delà de ses obligations légales d'emploi",
        justificatifs: [
          "Preuve de la création d'un poste dédié (ex : chef de projet Handicap, responsable de mission Handicap)",
          "Procédure de maintien des salariés en situation de handicap dans l'emploi",
          "Taux d'emploi des personnes en situation de handicap",
          "Mesures d'accompagnement pour les publics concernés"
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
    description: "Votre entreprise est-elle engagée en faveur de la santé et du bien-être au travail?",
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
    description: "Votre entreprise est-elle engagée en faveur de la parentalité?",
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
    description: "Votre entreprise est-elle engagée en faveur de la formation?",
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
        label: "L'entreprise contribue à développer l'employabilité de son personnel et propose une montée en compétence régulière et des actions favorisant la mobilité interne, même externe ou encore de GPEC",
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
    description: "Votre entreprise a-t-elle mis en place une politique RSE?",
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
    description: "Votre entreprise est-elle engagée en faveur de la protection des données?",
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
        label: "L'entreprise dispose d'une personne dédiée ou d'un DPO, et remplit les obligations du RGPD quant à l'accès et au stockage des données personnelles",
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
    description: "Votre entreprise est-elle engagée en faveur des mobilités durables?",
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
