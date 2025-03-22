
import React from "react";
import FormPart2 from "./FormPart2";
import { FormPart2Props } from "./FormPart2/types";

// Composant FormPart2 avec les props nécessaires
const FormPart2Component: React.FC<FormPart2Props> = ({ onValidityChange, formState, setFormState }) => {
  console.log("FormPart2Component - Rendering with formState:", Object.keys(formState));
  
  return (
    <div key="form-part-2-wrapper">
      <FormPart2 
        onValidityChange={onValidityChange}
        formState={formState} 
        setFormState={setFormState}
      />
    </div>
  );
};

export default FormPart2Component;
