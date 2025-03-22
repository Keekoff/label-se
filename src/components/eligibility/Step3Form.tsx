
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/eligibility";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Step3FormProps {
  initialData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const roles = [
  "CEO",
  "Co-fondateur",
  "Directeur Général",
  "C-level/Direction",
  "Manager",
  "Junior / Alternant / Stagiaire",
  "Investisseur/Membre du board",
  "Autre",
];

const responsibilities = [
  "RSE",
  "Marketing",
  "Communication",
  "Sales",
  "Opérations",
  "Tech",
  "Ressources Humaines",
  "Finance / Comptabilité",
  "Achats / Moyens Généraux",
  "Office Manager",
  "Legal",
  "Autre",
];

const motivations = [
  "Améliorer l'image de marque de l'entreprise",
  "Gagner des parts de marché",
  "Répondre à des appels d'offre",
  "S'aligner à la concurrence",
  "Recruter et fidéliser les collaborateurs",
  "Aligner business et convictions personnelles",
];

const implementedActions = [
  "Des actions perfectibles",
  "Une feuille de route d'actions concrètes",
  "Nous avons déjà mesuré les résultats de nos actions",
];

const certificationStatuses = [
  "Oui",
  "C'est en cours",
  "Non",
];

// Make.com webhook URL
const WEBHOOK_URL = "https://hook.eu1.make.com/1qdieciiwpnag26wl2ewme593sud371o";

const Step3Form = ({ initialData, onSubmit, onBack }: Step3FormProps) => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [formData, setFormData] = useState({
    roles: initialData.roles,
    responsibilities: initialData.responsibilities,
    motivations: initialData.motivations,
    implementedActions: initialData.implementedActions,
    certificationStatus: initialData.certificationStatus,
    email: initialData.email,
    phone: initialData.phone,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer l'email de l'utilisateur connecté
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
          // Mettre à jour l'état du formulaire avec l'email de l'utilisateur
          setFormData(prev => ({
            ...prev,
            email: session.user.email
          }));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'email utilisateur:", error);
      }
    };

    fetchUserEmail();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.roles.length === 0) newErrors.roles = "Veuillez sélectionner au moins un rôle";
    if (formData.responsibilities.length === 0) newErrors.responsibilities = "Veuillez sélectionner au moins une responsabilité";
    if (formData.motivations.length === 0) newErrors.motivations = "Veuillez sélectionner au moins une motivation";
    if (formData.implementedActions.length === 0) newErrors.implementedActions = "Ce champ est requis";
    if (!formData.certificationStatus) newErrors.certificationStatus = "Ce champ est requis";
    if (!formData.email) newErrors.email = "Ce champ est requis";
    if (!validateEmail(formData.email)) newErrors.email = "Email invalide";
    if (!formData.phone) newErrors.phone = "Ce champ est requis";
    if (!validatePhone(formData.phone)) newErrors.phone = "Numéro de téléphone invalide";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone);
  };

  const sendToWebhook = async (completeData: FormData) => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });
      
      if (!response.ok) {
        console.error('Erreur lors de l\'envoi au webhook:', response.status);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      console.log('Données envoyées avec succès au webhook Make.com');
    } catch (error) {
      console.error('Erreur lors de l\'envoi au webhook:', error);
      // We don't show this error to the user as we want the form submission to continue
      // even if the webhook call fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Combine all form data (from all steps)
      const completeData: FormData = {
        ...initialData,
        ...formData
      };
      
      // Send data to webhook
      await sendToWebhook(completeData);
      
      // Continue with normal form submission
      onSubmit(formData);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Étape 3 : Rôle et motivations
      </h2>

      <div className="space-y-6">
        <div>
          <Label>
            Quel est votre rôle dans la structure ? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {roles.map((role) => (
              <div key={role} className="flex items-start space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={formData.roles.includes(role)}
                  onCheckedChange={() => setFormData(prev => ({
                    ...prev,
                    roles: toggleArrayItem(prev.roles, role)
                  }))}
                />
                <Label htmlFor={`role-${role}`} className="text-sm">
                  {role}
                </Label>
              </div>
            ))}
          </div>
          {errors.roles && (
            <span className="text-sm text-red-500">{errors.roles}</span>
          )}
        </div>

        <div>
          <Label>
            De quel(s) sujet(s) êtes-vous en charge ? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {responsibilities.map((resp) => (
              <div key={resp} className="flex items-start space-x-2">
                <Checkbox
                  id={`resp-${resp}`}
                  checked={formData.responsibilities.includes(resp)}
                  onCheckedChange={() => setFormData(prev => ({
                    ...prev,
                    responsibilities: toggleArrayItem(prev.responsibilities, resp)
                  }))}
                />
                <Label htmlFor={`resp-${resp}`} className="text-sm">
                  {resp}
                </Label>
              </div>
            ))}
          </div>
          {errors.responsibilities && (
            <span className="text-sm text-red-500">{errors.responsibilities}</span>
          )}
        </div>

        <div>
          <Label>
            Motivations à intégrer une démarche de maîtrise d'impact <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-2 mt-2">
            {motivations.map((motivation) => (
              <div key={motivation} className="flex items-start space-x-2">
                <Checkbox
                  id={`motivation-${motivation}`}
                  checked={formData.motivations.includes(motivation)}
                  onCheckedChange={() => setFormData(prev => ({
                    ...prev,
                    motivations: toggleArrayItem(prev.motivations, motivation)
                  }))}
                />
                <Label htmlFor={`motivation-${motivation}`} className="text-sm">
                  {motivation}
                </Label>
              </div>
            ))}
          </div>
          {errors.motivations && (
            <span className="text-sm text-red-500">{errors.motivations}</span>
          )}
        </div>

        <div>
          <Label>
            Qu'avez-vous déjà mis en œuvre ? <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-2 mt-2">
            {implementedActions.map((action) => (
              <div key={action} className="flex items-start space-x-2">
                <Checkbox
                  id={`action-${action}`}
                  checked={formData.implementedActions.includes(action)}
                  onCheckedChange={() => setFormData(prev => ({
                    ...prev,
                    implementedActions: toggleArrayItem(prev.implementedActions, action)
                  }))}
                />
                <Label htmlFor={`action-${action}`} className="text-sm">
                  {action}
                </Label>
              </div>
            ))}
          </div>
          {errors.implementedActions && (
            <span className="text-sm text-red-500">{errors.implementedActions}</span>
          )}
        </div>

        <div>
          <Label>
            Avez-vous lancé une autre procédure de certification ? <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500 mt-1">Label RSE : B Corp, EcoVadis, Lucie 26 000…</p>
          <RadioGroup
            value={formData.certificationStatus}
            onValueChange={(value) => setFormData(prev => ({ ...prev, certificationStatus: value }))}
            className="mt-2"
          >
            {certificationStatuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <RadioGroupItem value={status} id={`certification-${status}`} />
                <Label htmlFor={`certification-${status}`}>{status}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.certificationStatus && (
            <span className="text-sm text-red-500">{errors.certificationStatus}</span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">
              Votre email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail || formData.email}
              readOnly
              className="mt-1 bg-gray-100 cursor-not-allowed"
              aria-label="Votre email (non modifiable)"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>

          <div>
            <Label htmlFor="phone">
              Votre numéro de téléphone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1"
              placeholder="Ex: 06 12 34 56 78"
            />
            {errors.phone && (
              <span className="text-sm text-red-500">{errors.phone}</span>
            )}
          </div>
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
        <Button 
          type="submit" 
          className="bg-[#35DA56] hover:bg-[#35DA56]/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </Button>
      </div>
    </form>
  );
};

export default Step3Form;
