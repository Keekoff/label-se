
import { associativeContributionQuestion } from "./associativeContribution";
import { responsiblePurchasingQuestion } from "./responsiblePurchasing";
import { responsibleDigitalQuestion } from "./responsibleDigital";
import { communicationQuestion } from "./communication";
import { supplierRelationsQuestion } from "./supplierRelations";
import { socialImpactQuestion } from "./socialImpact";
import { Question } from "../types";

export const QUESTIONS: Question[] = [
  associativeContributionQuestion,
  responsiblePurchasingQuestion,
  responsibleDigitalQuestion,
  communicationQuestion,
  supplierRelationsQuestion,
  socialImpactQuestion
];

// Fonction d'aide pour récupérer les justificatifs par question et option
export const getJustificatifsForQuestion = (questionId: string, optionLabel: string): string[] => {
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
