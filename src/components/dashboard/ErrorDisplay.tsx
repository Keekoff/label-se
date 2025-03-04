
import { Card } from "@/components/ui/card";
import { TieredBarChart } from "@/components/ui/chart";

interface ErrorDisplayProps {
  error: string;
  errorDetails: string | null;
  companyName: string;
}

export const ErrorDisplay = ({ error, errorDetails, companyName }: ErrorDisplayProps) => {
  const defaultChartData = [
    { name: 'Vos résultats', value: 0 },
    { name: 'Moyenne globale', value: 65 }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6 transition-all duration-200 h-auto flex flex-col items-center justify-center">
        <div className="text-center space-y-4 max-w-2xl p-4">
          <div className="text-red-500 font-medium text-lg">Erreur de récupération des données</div>
          <p className="text-gray-600">{error}</p>
          
          {errorDetails && (
            <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200 text-left overflow-auto max-h-60 w-full">
              <p className="text-sm font-medium text-gray-700 mb-2">Détails de l'erreur:</p>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">{errorDetails}</pre>
            </div>
          )}
          
          <div className="flex flex-col gap-2 mt-6">
            <p className="text-gray-500 text-sm">Informations de débogage:</p>
            <ul className="text-left text-xs text-gray-500 list-disc list-inside">
              <li>Base Airtable ID: app7al7op0zAJYssh</li>
              <li>Table: Company Data</li>
              <li>Nom d'entreprise utilisé: {companyName || "Non défini"}</li>
            </ul>
            <p className="text-gray-500 text-sm mt-4">Veuillez vérifier votre connexion à Airtable ou contacter l'assistance.</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
          <TieredBarChart 
            title="Gouvernance juste et inclusive" 
            data={defaultChartData}
            tiers={{
              tier1: 80,
              tier2: 60,
              tier3: 40
            }}
            barColor="#8985FF"
            tierLabels={{
              tier1: "Échelon 1",
              tier2: "Échelon 2",
              tier3: "Échelon 3"
            }}
          />
        </Card>
        
        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
          <TieredBarChart 
            title="Développement d'impact social positif" 
            data={defaultChartData}
            tiers={{
              tier1: 85,
              tier2: 65,
              tier3: 45
            }}
            barColor="#8985FF"
            tierLabels={{
              tier1: "Échelon 1",
              tier2: "Échelon 2",
              tier3: "Échelon 3"
            }}
          />
        </Card>

        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
          <TieredBarChart 
            title="Maitrise d'impact environnemental et développement durable" 
            data={defaultChartData}
            tiers={{
              tier1: 90,
              tier2: 70,
              tier3: 50
            }}
            barColor="#8985FF"
            tierLabels={{
              tier1: "Échelon 1",
              tier2: "Échelon 2",
              tier3: "Échelon 3"
            }}
          />
        </Card>

        <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-[400px]">
          <TieredBarChart 
            title="Moyenne des labellisés" 
            data={defaultChartData}
            tiers={{
              tier1: 95,
              tier2: 75,
              tier3: 55
            }}
            barColor="#35DA56"
            tierLabels={{
              tier1: "Échelon 1",
              tier2: "Échelon 2",
              tier3: "Échelon 3"
            }}
          />
        </Card>
      </div>
    </div>
  );
};
