
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/eligibility";
import { ArrowLeft } from "lucide-react";

interface Step2FormProps {
  initialData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const sectors = [
  "Tech, digital & logiciels",
  "Conseil, audit & services aux entreprises",
  "Agroalimentaire & grande consommation",
  "Banque, assurance & fintech",
  "Développement durable, énergie & environnement",
  "Événementiel, culture & médias",
  "Immobilier, construction & aménagement",
  "Industrie & fabrication",
  "Logistique, supply chain & transport",
  "Mode, luxe & beauté",
  "Retail, e-commerce & distribution",
  "Santé, pharmaceutique & bien-être",
  "Automobile, mobilité & aéronautique",
  "Service public, éducation & collectivités",
  "Télécom & infrastructures",
  "Tourisme, hôtellerie & loisirs",
  "Autre (merci de préciser)",
];

const growthStages = [
  "Amorçage",
  "Early stage",
  "Pre-seed",
  "Seed",
  "Late stage",
];

const employeeCounts = [
  "0-10",
  "10-49",
  "50-99",
  "100 et plus",
];

const Step2Form = ({ initialData, onSubmit, onBack }: Step2FormProps) => {
  const [formData, setFormData] = useState({
    sectors: initialData.sectors,
    customSector: initialData.customSector,
    growthStage: initialData.growthStage,
    employeeCount: initialData.employeeCount,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.sectors.length === 0) newErrors.sectors = "Veuillez sélectionner au moins un secteur";
    if (formData.sectors.includes("Autre (merci de préciser)") && !formData.customSector.trim()) {
      newErrors.customSector = "Veuillez préciser votre secteur d'activité";
    }
    if (!formData.growthStage) newErrors.growthStage = "Ce champ est requis";
    if (!formData.employeeCount) newErrors.employeeCount = "Ce champ est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const toggleSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Étape 2 : Profil de l'entreprise
      </h2>

      <div className="space-y-6">
        <div>
          <Label>
            Quel est le secteur d'activité de l'entreprise ? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {sectors.map((sector) => (
              <div key={sector} className="flex items-start space-x-2">
                <Checkbox
                  id={`sector-${sector}`}
                  checked={formData.sectors.includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                />
                <Label 
                  htmlFor={`sector-${sector}`} 
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {sector}
                </Label>
              </div>
            ))}
          </div>
          
          {formData.sectors.includes("Autre (merci de préciser)") && (
            <div className="mt-4">
              <Label htmlFor="customSector">
                Précisez votre secteur d'activité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customSector"
                value={formData.customSector}
                onChange={(e) => setFormData(prev => ({ ...prev, customSector: e.target.value }))}
                className="mt-1"
                placeholder="Entrez votre secteur d'activité"
              />
              {errors.customSector && (
                <span className="text-sm text-red-500">{errors.customSector}</span>
              )}
            </div>
          )}
          
          {errors.sectors && (
            <span className="text-sm text-red-500">{errors.sectors}</span>
          )}
        </div>

        <div>
          <Label>
            Quel est le niveau de croissance de votre startup ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.growthStage}
            onValueChange={(value) => setFormData(prev => ({ ...prev, growthStage: value }))}
            className="mt-2"
          >
            {growthStages.map((stage) => (
              <div key={stage} className="flex items-center space-x-2">
                <RadioGroupItem value={stage} id={`growth-${stage}`} />
                <Label htmlFor={`growth-${stage}`}>{stage}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.growthStage && (
            <span className="text-sm text-red-500">{errors.growthStage}</span>
          )}
        </div>

        <div>
          <Label>
            Quel est le nombre de collaborateurs dans votre structure ? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.employeeCount}
            onValueChange={(value) => setFormData(prev => ({ ...prev, employeeCount: value }))}
            className="mt-2"
          >
            {employeeCounts.map((count) => (
              <div key={count} className="flex items-center space-x-2">
                <RadioGroupItem value={count} id={`employee-${count}`} />
                <Label htmlFor={`employee-${count}`}>{count}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.employeeCount && (
            <span className="text-sm text-red-500">{errors.employeeCount}</span>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Suivant
        </Button>
      </div>
    </form>
  );
};

export default Step2Form;
