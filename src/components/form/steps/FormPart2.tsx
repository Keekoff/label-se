
import React from "react";
import { FormPart2Props } from "./types";
import { QUESTIONS } from "./FormPart2/questions";
import QuestionCard from "./FormPart2/QuestionCard";

/**
 * Récupère les justificatifs pour une question et une réponse spécifiques de la Partie 2
 */
export const getJustificatifsForPart2 = (questionId: string, optionLabel: string): string[] => {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) {
    console.warn(`Question non trouvée avec l'identifiant: ${questionId}`);
    return [];
  }
  
  const option = question.options.find(o => o.label === optionLabel);
  if (!option || !option.justificatifs) {
    console.warn(`Option non trouvée avec le libellé "${optionLabel}" pour la question "${questionId}" ou elle n'a pas de justificatifs`);
    return [];
  }
  
  return option.justificatifs;
};

const FormPart2: React.FC<FormPart2Props> = ({ onValidityChange, formState, setFormState }) => {
  console.log("FormPart2 - Rendu avec formState:", Object.keys(formState));
  
  React.useEffect(() => {
    // Vérifier la validité du formulaire (toutes les questions doivent avoir au moins une réponse)
    const isValid = QUESTIONS.every(question => {
      const answers = formState[question.id];
      return Array.isArray(answers) && answers.length > 0;
    });
    
    console.log("FormPart2 - Vérification de validité:", isValid);
    onValidityChange(isValid);
  }, [formState, onValidityChange]);

  const toggleAnswer = (questionId: string, label: string, selected: boolean) => {
    console.log(`FormPart2 - Toggle pour ${questionId}, label: ${label}, selected: ${selected}`);
    
    // Trouver la question pour vérifier ses options
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      console.warn(`Question non trouvée: ${questionId}`);
      return;
    }
    
    // Créer une copie du state actuel pour une mise à jour immutable
    const newFormState = { ...formState };
    
    // S'assurer que la propriété existe et est un tableau
    const currentAnswers = Array.isArray(newFormState[questionId]) ? [...newFormState[questionId]] : [];
    
    // Gestion différente selon si c'est "Ce critère ne s'applique pas" ou une autre option
    if (label.includes("Ce critère ne s'applique pas")) {
      // Si cette option est sélectionnée, on efface toutes les autres
      newFormState[questionId] = selected ? [label] : [];
    } else {
      if (selected) {
        // Si on ajoute une option normale, supprimer "Ce critère ne s'applique pas" si présent
        const filteredAnswers = currentAnswers.filter(a => !a.includes("Ce critère ne s'applique pas"));
        newFormState[questionId] = [...filteredAnswers, label];
      } else {
        // Si on retire une option
        newFormState[questionId] = currentAnswers.filter(a => a !== label);
      }
    }
    
    console.log(`FormPart2 - Nouvelle valeur pour ${questionId}:`, newFormState[questionId]);
    
    // Mettre à jour le state du formulaire
    setFormState(newFormState);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 2 : Économique & Sociétal</h2>
        <p className="text-gray-600">
          Cette section concernera les aspects économiques et sociétaux de votre entreprise.
        </p>
      </div>

      <div className="space-y-8">
        {QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            selectedAnswers={Array.isArray(formState[question.id]) ? formState[question.id] : []}
            onAnswerToggle={toggleAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default FormPart2;
