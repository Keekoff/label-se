
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormPart1Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

interface Question {
  id: string;
  title: string;
  description: string;
  options: { value: string; label: string; justificatifs?: string[] }[];
}

const QUESTIONS: Question[] = [
  {
    id: "diversity",
    title: "1 - Diversité",
    description: "Ensemble des personnes qui diffèrent les unes des autres par leur origine géographique, socio-culturelle ou religieuse, leur âge, leur sexe, leur orientation sexuelle, etc.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise fournit un espace de travail non-discriminant et offre des outils d'expression en cas de non-respect de la diversité, propos racistes, stigmatisants ou discriminatoires (âge, genre, orientation sexuelle, religion, croyances...)",
        justificatifs: [
          "Affichage dans les locaux",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      { 
        value: "B", 
        label: "L'entreprise possède et communique sur un code éthique / charte sociale auprès de tous ses collaborateurs et publiquement",
        justificatifs: [
          "Affichage dans les locaux",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      { 
        value: "C", 
        label: "La lutte contre les discriminations est intégrée au processus des RH",
        justificatifs: [
          "Présence dans la feuille de route stratégique des RH",
          "Actions menées par les RH sur le sujet (événement, messages aux collaborateurs)",
          "Présence dans les questionnaires d'entretien annuel"
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
    id: "equality",
    title: "2 - Égalité",
    description: "Absence de toute discrimination entre les êtres humains sur le plan de leurs droits.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise fournit un espace de travail non-discriminant et offre des outils d'expression en cas de non-respect de l'égalité, propos mysogynes ou discriminatoires de toute sorte",
        justificatifs: [
          "Affichage dans les locaux",
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)"
        ]
      },
      { 
        value: "B", 
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
        value: "C", 
        label: "L'entreprise veille à une stricte égalité salariale et de traitement entre ses collaborateurs, ceci est intégré au processus des RH",
        justificatifs: [
          "Existence d'une grille salariale et accessible aux collaborateurs",
          "Actions menées par les RH pour promouvoir une culture d'égalité salariale"
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
    id: "handicap",
    title: "3 - Handicap",
    description: "Limitation d'activité ou restriction de participation à la vie de l'entreprise.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise précise dans ses offres de stages et d'emploi que les postes sont ouverts aux personnes en situation de handicap",
        justificatifs: [
          "Publication des offres d'emploi et de stages précisant l'ouverture du poste aux personnes en situation de handicap"
        ]
      },
      { 
        value: "B", 
        label: "L'entreprise communique sur son engagement en faveur de l'inclusion des personnes en situation de handicap et met tout en oeuvre pour que les postes de travail et les accès aux infrastructures soient adaptés",
        justificatifs: [
          "Postes de travail et locaux accessibles aux personnes en situation de handicap (ergonomie, accès PMR etc...)"
        ]
      },
      { 
        value: "C", 
        label: "L'entreprise a plus de 20 salariés et répond positivement à l'obligation d'emploi de travailleurs handicapés (OETH). Les salariés handicapés représentent bien 6 % de l'effectif de l'entreprise",
        justificatifs: [
          "Preuve administrative de la réponse positive à l'OETH"
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
    id: "health",
    title: "4 - Santé des salariés et bien-être au travail",
    description: "Équilibre global entre satisfaction professionnelle et épanouissement personnel.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise veille à l'équilibre vie pro/vie perso de ses salariés en mettant en place des actions pour limiter les communications (appels/sms/emails/messageries) en dehors des horaires de travail",
        justificatifs: [
          "Aucun email n'est envoyé le week-end, aucune communication n'implique une réponse hors des horaires de travail (lettre d'engagement)"
        ]
      },
      { 
        value: "B", 
        label: "L'entreprise a fait le choix d'un mobilier ergonomique, de produits sains (entretiens, snacks...) et lorsqu'elle met en place des activités autour du bien-être elle s'assure qu'elles soient accessibles à tous",
        justificatifs: [
          "Choix du matériel par les collaborateurs pour assurer une prise en main optimale",
          "Taille des bureaux et espace personnel suffisants pour chaque collaborateur même en cas de flex-office",
          "Evénement et/ou repas de team building sains et inclusifs, cours de yoga, de sport, massages assis, visite d'ostéopathe en entreprise..."
        ]
      },
      { 
        value: "C", 
        label: "L'entreprise construit et déploie une politique QVT/HSE et met tout en oeuvre pour permettre l'amélioration des points négatifs relatifs au sujet mis en avant par les collaborateurs lors des entretiens",
        justificatifs: [
          "Présence dans les questionnaires d'entretien annuel",
          "Exemple de convocation à la médecine du travail, planning de visites médicales...",
          "Actions pour palier les retours des collaborateurs pour améliorer les conditions de travail",
          "Présence dans la feuille de route stratégique des RH"
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
    id: "parentality",
    title: "5 - Parentalité",
    description: "Équilibre entre rôle de parent et vie professionnelle.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise facilite le retour en poste des parents après les congés maternité et paternité",
        justificatifs: [
          "Procédure de reprise de l'activité adaptée aux futurs parents"
        ]
      },
      { 
        value: "B", 
        label: "L'entreprise facilite le télétravail",
        justificatifs: [
          "Contrats de travail précisant la possibilité de travailler certains jours de la semaine en télétravail",
          "Politique globale favorisant le télétravail et la flexibilité"
        ]
      },
      { 
        value: "C", 
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
        value: "D", 
        label: "Ce critère ne s'applique pas à mon entreprise",
        justificatifs: ["N/A"]
      }
    ]
  },
  {
    id: "training",
    title: "6 - Formation",
    description: "Adaptation technique, physique et psychologique des collaborateurs à leurs fonctions.",
    options: [
      { 
        value: "A", 
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
        value: "B", 
        label: "L'entreprise inclut le sujet formation lors de ses entretiens annuels. L'entreprise dispose d'un budget et d'un plan de formation pour l'ensemble des collaborateurs et le met à exécution chaque année",
        justificatifs: [
          "Présence dans les questionnaires d'entretien annuel",
          "Existence d'un plan de formation des salariés",
          "Présence du sujet dans la feuille de route stratégique de l'entreprise"
        ]
      },
      { 
        value: "C", 
        label: "L'entreprise contribue à développer l'employabilité de son personnel et propose une montée en compétence régulière et des actions favorisant la mobilité interne, même externe ou encore de GPEC",
        justificatifs: [
          "Proposition de formations orientées sur les soft-skills (prise de parole en public, management, gestion du stress...)",
          "Accompagnement des salariés grâce à la mise en place d'un bilan de compétences si nécessaire"
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
    id: "csr",
    title: "7 - Politique RSE",
    description: "Intégration des préoccupations sociales et environnementales dans les activités.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise sensibilise ses collaborateurs aux enjeux autour de la RSE et met en place des actions en ce sens",
        justificatifs: [
          "Liste et description des actions de sensibilisation",
          "Communication des actions de sensibilisation auprès des collaborateurs"
        ]
      },
      { 
        value: "B", 
        label: "L'entreprise a la volonté de se doter d'un responsable RSE dans les 2 ans",
        justificatifs: [
          "Lettre d'engagement",
          "Annonce de recrutement, fiche de poste..."
        ]
      },
      { 
        value: "C", 
        label: "L'entreprise dispose d'un responsable (ou est en cours de recrutement) et a mis en place une politique RSE",
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
    id: "privacy",
    title: "8 - Privacy/data",
    description: "Protection des données des parties prenantes.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise s'engage à respecter la vie privée de ses salariés",
        justificatifs: [
          "Lettre d'engagement",
          "Mention au contrat de travail ou dans règlement intérieur."
        ]
      },
      { 
        value: "B", 
        label: "L'entreprise offre tous les outils et processus utiles pour le respect de la vie privée, la sécurité et la confidentialité",
        justificatifs: [
          "Mise en place d'outils de sécurisation des mots de passe",
          "Limitation des partages de comptes et de mots de passe associés",
          "Mise en place de processus de protection des données et de bonnes pratiques et diffusion de ces derniers"
        ]
      },
      { 
        value: "C", 
        label: "L'entreprise dispose d'une personne dédiée ou d'un DPO, et remplit les obligations du RGPD quant à l'accès et au stockage des données personnelles",
        justificatifs: [
          "Identification du DPO",
          "Description des actions de mise en conformité avec le RGPD"
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
    id: "transport",
    title: "9 - Transports",
    description: "Mobilité des collaborateurs et marchandises.",
    options: [
      { 
        value: "A", 
        label: "L'entreprise sensibilise ses collaborateurs aux alternatives de mobilités douces",
        justificatifs: [
          "Messages diffusés à tous les collaborateurs (welcome pack, emails, messagerie interne, réseaux sociaux, vidéo...)",
          "Exemples de communication"
        ]
      },
      { 
        value: "B", 
        label: "L'entreprise privilégie les transports en commun et les mobilités douces pour les déplacements professionnels de courte distance. Elle privilégie le train pour les plus longues distances",
        justificatifs: [
          "Lettre d'engagement",
          "Preuves des voyages en train et autres moyens de transports responsables"
        ]
      },
      { 
        value: "C", 
        label: "L'entreprise co-finance l'achat ou la location d'un mode de transport doux (vélo électrique / trottinette électrique)",
        justificatifs: [
          "Lettre d'engagement",
          "Preuves d'achat des modes de transport doux"
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

// Fonction utilitaire pour obtenir les justificatifs d'une question et option
export const getJustificatifs = (questionId: string, optionLabel: string): string[] => {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) return [];
  
  const option = question.options.find(o => o.label === optionLabel);
  if (!option || !option.justificatifs) return [];
  
  return option.justificatifs;
};

const FormPart1 = ({ onValidityChange, formState, setFormState }: FormPart1Props) => {
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const initialAnswers: Record<string, string[]> = {};
    QUESTIONS.forEach(question => {
      initialAnswers[question.id] = Array.isArray(formState[question.id]) 
        ? formState[question.id] 
        : [];
    });
    return initialAnswers;
  });

  // Fonction améliorée pour basculer les réponses tout en gardant la cohérence
  const toggleAnswer = (questionId: string, value: string, label: string) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers: string[];

    // Si "Ce critère ne s'applique pas à mon entreprise" est sélectionné, déselectionner toutes les autres réponses
    if (label.includes("Ce critère ne s'applique pas à mon entreprise")) {
      newAnswers = currentAnswers.includes(label) ? [] : [label];
    } else {
      // Si une réponse normale est sélectionnée, supprimer "Ce critère ne s'applique pas" s'il est présent
      newAnswers = currentAnswers.includes(label)
        ? currentAnswers.filter(v => v !== label)
        : [...currentAnswers.filter(v => !v.includes("Ce critère ne s'applique pas à mon entreprise")), label];
    }
    
    // Mettre à jour l'état local et propager au formulaire parent
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    
    // Debug pour vérifier ce qui est transmis au formulaire parent
    console.log(`Mise à jour du champ ${questionId} avec:`, newAnswers);
    
    // Mettre à jour le formulaire parent avec toutes les réponses
    setFormState({ ...formState, [questionId]: newAnswers });
  };

  // Vérifier la validité du formulaire à chaque changement des réponses
  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    onValidityChange(isValid);
    
    // Journaliser l'état actuel des réponses pour le débogage
    console.log("État actuel des réponses:", answers);
  }, [answers, onValidityChange]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 1 : Gouvernance interne juste et inclusive</h2>
        <p className="text-gray-600">
          Les questions suivantes concernent la gestion interne et la culture de l'entreprise, particulièrement la lutte contre les discriminations et les conditions de travail.
        </p>
      </div>

      <div className="space-y-8">
        {QUESTIONS.map((question) => (
          <div key={question.id} className="space-y-4 pb-6 border-b last:border-0">
            <div>
              <h3 className="text-lg font-medium flex items-start gap-1">
                {question.title}
                <span className="text-red-500">*</span>
              </h3>
              <p className="text-gray-600 mt-1 text-sm">{question.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Votre réponse</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {answers[question.id]?.length > 0
                      ? `${answers[question.id].length} réponse${answers[question.id].length > 1 ? 's' : ''} sélectionnée${answers[question.id].length > 1 ? 's' : ''}`
                      : "Sélectionner vos réponses"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <div className="max-h-[300px] overflow-auto p-1">
                    {question.options.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer",
                          "hover:bg-accent hover:text-accent-foreground",
                          answers[question.id]?.includes(option.label) && "bg-accent"
                        )}
                        onClick={() => toggleAnswer(question.id, option.value, option.label)}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            answers[question.id]?.includes(option.label)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50"
                          )}
                        >
                          <Check
                            className={cn(
                              "h-4 w-4",
                              answers[question.id]?.includes(option.label) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                        {option.label}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormPart1;
