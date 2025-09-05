import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotEligibleNotice = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-destructive/10">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl text-foreground">
            Score insuffisant
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Votre score ne permet pas d'être éligible au label pour le moment. 
          Notre équipe peut vous accompagner pour améliorer votre score et 
          devenir éligible.
        </p>
        <Button 
          asChild 
          className="w-full sm:w-auto"
          variant="outline"
        >
          <a 
            href="mailto:contact@startupengagee.com?subject=Demande d'accompagnement - Score insuffisant"
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contacter notre support
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotEligibleNotice;