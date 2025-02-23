
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

interface FormPart3Props {
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
    id: "production",
    title: "1 - Production : énergie et matériaux utilisés",
    description: "Optimisation des ressources et réduction des polluants.",
    options: [
      { value: "A", label: "Lutte contre le gaspillage des ressources." },
      { value: "B", label: "Utilisation de matériaux recyclés/localisés." },
      { value: "C", label: "Collaboration avec fournisseurs écoresponsables certifiés." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "wasteManagement",
    title: "2 - Recyclage et gestion des déchets",
    description: "Traitement des déchets pour réintégration dans de nouveaux cycles.",
    options: [
      { value: "A", label: "Tri sélectif et sensibilisation au recyclage." },
      { value: "B", label: "Prestataire dédié au tri/recyclage." },
      { value: "C", label: "Politique zéro déchet (limitation des impressions, suppression des monodoses)." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "ecoDesign",
    title: "3 - Éco-conception",
    description: "Intégration des impacts environnementaux dans le cycle de vie des produits.",
    options: [
      { value: "A", label: "Pratique de l'éco-design et processus à impact réduit." },
      { value: "B", label: "Développement de produits durables via l'éco-conception." },
      { value: "C", label: "Conformité à la norme ISO 14062 ou directive européenne." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "continuousEvaluation",
    title: "4 - Évaluation permanente",
    description: "Amélioration continue des produits/services.",
    options: [
      { value: "A", label: "Audit annuel des impacts via retours clients." },
      { value: "B", label: "Surcyclage pour une meilleure efficacité énergétique." },
      { value: "C", label: "Production de matériaux réutilisables/recyclables." },
      { value: "D", label: "Non applicable." }
    ]
  },
  {
    id: "energyManagement",
    title: "5 - Maîtrise des ressources énergétiques",
    description: "Réduction de la consommation énergétique.",
    options: [
      { value: "A", label: "Extinction des appareils électriques en fin de journée." },
      { value: "B", label: "Énergies vertes et thermostats numériques." },
      { value: "C", label: "Non applicable." }
    ]
  },
  {
    id: "carbonEmissions",
    title: "6 - Plan de contrôle des émissions carbones",
    description: "Mesure et réduction de l'empreinte carbone.",
    options: [
      { value: "A", label: "Bilan carbone annuel ou prévu sous 2 ans." },
      { value: "B", label: "Label Bas Carbone ou compensation des émissions." },
      { value: "C", label: "Non applicable." }
    ]
  },
  {
    id: "circularEconomy",
    title: "7 - Gestion participative & économie circulaire",
    description: "Création de cycles de vie positifs pour les produits.",
    options: [
      { value: "A", label: "Implication des collaborateurs dans l'économie circulaire." },
      { value: "B", label: "Partage de bonnes pratiques avec l'écosystème." },
      { value: "C", label: "Développement de produits intégrés à une logique circulaire." },
      { value: "D", label: "Non applicable." }
    ]
  }
];

const FormPart3 = ({ onValidityChange, formState, setFormState }: FormPart3Props) => {
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
    const newAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(v => v !== value)
      : [...currentAnswers, value];
    
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    setFormState({ ...formState, ...updatedAnswers });
  };

  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    onValidityChange(isValid);
  }, [answers]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 3 : Maîtrise d'impact environnemental & développement durable</h2>
        <p className="text-gray-600">
          Les questions suivantes sont relatives aux actions déployées pour limiter l'empreinte écologique.
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

export default FormPart3;
