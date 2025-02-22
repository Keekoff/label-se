
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initialAnswers: Record<string, string> = {};
    QUESTIONS.forEach(question => {
      initialAnswers[question.id] = formState[question.id] || "";
    });
    return initialAnswers;
  });

  const updateAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setFormState({ ...formState, ...newAnswers });
  };

  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer !== "");
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
              <h3 className="text-lg font-medium">{question.title}</h3>
              <p className="text-gray-600 mt-1 text-sm">{question.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Votre réponse</Label>
              <Select
                value={answers[question.id]}
                onValueChange={(value) => updateAnswer(question.id, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une réponse" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormPart1;
