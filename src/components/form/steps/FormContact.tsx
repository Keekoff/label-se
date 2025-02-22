import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface FormContactProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const SECTORS = [
  "Food", "Agro-alimentaire", "Mode/Beauté", "Luxe", "Industrie", "Santé/Pharma",
  "Banque/Assurance", "Environnement", "Social", "ESS", "Data & IT", "E-commerce",
  "Legal", "Finance", "Marketing", "Ressources Humaines", "Agence", "Cabinet de conseil",
  "Autre"
];

const LEGAL_FORMS = ["SAS", "SASU", "SA", "SARL", "EURL", "Autre"];
const EMPLOYEE_COUNTS = ["0-10", "10-49", "50-99", "100 et plus"];
const FUNDING_OPTIONS = ["Oui", "Non", "Je ne souhaite pas partager cette information"];

const FormContact = ({ onValidityChange, formState, setFormState }: FormContactProps) => {
  const [form, setForm] = useState({
    firstName: formState.firstName || "",
    email: formState.email || "",
    companyName: formState.companyName || "",
    sectors: formState.sectors || [],
    legalForm: formState.legalForm || "",
    streetAddress: formState.streetAddress || "",
    postalCode: formState.postalCode || "",
    city: formState.city || "",
    foundingYear: formState.foundingYear || "",
    employeeCount: formState.employeeCount || "",
    hasFunding: formState.hasFunding || "",
    fundingDetails: formState.fundingDetails || ""
  });

  const updateForm = (field: string, value: any) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    setFormState({ ...formState, ...newForm });
    validateForm(newForm);
  };

  const validateForm = (data: typeof form) => {
    const requiredFields = [
      'firstName', 'email', 'companyName', 'legalForm',
      'streetAddress', 'postalCode', 'city', 'employeeCount', 'hasFunding'
    ];
    
    const isValid = requiredFields.every(field => data[field]?.toString().trim() !== "") &&
                   data.sectors.length > 0;
    
    onValidityChange(isValid);
  };

  useEffect(() => {
    validateForm(form);
  }, []);

  const toggleSector = (sector: string) => {
    const newSectors = form.sectors.includes(sector)
      ? form.sectors.filter(s => s !== sector)
      : [...form.sectors, sector];
    updateForm('sectors', newSectors);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Contact et Entreprise</h2>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Quel est votre prénom ?</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => updateForm("firstName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Votre e-mail de contact</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Quel est le nom de votre société ?</Label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => updateForm("companyName", e.target.value)}
          />
        </div>

        {/* Sectors */}
        <div className="space-y-4">
          <Label>Quel est le secteur d'activité de l'entreprise ?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SECTORS.map((sector) => (
              <div key={sector} className="flex items-center space-x-2">
                <Checkbox
                  id={`sector-${sector}`}
                  checked={form.sectors.includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                />
                <Label htmlFor={`sector-${sector}`} className="text-sm">
                  {sector}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Form */}
        <div className="space-y-2">
          <Label>Quelle est la forme juridique de votre structure ?</Label>
          <RadioGroup
            value={form.legalForm}
            onValueChange={(value) => updateForm("legalForm", value)}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {LEGAL_FORMS.map((form) => (
                <div key={form} className="flex items-center space-x-2">
                  <RadioGroupItem value={form} id={`legal-${form}`} />
                  <Label htmlFor={`legal-${form}`}>{form}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Quelle est l'adresse du siège social ?</Label>
            <Input
              id="streetAddress"
              placeholder="Numéro et nom de rue"
              value={form.streetAddress}
              onChange={(e) => updateForm("streetAddress", e.target.value)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Le code postal</Label>
              <Input
                id="postalCode"
                value={form.postalCode}
                onChange={(e) => updateForm("postalCode", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">La ville ?</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="foundingYear">Quelle est l'année de création de votre société ?</Label>
          <Input
            id="foundingYear"
            value={form.foundingYear}
            onChange={(e) => updateForm("foundingYear", e.target.value)}
          />
        </div>

        {/* Employee Count */}
        <div className="space-y-2">
          <Label>Quel est le nombre de collaborateurs de votre structure ?</Label>
          <RadioGroup
            value={form.employeeCount}
            onValueChange={(value) => updateForm("employeeCount", value)}
          >
            <div className="grid grid-cols-2 gap-4">
              {EMPLOYEE_COUNTS.map((count) => (
                <div key={count} className="flex items-center space-x-2">
                  <RadioGroupItem value={count} id={`count-${count}`} />
                  <Label htmlFor={`count-${count}`}>{count}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Funding */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Avez-vous déjà levé des fonds ?</Label>
            <RadioGroup
              value={form.hasFunding}
              onValueChange={(value) => updateForm("hasFunding", value)}
            >
              <div className="space-y-2">
                {FUNDING_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`funding-${option}`} />
                    <Label htmlFor={`funding-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {form.hasFunding === "Oui" && (
            <div className="space-y-2">
              <Label htmlFor="fundingDetails">Si oui, pour quel montant ?</Label>
              <Input
                id="fundingDetails"
                placeholder="Ex: Seed 500k€, Série A 2M€..."
                value={form.fundingDetails}
                onChange={(e) => updateForm("fundingDetails", e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Vous pouvez mentionner si vous avez levé en Seed, Série A, B, C... ou une fourchette.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormContact;
