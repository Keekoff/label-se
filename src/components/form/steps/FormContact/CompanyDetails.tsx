
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SECTORS, LEGAL_FORMS } from './index';

interface CompanyDetailsProps {
  form: Record<string, any>;
  updateForm: (field: string, value: any) => void;
}

const CompanyDetails = ({ form, updateForm }: CompanyDetailsProps) => {
  const toggleSector = (sector: string) => {
    const newSectors = form.sectors.includes(sector)
      ? form.sectors.filter((s: string) => s !== sector)
      : [...form.sectors, sector];
    updateForm('sectors', newSectors);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations société</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Quel est le nom de votre société ?</Label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => updateForm("companyName", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Quel est le secteur d'activité de l'entreprise ?</Label>
          <div className="grid grid-cols-1 gap-3">
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

        <div className="space-y-3">
          <Label>Quelle est la forme juridique de votre structure ?</Label>
          <RadioGroup
            value={form.legalForm}
            onValueChange={(value) => updateForm("legalForm", value)}
          >
            <div className="grid grid-cols-2 gap-3">
              {LEGAL_FORMS.map((form) => (
                <div key={form} className="flex items-center space-x-2">
                  <RadioGroupItem value={form} id={`legal-${form}`} />
                  <Label htmlFor={`legal-${form}`}>{form}</Label>
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
