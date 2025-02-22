
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInformationProps {
  form: Record<string, any>;
  updateForm: (field: string, value: any) => void;
}

const BasicInformation = ({ form, updateForm }: BasicInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de contact</h3>
      
      <div className="space-y-4">
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
    </div>
  );
};

export default BasicInformation;
