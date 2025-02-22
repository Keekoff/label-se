
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressInformationProps {
  form: Record<string, any>;
  updateForm: (field: string, value: any) => void;
}

const AddressInformation = ({ form, updateForm }: AddressInformationProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Adresse</h3>
      
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

        <div className="grid gap-4">
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
    </div>
  );
};

export default AddressInformation;
