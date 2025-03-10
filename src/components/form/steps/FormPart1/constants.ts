
export const QUESTIONS = [
  {
    id: "handicap",
    title: "Situation de handicap",
    description: "Comment l'entreprise favorise-t-elle l'inclusion des personnes en situation de handicap ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "Mon entreprise a moins de 20 salariés mais elle a déjà embauché des personnes en situation de handicap",
        justificatifs: [
          "Copie des contrats de travail",
          "Attestation de reconnaissance de travailleur handicapé"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a plus de 20 salariés et répond positivement à l'obligation d'emploi de travailleurs handicapés (OETH). Les salariés handicapés représentent bien 6 % de l'effectif de l'entreprise",
        justificatifs: [
          "Déclaration OETH",
          "Copies des contrats de travail"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise va au-delà de l'obligation légale et met en place des actions spécifiques pour faciliter l'intégration et le maintien dans l'emploi des personnes en situation de handicap",
        justificatifs: [
          "Document décrivant la politique d'inclusion et d'accessibilité",
          "Témoignages des personnes concernées",
          "Exemples d'aménagement de postes"
        ]
      }
    ]
  },
  {
    id: "training",
    title: "Formation",
    description: "Comment l'entreprise contribue-t-elle au développement des compétences de ses collaborateurs ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise respecte ses obligations légales de formation et a mis en place un système de partage de connaissances entre collaborateurs",
        justificatifs: [
          "Document présentant le plan de formation",
          "Budget alloué à la formation"
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
        label: "L'entreprise propose des formations qualifiantes ou des certifications à ses collaborateurs pour les faire évoluer et enrichir leurs compétences",
        justificatifs: [
          "Exemples de formations qualifiantes ou certifiantes proposées",
          "Taux de progression interne des collaborateurs"
        ]
      }
    ]
  },
  {
    id: "parentality",
    title: "Parentalité",
    description: "Comment l'entreprise accompagne-t-elle ses collaborateurs parents ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise respecte les droits liés à la maternité et à la paternité, et facilite le retour au travail après un congé parental",
        justificatifs: [
          "Document présentant les mesures mises en place",
          "Témoignages de collaborateurs"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place des mesures spécifiques pour soutenir les parents (horaires flexibles, télétravail, aide à la garde d'enfants)",
        justificatifs: [
          "Document présentant les mesures mises en place",
          "Exemples concrets d'aménagements proposés"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise propose des avantages supplémentaires pour les familles (crèche d'entreprise, congés supplémentaires, aides financières)",
        justificatifs: [
          "Description des avantages proposés",
          "Budget alloué à ces avantages"
        ]
      }
    ]
  },
  {
    id: "privacy",
    title: "Privacy/Data",
    description: "Comment l'entreprise protège-t-elle les données personnelles ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise respecte les obligations légales de protection des données (RGPD) et informe les clients/utilisateurs de l'utilisation de leurs données",
        justificatifs: [
          "Politique de confidentialité",
          "Clauses contractuelles relatives à la protection des données"
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
        label: "L'entreprise va au-delà des obligations légales et a mis en place des mesures supplémentaires pour protéger les données (chiffrement, audits réguliers, formation des collaborateurs)",
        justificatifs: [
          "Description des mesures supplémentaires mises en place",
          "Résultats des audits de sécurité"
        ]
      }
    ]
  },
  {
    id: "genderEquality",
    title: "Égalité des genres",
    description: "Comment l'entreprise assure-t-elle l'égalité entre les femmes et les hommes ?",
    options: [
      {
        value: "option1",
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: []
      },
      {
        value: "option2",
        label: "L'entreprise respecte les lois sur l'égalité salariale et professionnelle entre les femmes et les hommes",
        justificatifs: [
          "Index de l'égalité professionnelle",
          "Politique salariale"
        ]
      },
      {
        value: "option3",
        label: "L'entreprise a mis en place des actions spécifiques pour promouvoir l'égalité des genres (sensibilisation, recrutement, promotion)",
        justificatifs: [
          "Plan d'action pour l'égalité professionnelle",
          "Exemples concrets d'actions mises en place"
        ]
      },
      {
        value: "option4",
        label: "L'entreprise a atteint la parité à tous les niveaux hiérarchiques et communique régulièrement sur ses résultats en matière d'égalité des genres",
        justificatifs: [
          "Répartition des effectifs par genre et par niveau hiérarchique",
          "Communication externe sur le sujet"
        ]
      }
    ]
  }
];
