
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface FormContactProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const FormContact = ({ onValidityChange, formState, setFormState }: FormContactProps) => {
  const [form, setForm] = useState({
    firstName: formState.firstName || "",
    lastName: formState.lastName || "",
    email: formState.email || "",
    phone: formState.phone || "",
    company: formState.company || "",
  });

  const updateForm = (field: string, value: string) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    setFormState({ ...formState, ...newForm });
    validateForm(newForm);
  };

  const validateForm = (data: typeof form) => {
    const isValid = Object.values(data).every(value => value.trim() !== "");
    onValidityChange(isValid);
  };

  useEffect(() => {
    validateForm(form);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Contact et Entreprise</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => updateForm("firstName", e.target.value)}
            placeholder="Jean"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => updateForm("lastName", e.target.value)}
            placeholder="Dupont"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateForm("email", e.target.value)}
            placeholder="jean.dupont@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Entreprise</Label>
        <Input
          id="company"
          value={form.company}
          onChange={(e) => updateForm("company", e.target.value)}
          placeholder="Nom de votre entreprise"
        />
      </div>
    </div>
  );
};

export default FormContact;
