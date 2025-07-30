
import { useEffect, useState } from "react";
import { QUESTIONS } from "./FormPart3/constants";
import QuestionCard from "./FormPart3/QuestionCard";
import { FormPart3Props } from "./FormPart3/types";

// Helper function to get justificatifs for FormPart3
export const getJustificatifsForPart3 = (questionId: string, optionLabel: string): string[] => {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) {
    console.warn(`Question not found with id: ${questionId}`);
    return [];
  }
  
  const option = question.options.find(o => o.label === optionLabel);
  if (!option || !option.justificatifs) {
    console.warn(`Option not found with label "${optionLabel}" for question "${questionId}" or it has no justificatifs`);
    return [];
  }
  
  return option.justificatifs;
};

const FormPart3 = ({ onValidityChange, formState, setFormState }: FormPart3Props) => {
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const initialAnswers: Record<string, string[]> = {};
    QUESTIONS.forEach(question => {
      // Initialiser avec les valeurs existantes du formState
      initialAnswers[question.id] = Array.isArray(formState[question.id]) 
        ? formState[question.id] 
        : [];
    });
    return initialAnswers;
  });

  const toggleAnswer = (questionId: string, value: string) => {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) return;
    
    const option = question.options.find(opt => opt.value === value);
    if (!option) return;
    
    const label = option.label;
    const currentAnswers = answers[questionId] || [];
    let newAnswers: string[];

    // Gestion de l'option "Ce critère ne s'applique pas à mon entreprise"
    if (label.includes("Ce critère ne s'applique pas")) {
      newAnswers = currentAnswers.includes(label) ? [] : [label];
    } else {
      // Si sélection d'une option normale, supprimer "Ce critère ne s'applique pas" si présent
      newAnswers = currentAnswers.includes(label)
        ? currentAnswers.filter(v => v !== label)
        : [...currentAnswers.filter(v => !v.includes("Ce critère ne s'applique pas")), label];
    }
    
    // Mettre à jour les réponses et adapter le nom du champ pour correspondre à la base de données
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    
    // Correction du mappage des champs avec la base de données
    let dbFieldName = questionId;
    
    // Mappage des noms de champs du formulaire aux noms de colonnes dans la base de données
    const fieldMapping: Record<string, string> = {
      'wasteManagement': 'gestion_dechets',
      'ecoDesign': 'eco_conception',
      'continuousEvaluation': 'evaluation_continue',
      'energyManagement': 'gestion_energie',
      'carbonEmissions': 'emissions_carbone',
      'circularEconomy': 'economie_circulaire'
    };
    
    // Si le champ a un mappage spécial, utiliser ce nom pour la BD
    if (fieldMapping[questionId]) {
      dbFieldName = fieldMapping[questionId];
      console.log(`Mappage du champ ${questionId} vers ${dbFieldName} dans la base de données`);
    }
    
    // Mettre à jour le formState parent en utilisant le nom de champ correct
    setFormState({ 
      ...formState, 
      [questionId]: newAnswers, // Pour conserver la cohérence dans le formulaire React
      [dbFieldName]: newAnswers  // Pour assurer le bon mappage avec la BD
    });
    
    console.log(`Mise à jour du champ ${questionId} (${dbFieldName} en BD) avec:`, newAnswers);
  };

  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    onValidityChange(isValid);
    
    // Journaliser l'état actuel des réponses pour débogage
    console.log("État actuel des réponses pour la Partie 3:", answers);
    
    // S'assurer que toutes les réponses sont également mises à jour dans le formState
    // en utilisant le bon mappage des champs
    const updatedFormState = { ...formState };
    
    Object.entries(answers).forEach(([key, value]) => {
      updatedFormState[key] = value;
      
      // Mappage pour la base de données
      const fieldMapping: Record<string, string> = {
        'wasteManagement': 'gestion_dechets',
        'ecoDesign': 'eco_conception',
        'continuousEvaluation': 'evaluation_continue',
        'energyManagement': 'gestion_energie',
        'carbonEmissions': 'emissions_carbone',
        'circularEconomy': 'economie_circulaire'
      };
      
      if (fieldMapping[key]) {
        updatedFormState[fieldMapping[key]] = value;
      }
    });
    
    setFormState(updatedFormState);
  }, [answers, onValidityChange]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Partie 3 : Maîtrise d'impact environnemental & développement durable</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <p className="text-gray-700">
            Cette partie porte sur les actions mises en place pour mesurer, limiter et réduire l'empreinte
            environnementale de votre activité.
          </p>
          <p className="text-gray-700">
            Qu'il s'agisse de vos bureaux, de vos produits, de vos usages numériques ou de vos
            déplacements, chaque geste compte pour inscrire votre startup dans une trajectoire plus
            durable.
          </p>
          <p className="text-gray-700">
            <strong>Important :</strong> Vos réponses doivent s'appuyer sur des éléments tangibles : actions mises en œuvre
            documents ou outils utilisés au quotidien.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            selectedAnswers={answers[question.id] || []}
            onAnswerToggle={toggleAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default FormPart3;
