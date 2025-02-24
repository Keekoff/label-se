
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EMPLOYEE_COUNTS, FUNDING_OPTIONS } from './constants';

interface CompanyMetricsProps {
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
  onValidityChange: (isValid: boolean) => void;
}

const CompanyMetrics = ({ formState, setFormState, onValidityChange }: CompanyMetricsProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState?.foundingYear?.trim()) newErrors.foundingYear = "L'année de création est requise";
    if (!formState?.employeeCount) newErrors.employeeCount = "Le nombre de collaborateurs est requis";
    if (!formState?.hasFunding) newErrors.hasFunding = "La réponse est requise";
    if (formState?.hasFunding === "Oui" && !formState?.fundingDetails?.trim()) {
      newErrors.fundingDetails = "Le montant est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validate();
    onValidityChange(isValid);
  }, [formState]);

  const handleChange = (field: string, value: string) => {
    setFormState((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations complémentaires</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="foundingYear">
            Quelle est l'année de création de votre société ? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="foundingYear"
            value={formState?.foundingYear || ""}
            onChange={(e) => handleChange("foundingYear", e.target.value)}
          />
          {errors.foundingYear && <span className="text-sm text-red-500">{errors.foundingYear}</span>}
        </div>

        <div className="space-y-3">
          <Label>
            Quel est le nombre de collaborateurs de votre structure ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formState?.employeeCount || ""}
            onValueChange={(value) => handleChange("employeeCount", value)}
          >
            <div className="grid gap-3">
              {EMPLOYEE_COUNTS.map((count) => (
                <div key={count} className="flex items-center space-x-2">
                  <RadioGroupItem value={count} id={`count-${count}`} />
                  <Label htmlFor={`count-${count}`}>{count}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {errors.employeeCount && <span className="text-sm text-red-500">{errors.employeeCount}</span>}
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>
              Avez-vous déjà levé des fonds ? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formState?.hasFunding || ""}
              onValueChange={(value) => handleChange("hasFunding", value)}
            >
              <div className="grid gap-3">
                {FUNDING_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`funding-${option}`} />
                    <Label htmlFor={`funding-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.hasFunding && <span className="text-sm text-red-500">{errors.hasFunding}</span>}
          </div>

          {formState?.hasFunding === "Oui" && (
            <div className="space-y-2">
              <Label htmlFor="fundingDetails">
                Si oui, pour quel montant ? <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fundingDetails"
                placeholder="Ex: Seed 500k€, Série A 2M€..."
                value={formState?.fundingDetails || ""}
                onChange={(e) => handleChange("fundingDetails", e.target.value)}
              />
              {errors.fundingDetails && <span className="text-sm text-red-500">{errors.fundingDetails}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyMetrics;
