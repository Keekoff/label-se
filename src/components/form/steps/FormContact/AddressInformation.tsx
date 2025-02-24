
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressInformationProps {
  form: Record<string, any>;
  updateForm: (field: string, value: any) => void;
  onValidityChange: (isValid: boolean) => void;
}

const AddressInformation = ({ form, updateForm, onValidityChange }: AddressInformationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form?.streetAddress?.trim()) newErrors.streetAddress = "L'adresse est requise";
    if (!form?.postalCode?.trim()) newErrors.postalCode = "Le code postal est requis";
    if (!form?.city?.trim()) newErrors.city = "La ville est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validate();
    onValidityChange(isValid);
  }, [form]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Adresse</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="streetAddress">
            Quelle est l'adresse du siège social ? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="streetAddress"
            placeholder="Numéro et nom de rue"
            value={form?.streetAddress || ""}
            onChange={(e) => updateForm("streetAddress", e.target.value)}
          />
          {errors.streetAddress && <span className="text-sm text-red-500">{errors.streetAddress}</span>}
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">
              Le code postal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="postalCode"
              value={form?.postalCode || ""}
              onChange={(e) => updateForm("postalCode", e.target.value)}
            />
            {errors.postalCode && <span className="text-sm text-red-500">{errors.postalCode}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              La ville ? <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              value={form?.city || ""}
              onChange={(e) => updateForm("city", e.target.value)}
            />
            {errors.city && <span className="text-sm text-red-500">{errors.city}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
