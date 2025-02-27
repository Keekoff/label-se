
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BasicInformationProps {
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
  onValidityChange: (isValid: boolean) => void;
  readOnly?: boolean;
}

const BasicInformation = ({ formState, setFormState, onValidityChange, readOnly = false }: BasicInformationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.firstName?.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formState.lastName?.trim()) newErrors.lastName = "Le nom est requis";
    if (!formState.email?.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formState.email)) newErrors.email = "L'email n'est pas valide";
    if (!formState.phone?.trim()) newErrors.phone = "Le téléphone est requis";

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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations de contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Prénom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={formState.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Nom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={formState.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formState.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Téléphone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formState.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
