
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue, Client</h1>
        <p className="text-gray-500 mt-2">
          Voici un aperçu de votre activité récente
        </p>
      </div>

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
