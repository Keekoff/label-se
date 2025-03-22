
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Composant FormPart2 simple pour éviter les références circulaires
const FormPart2Component: React.FC = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Partie 2 : Économique & Sociétal</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenu du formulaire partie 2</p>
      </CardContent>
    </Card>
  );
};

export default FormPart2Component;
