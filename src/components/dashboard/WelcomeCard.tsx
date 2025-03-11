
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const WelcomeCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden bg-white border border-[#27017F]/10 rounded-xl shadow-lg">
      <div className="p-6 bg-gradient-to-r from-[#27017F]/5 to-[#27017F]/10 backdrop-blur-sm">
        <div className="space-y-4">
          <h2 className="text-xl text-[#27017F] font-bold">Label Startup Engagée</h2>
          
          <p className="text-[#27017F] font-medium">
            Félicitations 🎉 Vous êtes éligible pour poursuivre le processus de labellisation !
          </p>
          
          <p className="text-[#27017F]/80">
            Ce questionnaire va nous permettre de vous attribuer le label Startup Engagée à l'échelon 1, 2 ou 3 selon votre maturité sur les sujets RSE.
          </p>
          
          <div className="space-y-1">
            <p className="text-[#27017F]/80">
              Vous disposez de 30 jours pour compléter le questionnaire.
            </p>
            <p className="text-[#27017F]/80">
              Nous restons disponibles si besoin !
            </p>
          </div>

          <div className="pt-2">
            <Button 
              onClick={() => navigate("/dashboard/form")} 
              className="bg-[#35DA56] text-white hover:bg-[#35DA56]/90 transition-all duration-300"
            >
              Remplir le questionnaire
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
