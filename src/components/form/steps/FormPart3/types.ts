
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
  onAnswerToggle: (questionId: string, value: string) => void;
}

export interface FormPart3Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}
