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
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "diversity",
    title: "1 - Diversité",
    description: "Ensemble des personnes qui diffèrent les unes des autres par leur origine géographique, socio-culturelle ou religieuse, leur âge, leur sexe, leur orientation sexuelle, etc.",
    options: [
      { value: "A", label: "L'entreprise fournit un espace de travail non-discriminant et offre des outils d'expression en cas de non-respect de la diversité." },
      { value: "B", label: "L'entreprise possède et communique une charte sociale auprès de tous ses collaborateurs." },
      { value: "C", label: "La lutte contre les discriminations est intégrée aux processus RH." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "equality",
    title: "2 - Égalité",
    description: "Absence de toute discrimination entre les êtres humains sur le plan de leurs droits.",
    options: [
      { value: "A", label: "L'entreprise fournit un espace de travail non-discriminant et offre des outils contre les propos sexistes/discriminatoires." },
      { value: "B", label: "L'entreprise communique publiquement un code éthique." },
      { value: "C", label: "Égalité salariale et de traitement strictement appliquée." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "disability",
    title: "3 - Handicap",
    description: "Limitation d'activité ou restriction de participation à la vie de l'entreprise.",
    options: [
      { value: "A", label: "Postes ouverts aux personnes en situation de handicap dans les offres d'emploi." },
      { value: "B", label: "Communication et actions concrètes pour l'inclusion des travailleurs handicapés." },
      { value: "C", label: "Quota de 6 % de salariés en situation de handicap respecté (si ≥20 salariés)." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "health",
    title: "4 - Santé des salariés et bien-être au travail",
    description: "Équilibre global entre satisfaction professionnelle et épanouissement personnel.",
    options: [
      { value: "A", label: "Actions pour limiter les communications hors horaires de travail." },
      { value: "B", label: "Mobilier ergonomique et réunions organisées pour favoriser la concentration." },
      { value: "C", label: "Politique QVT/HSE déployée avec plans d'action collaboratifs." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "parentality",
    title: "5 - Parentalité",
    description: "Équilibre entre rôle de parent et vie professionnelle.",
    options: [
      { value: "A", label: "Facilitation du retour après congés maternité/paternité." },
      { value: "B", label: "Télétravail facilité." },
      { value: "C", label: "Congé paternité étendu proposé." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "training",
    title: "6 - Formation",
    description: "Adaptation technique, physique et psychologique des collaborateurs à leurs fonctions.",
    options: [
      { value: "A", label: "Sessions d'information et formations régulières." },
      { value: "B", label: "Développement de l'employabilité hors GPEC." },
      { value: "C", label: "Formations personnalisées selon les besoins individuels." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "csr",
    title: "7 - Politique RSE",
    description: "Intégration des préoccupations sociales et environnementales dans les activités.",
    options: [
      { value: "A", label: "Sensibilisation aux enjeux RSE et actions concrètes." },
      { value: "B", label: "Volonté de recruter un responsable RSE dans les 2 ans." },
      { value: "C", label: "Responsable RSE désigné et politique RSE active." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "privacy",
    title: "8 - Privacy/data",
    description: "Protection des données des parties prenantes.",
    options: [
      { value: "A", label: "Respect de la vie privée des salariés." },
      { value: "B", label: "Outils et processus pour la confidentialité des données." },
      { value: "C", label: "DPO désigné et conformité RGPD." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "transport",
    title: "9 - Transports",
    description: "Mobilité des collaborateurs et marchandises.",
    options: [
      { value: "A", label: "Sensibilisation aux mobilités douces." },
      { value: "B", label: "Transports en commun privilégiés pour les déplacements courts." },
      { value: "C", label: "Co-financement de modes de transport doux (vélo/trottinette)." },
      { value: "D", label: "Non applicable." }
    ]
  }
];

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

  const toggleAnswer = (questionId: string, value: string) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers: string[];

    if (value.includes("Non applicable")) {
      newAnswers = currentAnswers.includes(value) ? [] : [value];
    } else {
      newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers.filter(v => !v.includes("Non applicable")), value];
    }
    
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    setFormState({ ...formState, ...updatedAnswers });
  };

  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    console.log('Initial form validation:', isValid);
    onValidityChange(isValid);
  }, [answers]);

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
                          answers[question.id]?.includes(option.value) && "bg-accent"
                        )}
                        onClick={() => toggleAnswer(question.id, option.value)}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            answers[question.id]?.includes(option.value)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50"
                          )}
                        >
                          <Check
                            className={cn(
                              "h-4 w-4",
                              answers[question.id]?.includes(option.value) ? "opacity-100" : "opacity-0"
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
