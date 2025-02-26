
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

interface FormPart2Props {
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
    id: "associativeContribution",
    title: "1 - Contribution associative",
    description: "Soutien à des projets associatifs ou pro bono.",
    options: [
      { value: "A", label: "Soutien non financier à des associations." },
      { value: "B", label: "Engagement salarié sur temps de travail pour des ONG." },
      { value: "C", label: "Contribution financière à des initiatives sociales." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "responsiblePurchasing",
    title: "2 - Politique d'achats responsables",
    description: "Sélection de fournisseurs éthiques et écoresponsables.",
    options: [
      { value: "A", label: "Mobilier/équipements de seconde main et faible impact." },
      { value: "B", label: "Fournisseurs certifiés éthiques/écoresponsables." },
      { value: "C", label: "Politique RSE alignée sur normes AFNOR/ISO 26000." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "responsibleDigital",
    title: "3 - Numérique responsable",
    description: "Réduction de l'empreinte sociale et environnementale du numérique.",
    options: [
      { value: "A", label: "Communication dématérialisée responsable." },
      { value: "B", label: "Achats d'équipements reconditionnés/écologiques." },
      { value: "C", label: "Démarche active de sobriété numérique." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "communication",
    title: "4 - Communication",
    description: "Messages et supports adressés aux consommateurs.",
    options: [
      { value: "A", label: "Mise en avant des actions écologiques." },
      { value: "B", label: "Supports de communication responsables (PLV, goodies)." },
      { value: "C", label: "Encouragement de comportements responsables via la communication." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "supplierRelations",
    title: "5 - Relations fournisseurs et prestataires",
    description: "Collaboration équilibrée et durable avec les partenaires.",
    options: [
      { value: "A", label: "Choix de fournisseurs à impact local positif." },
      { value: "B", label: "Accompagnement des fournisseurs vers une démarche durable." },
      { value: "C", label: "Non applicable." }
    ]
  },
  {
    id: "socialImpact",
    title: "6 - Prise en compte de l'impact social",
    description: "Effets de l'activité sur la société et les parties prenantes.",
    options: [
      { value: "A", label: "Analyse de la chaîne de valeur et sensibilisation des équipes." },
      { value: "B", label: "Investissement dans des projets à impact social." },
      { value: "C", label: "Statut ESS ou entreprise à mission." },
      { value: "D", label: "Non applicable." }
    ]
  }
];

const FormPart2 = ({ onValidityChange, formState, setFormState }: FormPart2Props) => {
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const initialAnswers: Record<string, string[]> = {};
    QUESTIONS.forEach(question => {
      initialAnswers[question.id] = Array.isArray(formState[question.id]) 
        ? formState[question.id] 
        : [];
    });
    return initialAnswers;
  });

  const toggleAnswer = (questionId: string, value: string, label: string) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers: string[];

    if (value === "D" || label === "Non applicable") {
      // If selecting "Non applicable", clear other selections
      newAnswers = currentAnswers.includes(label) ? [] : [label];
    } else {
      // If selecting another option, remove "Non applicable" if present
      if (currentAnswers.includes("Non applicable")) {
        newAnswers = [label];
      } else {
        newAnswers = currentAnswers.includes(label)
          ? currentAnswers.filter(v => v !== label)
          : [...currentAnswers, label];
      }
    }
    
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    setFormState({ ...formState, ...updatedAnswers });

    const isValid = Object.values(updatedAnswers).every(answer => answer.length > 0);
    onValidityChange(isValid);
  };

  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    onValidityChange(isValid);
  }, [answers]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 2 : Développement d'impact social positif</h2>
        <p className="text-gray-600">
          Les questions suivantes concernent les effets de l'entreprise sur le plan social et son écosystème local.
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

export default FormPart2;
