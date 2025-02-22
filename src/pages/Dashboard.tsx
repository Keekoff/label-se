
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EligibilityForm from "./EligibilityForm";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue, Client</h1>
        <p className="text-gray-500 mt-2">
          Voici un aperçu de votre activité récente
        </p>
      </div>

      <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Label Startup Engagée</h2>
            <p className="text-base">
              Félicitations 🎉 Vous êtes éligible pour poursuivre le processus de labellisation !
            </p>
            <p className="text-sm text-gray-600">
              Ce questionnaire va nous permettre de vous attribuer le label Startup Engagée à l'échelon 1, 2 ou 3 selon votre maturité sur les sujets RSE.
            </p>
            <p className="text-sm text-gray-600">
              Vous disposez de 30 jours pour compléter le questionnaire.<br />
              Nous restons disponibles si besoin !
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  Remplir le questionnaire
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">
                <EligibilityForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Documents récents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Aucun document récent</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Aucun message non lu</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Aucune activité récente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
