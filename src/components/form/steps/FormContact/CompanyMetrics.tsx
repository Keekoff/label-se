
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EMPLOYEE_COUNTS, FUNDING_OPTIONS } from './constants';

interface CompanyMetricsProps {
  form: Record<string, any>;
  updateForm: (field: string, value: any) => void;
  onValidityChange: (isValid: boolean) => void;
}

const CompanyMetrics = ({ form, updateForm, onValidityChange }: CompanyMetricsProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form?.foundingYear?.trim()) newErrors.foundingYear = "L'année de création est requise";
    if (!form?.employeeCount) newErrors.employeeCount = "Le nombre de collaborateurs est requis";
    if (!form?.hasFunding) newErrors.hasFunding = "La réponse est requise";
    if (form?.hasFunding === "Oui" && !form?.fundingDetails?.trim()) {
      newErrors.fundingDetails = "Le montant est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validate();
    onValidityChange(isValid);
  }, [form]);

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
            value={form?.foundingYear || ""}
            onChange={(e) => updateForm("foundingYear", e.target.value)}
          />
          {errors.foundingYear && <span className="text-sm text-red-500">{errors.foundingYear}</span>}
        </div>

        <div className="space-y-3">
          <Label>
            Quel est le nombre de collaborateurs de votre structure ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={form?.employeeCount || ""}
            onValueChange={(value) => updateForm("employeeCount", value)}
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
              value={form?.hasFunding || ""}
              onValueChange={(value) => updateForm("hasFunding", value)}
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

          {form?.hasFunding === "Oui" && (
            <div className="space-y-2">
              <Label htmlFor="fundingDetails">
                Si oui, pour quel montant ? <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fundingDetails"
                placeholder="Ex: Seed 500k€, Série A 2M€..."
                value={form?.fundingDetails || ""}
                onChange={(e) => updateForm("fundingDetails", e.target.value)}
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
