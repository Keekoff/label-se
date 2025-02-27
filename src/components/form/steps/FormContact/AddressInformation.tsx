
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressInformationProps {
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
  onValidityChange: (isValid: boolean) => void;
  readOnly?: boolean;
}

const AddressInformation = ({ formState, setFormState, onValidityChange, readOnly = false }: AddressInformationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState?.streetAddress?.trim()) newErrors.streetAddress = "L'adresse est requise";
    if (!formState?.postalCode?.trim()) newErrors.postalCode = "Le code postal est requis";
    if (!formState?.city?.trim()) newErrors.city = "La ville est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validate();
    onValidityChange(isValid);
  }, [formState]);

  const handleChange = (field: string, value: string) => {
    if (readOnly) return;
    
    setFormState((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }));
  };

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
            value={formState?.streetAddress || ""}
            onChange={(e) => handleChange("streetAddress", e.target.value)}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
          />
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">
              Le code postal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="postalCode"
              value={formState?.postalCode || ""}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className={readOnly ? "bg-gray-100" : ""}
              readOnly={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              La ville ? <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              value={formState?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              className={readOnly ? "bg-gray-100" : ""}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
