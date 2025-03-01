
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
import { QUESTIONS } from "./FormPart2/constants";
import { FormPart2Props } from "./FormPart2/types";

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

    if (value === "D" || label.includes("Ce critère ne s'applique pas")) {
      // Si on sélectionne "Ce critère ne s'applique pas à mon entreprise", on efface les autres sélections
      newAnswers = currentAnswers.includes(label) ? [] : [label];
    } else {
      // Si on sélectionne une autre option, on supprime "Ce critère ne s'applique pas" si présent
      const naAnswer = currentAnswers.find(a => a.includes("Ce critère ne s'applique pas"));
      
      if (naAnswer) {
        newAnswers = currentAnswers.filter(a => a !== naAnswer);
        newAnswers = label === naAnswer ? [] : [label];
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
  }, [answers, onValidityChange]);

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
