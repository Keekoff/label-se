
export interface Question {
  id: string;
  title: string;
  description: string;
  options: {
    value: string;
    label: string;
  }[];
}
