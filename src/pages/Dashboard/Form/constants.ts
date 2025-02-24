
import { FormStep } from "./types";

export const FORM_STEPS: FormStep[] = [
  { id: 1, title: "Disclaimer", isValid: false },
  { id: 2, title: "Contact et Entreprise", isValid: false },
  { id: 3, title: "Partie 1", isValid: false },
  { id: 4, title: "Partie 2", isValid: false },
  { id: 5, title: "Partie 3", isValid: false },
  { id: 6, title: "Remerciement", isValid: true },
];

export const INITIAL_FORM_STATE = {
  firstName: "",
  email: "",
  companyName: "",
  sectors: [],
  legalForm: "",
  streetAddress: "",
  postalCode: "",
  city: "",
  foundingYear: "",
  employeeCount: "",
  hasFunding: "",
  fundingDetails: "",
};
