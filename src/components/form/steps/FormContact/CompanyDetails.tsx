
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SECTORS, LEGAL_FORMS } from './constants';

interface CompanyDetailsProps {
  form: Record<string, any>;
  updateForm: (field: string, value: any) => void;
  onValidityChange: (isValid: boolean) => void;
}

const CompanyDetails = ({ form, updateForm, onValidityChange }: CompanyDetailsProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form?.companyName?.trim()) newErrors.companyName = "Le nom de la société est requis";
    if (!form?.sectors?.length) newErrors.sectors = "Au moins un secteur est requis";
    if (!form?.legalForm) newErrors.legalForm = "La forme juridique est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validate();
    onValidityChange(isValid);
  }, [form]);

  const toggleSector = (sector: string) => {
    const currentSectors = form?.sectors || [];
    const newSectors = currentSectors.includes(sector)
      ? currentSectors.filter((s: string) => s !== sector)
      : [...currentSectors, sector];
    updateForm('sectors', newSectors);
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
            value={form?.companyName || ""}
            onChange={(e) => updateForm("companyName", e.target.value)}
          />
          {errors.companyName && <span className="text-sm text-red-500">{errors.companyName}</span>}
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
                  checked={(form?.sectors || []).includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                />
                <Label htmlFor={`sector-${sector}`} className="text-sm">
                  {sector}
                </Label>
              </div>
            ))}
          </div>
          {errors.sectors && <span className="text-sm text-red-500">{errors.sectors}</span>}
        </div>

        <div className="space-y-3">
          <Label>
            Quelle est la forme juridique de votre structure ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={form?.legalForm || ""}
            onValueChange={(value) => updateForm("legalForm", value)}
          >
            <div className="grid grid-cols-2 gap-3">
              {LEGAL_FORMS.map((formType) => (
                <div key={formType} className="flex items-center space-x-2">
                  <RadioGroupItem value={formType} id={`legal-${formType}`} />
                  <Label htmlFor={`legal-${formType}`}>{formType}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {errors.legalForm && <span className="text-sm text-red-500">{errors.legalForm}</span>}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
