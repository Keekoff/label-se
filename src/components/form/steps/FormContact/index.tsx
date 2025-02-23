import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface FormContactProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}
export const SECTORS = ["Food", "Agro-alimentaire", "Mode/Beauté", "Luxe", "Industrie", "Santé/Pharma", "Banque/Assurance", "Environnement", "Social", "ESS", "Data & IT", "E-commerce", "Legal", "Finance", "Marketing", "Ressources Humaines", "Agence", "Cabinet de conseil", "Autre"];
export const LEGAL_FORMS = ["SAS", "SASU", "SA", "SARL", "EURL", "Autre"];
export const EMPLOYEE_COUNTS = ["0-10", "10-49", "50-99", "100 et plus"];
export const FUNDING_OPTIONS = ["Oui", "Non", "Je ne souhaite pas partager cette information"];
const FormContact = ({
  onValidityChange,
  formState,
  setFormState
}: FormContactProps) => {
  const [form, setForm] = useState({
    firstName: formState.firstName || "",
    email: formState.email || "",
    companyName: formState.companyName || "",
    sectors: Array.isArray(formState.sectors) ? formState.sectors : [],
    legalForm: formState.legalForm || "",
    streetAddress: formState.streetAddress || "",
    postalCode: formState.postalCode || "",
    city: formState.city || "",
    foundingYear: formState.foundingYear || "",
    employeeCount: formState.employeeCount || "",
    hasFunding: formState.hasFunding || "",
    fundingDetails: formState.fundingDetails || ""
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const updateForm = (field: string, value: any) => {
    const newForm = {
      ...form,
      [field]: value
    };
    setForm(newForm);
    setFormState({
      ...formState,
      ...newForm
    });
    validateForm(newForm);
  };
  const toggleSector = (sector: string) => {
    const newSectors = form.sectors.includes(sector) ? form.sectors.filter(s => s !== sector) : [...form.sectors, sector];
    updateForm('sectors', newSectors);
  };
  const validateForm = (data: typeof form) => {
    const requiredFields = ['firstName', 'email', 'companyName', 'legalForm', 'streetAddress', 'postalCode', 'city', 'employeeCount', 'hasFunding'];
    const isValid = requiredFields.every(field => data[field]?.toString().trim() !== "") && data.sectors.length > 0;
    onValidityChange(isValid);
  };
  useEffect(() => {
    validateForm(form);
  }, []);
  const filteredSectors = SECTORS.filter(sector => sector.toLowerCase().includes(search.toLowerCase()));
  return <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-8">Contact et Entreprise</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Quel est votre prénom ?</Label>
              <Input id="firstName" value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Votre e-mail de contact</Label>
              <Input id="email" type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Quel est le nom de votre société ?</Label>
              <Input id="companyName" value={form.companyName} onChange={e => updateForm("companyName", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Quel est le secteur d'activité de l'entreprise ?</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {form.sectors.length > 0 ? `${form.sectors.length} secteur${form.sectors.length > 1 ? 's' : ''} sélectionné${form.sectors.length > 1 ? 's' : ''}` : "Sélectionner des secteurs"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-[--radix-popover-trigger-width]">
                  <div className="border-b px-3 py-2">
                    <Input placeholder="Rechercher un secteur..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="max-h-[300px] overflow-auto p-1">
                    {filteredSectors.length === 0 ? <div className="text-sm text-center py-6 text-muted-foreground">
                        Aucun secteur trouvé.
                      </div> : filteredSectors.map(sector => <div key={sector} className={cn("flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer", "hover:bg-accent hover:text-accent-foreground", form.sectors.includes(sector) && "bg-accent")} onClick={() => toggleSector(sector)}>
                          <div className={cn("flex h-4 w-4 items-center justify-center rounded-sm border border-primary", form.sectors.includes(sector) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                            <Check className={cn("h-4 w-4", form.sectors.includes(sector) ? "opacity-100" : "opacity-0")} />
                          </div>
                          {sector}
                        </div>)}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Quelle est la forme juridique de votre structure ?</Label>
              <Select value={form.legalForm} onValueChange={value => updateForm("legalForm", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une forme juridique" />
                </SelectTrigger>
                <SelectContent>
                  {LEGAL_FORMS.map(form => <SelectItem key={form} value={form}>
                      {form}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Quelle est l'adresse du siège social ?</Label>
              <Input id="streetAddress" placeholder="Numéro et nom de rue" value={form.streetAddress} onChange={e => updateForm("streetAddress", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input id="postalCode" value={form.postalCode} onChange={e => updateForm("postalCode", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" value={form.city} onChange={e => updateForm("city", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundingYear">Quelle est l'année de création de votre société ?</Label>
              <Input id="foundingYear" value={form.foundingYear} onChange={e => updateForm("foundingYear", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Quel est le nombre de collaborateurs de votre structure ?</Label>
              <Select value={form.employeeCount} onValueChange={value => updateForm("employeeCount", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le nombre de collaborateurs" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_COUNTS.map(count => <SelectItem key={count} value={count}>
                      {count}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Avez-vous déjà levé des fonds ?</Label>
                <Select value={form.hasFunding} onValueChange={value => updateForm("hasFunding", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une réponse" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUNDING_OPTIONS.map(option => <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {form.hasFunding === "Oui" && <div className="space-y-2">
                  <Label htmlFor="fundingDetails">Si oui, pour quel montant ?</Label>
                  <Input id="fundingDetails" placeholder="Ex: Seed 500k€, Série A 2M€..." value={form.fundingDetails} onChange={e => updateForm("fundingDetails", e.target.value)} />
                  <p className="text-sm text-gray-500 mt-1">
                    Vous pouvez mentionner si vous avez levé en Seed, Série A, B, C... ou une fourchette.
                  </p>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default FormContact;