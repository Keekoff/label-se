
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  error?: string | null;
}

const EmptyState = ({ error }: EmptyStateProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Pièces justificatives</h1>
        <p className="text-gray-500 mt-2">
          Veuillez télécharger les documents demandés ci-dessous pour compléter votre dossier.
        </p>
        {error ? <p className="text-sm text-red-600 mt-2">
            {error}
          </p> : <p className="text-sm text-amber-600 mt-2">
            Aucun justificatif trouvé pour votre dernière soumission. Veuillez soumettre le formulaire complet ou contacter l'administrateur.
          </p>}
      </div>

      <Card className="p-6">
        <div className="text-center p-8">
          <p className="text-lg text-gray-600">
            Vous devez d'abord compléter et soumettre le formulaire de labellisation.
          </p>
          <Button className="mt-4 bg-[#35DA56] hover:bg-[#27017F]" onClick={() => window.location.href = "/dashboard/form"}>
            Aller au formulaire
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmptyState;
