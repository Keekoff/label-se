
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SECTORS, LEGAL_FORMS } from './constants';

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
    if (!formState?.sectors?.length) newErrors.sectors = "Au moins un secteur est requis";
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

  const toggleSector = (sector: string) => {
    if (readOnly) return;
    
    const currentSectors = formState?.sectors || [];
    const newSectors = currentSectors.includes(sector)
      ? currentSectors.filter((s: string) => s !== sector)
      : [...currentSectors, sector];
    handleChange('sectors', newSectors);
  };

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

        <div className="space-y-3">
          <Label>
            Quel est le secteur d'activité de l'entreprise ? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {SECTORS.map((sector) => (
              <div key={sector} className="flex items-center space-x-2">
                <Checkbox
                  id={`sector-${sector}`}
                  checked={(formState?.sectors || []).includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                  disabled={readOnly}
                />
                <Label htmlFor={`sector-${sector}`} className="text-sm">
                  {sector}
                </Label>
              </div>
            ))}
          </div>
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
              {LEGAL_FORMS.map((formType) => (
                <div key={formType} className="flex items-center space-x-2">
                  <RadioGroupItem value={formType} id={`legal-${formType}`} disabled={readOnly} />
                  <Label htmlFor={`legal-${formType}`}>{formType}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
