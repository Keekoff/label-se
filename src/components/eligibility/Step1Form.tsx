
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/eligibility";

interface Step1FormProps {
  initialData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
}

const legalForms = [
  "SAS",
  "SASU",
  "SA",
  "SARL",
  "EURL",
  "Association Loi 1901",
  "EI (auto-entrepreneur, micro-entreprise)",
];

const missionDrivenOptions = [
  { value: "yes", label: "Oui" },
  { value: "no", label: "Non" },
  { value: "unknown", label: "Je ne sais pas" },
];

const Step1Form = ({ initialData, onSubmit }: Step1FormProps) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    companyName: initialData.companyName,
    siret: initialData.siret,
    legalForm: initialData.legalForm,
    isMissionDriven: initialData.isMissionDriven,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = "Ce champ est requis";
    if (!formData.lastName) newErrors.lastName = "Ce champ est requis";
    if (!formData.companyName) newErrors.companyName = "Ce champ est requis";
    if (!formData.siret) {
      newErrors.siret = "Ce champ est requis";
    } else if (!/^\d{14}$/.test(formData.siret)) {
      newErrors.siret = "Le SIRET doit contenir exactement 14 chiffres";
    }
    if (!formData.legalForm) newErrors.legalForm = "Ce champ est requis";
    if (!formData.isMissionDriven) newErrors.isMissionDriven = "Ce champ est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Étape 1 : Informations personnelles et entreprise
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="firstName">
            Quel est votre prénom ? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="mt-1"
          />
          {errors.firstName && (
            <span className="text-sm text-red-500">{errors.firstName}</span>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">
            Quel est votre nom ? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="mt-1"
          />
          {errors.lastName && (
            <span className="text-sm text-red-500">{errors.lastName}</span>
          )}
        </div>

        <div>
          <Label htmlFor="companyName">
            Quel est le nom de votre société ? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            className="mt-1"
          />
          {errors.companyName && (
            <span className="text-sm text-red-500">{errors.companyName}</span>
          )}
        </div>

        <div>
          <Label htmlFor="siret">
            Quel est le numéro SIRET de votre société ? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="siret"
            value={formData.siret}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 14);
              setFormData(prev => ({ ...prev, siret: value }));
            }}
            className="mt-1"
            placeholder="12345678901234"
            maxLength={14}
          />
          <p className="text-sm text-gray-500 mt-1">
            Nous en avons besoin pour vérifier votre éligibilité via le code NAF. Si vous avez un doute, vous pouvez retrouver cette information sur Société.com.
          </p>
          {errors.siret && (
            <span className="text-sm text-red-500">{errors.siret}</span>
          )}
        </div>

        <div>
          <Label>
            Quelle est la forme juridique de votre structure ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.legalForm}
            onValueChange={(value) => setFormData(prev => ({ ...prev, legalForm: value }))}
            className="mt-2"
          >
            {legalForms.map((form) => (
              <div key={form} className="flex items-center space-x-2">
                <RadioGroupItem value={form} id={`legalForm-${form}`} />
                <Label htmlFor={`legalForm-${form}`}>{form}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.legalForm && (
            <span className="text-sm text-red-500">{errors.legalForm}</span>
          )}
        </div>

        <div>
          <Label>
            Êtes-vous entreprise à mission ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.isMissionDriven}
            onValueChange={(value) => setFormData(prev => ({ ...prev, isMissionDriven: value }))}
            className="mt-2"
          >
            {missionDrivenOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`mission-${option.value}`} />
                <Label htmlFor={`mission-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.isMissionDriven && (
            <span className="text-sm text-red-500">{errors.isMissionDriven}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Suivant
        </Button>
      </div>
    </form>
  );
};

export default Step1Form;
