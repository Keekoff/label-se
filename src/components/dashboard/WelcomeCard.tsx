
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const WelcomeCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
      <CardContent className="p-6 rounded-xl bg-[8985FF] bg-[#8a86ff]">
        <div className="space-y-4">
          <h2 className="text-xl text-primary font-extrabold">Label Startup Engagée</h2>
          <p className="text-base font-semibold">
            Félicitations 🎉 Vous êtes éligible pour poursuivre le processus de labellisation !
          </p>
          <p className="text-sm text-gray-950">
            Ce questionnaire va nous permettre de vous attribuer le label Startup Engagée à l'échelon 1, 2 ou 3 selon votre maturité sur les sujets RSE.
          </p>
          <p className="text-sm text-slate-950">
            Vous disposez de 30 jours pour compléter le questionnaire.<br />
            Nous restons disponibles si besoin !
          </p>
          <Button onClick={() => navigate("/dashboard/form")} className="mt-4 text-slate-50 bg-[27017F] bg-[#27017e]">
            Remplir le questionnaire
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
