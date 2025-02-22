
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EMPLOYEE_COUNTS, FUNDING_OPTIONS } from './index';

interface CompanyMetricsProps {
  form: Record<string, any>;
  updateForm: (field: string, value: any) => void;
}

const CompanyMetrics = ({ form, updateForm }: CompanyMetricsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations complémentaires</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="foundingYear">Quelle est l'année de création de votre société ?</Label>
          <Input
            id="foundingYear"
            value={form.foundingYear}
            onChange={(e) => updateForm("foundingYear", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Quel est le nombre de collaborateurs de votre structure ?</Label>
          <RadioGroup
            value={form.employeeCount}
            onValueChange={(value) => updateForm("employeeCount", value)}
          >
            <div className="grid gap-3">
              {EMPLOYEE_COUNTS.map((count) => (
                <div key={count} className="flex items-center space-x-2">
                  <RadioGroupItem value={count} id={`count-${count}`} />
                  <Label htmlFor={`count-${count}`}>{count}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Avez-vous déjà levé des fonds ?</Label>
            <RadioGroup
              value={form.hasFunding}
              onValueChange={(value) => updateForm("hasFunding", value)}
            >
              <div className="grid gap-3">
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

export default CompanyMetrics;
