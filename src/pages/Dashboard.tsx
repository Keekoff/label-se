import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
const Dashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    const getFirstName = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session?.user) {
        const {
          data
        } = await supabase.from('eligibility_submissions').select('first_name').eq('user_id', session.user.id).single();
        if (data?.first_name) {
          setFirstName(data.first_name);
        }
      }
    };
    getFirstName();
  }, []);
  return <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue, {firstName}</h1>
        <p className="text-gray-500 mt-2">
          Voici un aperçu de votre activité récente
        </p>
      </div>

      <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
        <CardContent className="p-6 bg-green-500 hover:bg-green-400 rounded-xl bg-[35DA56]">
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
            <Button onClick={() => navigate("/dashboard/form")} className="mt-4 bg-[27017F] bg-[#270181]">
              Remplir le questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Dashboard;