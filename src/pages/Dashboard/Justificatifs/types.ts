
export type JustificatifStatus = 'pending' | 'uploaded' | 'validated';

export type Justificatif = {
  id: string;
  question_identifier: string;
  response: string;
  justificatifs: string[];
  file_path?: string;
  file_name?: string;
  status: JustificatifStatus;
};

export type GroupedJustificatifs = {
  [questionId: string]: {
    questionId: string;
    questionTitle: string;
    items: Justificatif[];
  }
};
