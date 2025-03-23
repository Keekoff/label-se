
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FormDisclaimerProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const FormDisclaimer = ({ onValidityChange, formState, setFormState }: FormDisclaimerProps) => {
  const [accepted, setAccepted] = useState(formState.disclaimerAccepted || false);

  const handleAccept = (value: boolean) => {
    setAccepted(value);
    setFormState({ ...formState, disclaimerAccepted: value });
    onValidityChange(value);
  };

  useEffect(() => {
    onValidityChange(accepted);
  }, [accepted, onValidityChange]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Mentions légales</h2>
      
      <Card className="p-6 space-y-4 bg-white/90 backdrop-blur-sm border border-[#27017F]/10 shadow-sm">
        <p className="text-sm leading-relaxed">
          Avant toute chose, voici les informations légales concernant les données que nous collectons pour l'étude de votre candidature en vue de l'obtention du label :
        </p>
        
        <div className="space-y-2">
          <p className="text-sm">
            Les informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé par KeekOff pour l'obtention du label Startup Engagée.
          </p>
          <p className="text-sm font-medium">Base légale du traitement : Consentement.</p>
          <p className="text-sm">Destinataire : KeekOff SAS.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Engagements :</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Confidentialité des données (non partagées avec des tiers)</li>
            <li>Anonymisation des données</li>
            <li>Droits d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Contact pour exercer vos droits :</h3>
          <p className="text-sm">📧 contact@keekoff.fr</p>
          <p className="text-sm">📬 KeekOff (Label Startup Engagée), 129 rue Lamarck 75018 Paris</p>
        </div>
      </Card>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={() => handleAccept(false)}
          className={!accepted ? "border-red-500 text-red-500" : "hover:bg-[#27017F] hover:text-white"}
        >
          Je n'accepte pas
        </Button>
        <Button
          onClick={() => handleAccept(true)}
          className={accepted ? "bg-[#35DA56] hover:bg-[#35DA56]/90" : "hover:bg-[#27017F]"}
        >
          J'accepte
        </Button>
      </div>
    </div>
  );
};

export default FormDisclaimer;
