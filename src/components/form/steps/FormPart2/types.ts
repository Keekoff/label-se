
export interface Question {
  id: string;
  title: string;
  description: string;
  options: {
    value: string;
    label: string;
    justificatifs?: string[];
  }[];
}

export interface QuestionProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerToggle: (questionId: string, value: string, selected: boolean) => void;
}

export interface FormPart2Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}
