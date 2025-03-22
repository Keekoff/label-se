
import React from "react";
import FormPart2 from "./FormPart2";
import { FormPart2Props } from "./types";

const FormPart2Component: React.FC<FormPart2Props> = ({ onValidityChange, formState, setFormState }) => {
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

export default React.memo(FormPart2Component);
