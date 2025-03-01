
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
  answers: string[];
  onAnswerToggle: (questionId: string, value: string, forceState?: boolean) => void;
}

export interface FormPart1Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}
