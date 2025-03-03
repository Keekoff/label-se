
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTORS, LABEL_LEGAL_FORMS } from './constants';

interface CompanyDetailsProps {
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
  onValidityChange: (isValid: boolean) => void;
  readOnly?: boolean;
}

const CompanyDetails = ({ formState, setFormState, onValidityChange, readOnly = false }: CompanyDetailsProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState?.companyName?.trim()) newErrors.companyName = "Le nom de la société est requis";
    if (!formState?.sector) newErrors.sector = "Le secteur est requis";
    if (!formState?.legalForm) newErrors.legalForm = "La forme juridique est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validate();
    onValidityChange(isValid);
  }, [formState]);

  const handleChange = (field: string, value: any) => {
    if (readOnly) return;
    
    setFormState((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if the current legal form is valid for the label submission
  // This helps handle cases where the legal form from eligibility might not be in our label form options
  const isValidLegalForm = (form: string) => LABEL_LEGAL_FORMS.includes(form);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations société</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Quel est le nom de votre société ? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            value={formState?.companyName || ""}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector">
            Quel est le secteur d'activité de l'entreprise ? <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState?.sector || ""}
            onValueChange={(value) => handleChange("sector", value)}
            disabled={readOnly}
          >
            <SelectTrigger className={readOnly ? "bg-gray-100" : ""}>
              <SelectValue placeholder="Sélectionnez un secteur" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>
            Quelle est la forme juridique de votre structure ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formState?.legalForm || ""}
            onValueChange={(value) => handleChange("legalForm", value)}
            disabled={readOnly}
          >
            <div className="grid grid-cols-2 gap-3">
              {LABEL_LEGAL_FORMS.map((formType) => (
                <div key={formType} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={formType} 
                    id={`legal-${formType}`} 
                    disabled={readOnly} 
                    className={formState?.legalForm === formType ? "text-primary border-primary" : ""}
                  />
                  <Label htmlFor={`legal-${formType}`}>{formType}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {!isValidLegalForm(formState?.legalForm) && formState?.legalForm && (
            <p className="text-sm text-amber-600">
              La forme juridique "{formState.legalForm}" n'est pas éligible pour le label. Veuillez sélectionner une forme juridique valide.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
