import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Conditions d'Utilisation
          </h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 1 : Préambule</h2>
              <p className="text-muted-foreground mb-4">
                Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de notre plateforme d'évaluation et de certification pour l'engagement sociétal et environnemental des entreprises.
              </p>
              <p className="text-muted-foreground">
                En accédant à notre service, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 2 : Définitions</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Service :</strong> la plateforme d'évaluation et de certification en ligne</li>
                <li><strong>Utilisateur :</strong> toute personne physique ou morale utilisant le service</li>
                <li><strong>Compte :</strong> espace personnel créé par l'utilisateur</li>
                <li><strong>Données :</strong> toute information saisie ou générée lors de l'utilisation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 3 : Objet du Service</h2>
              <p className="text-muted-foreground mb-4">
                Notre service permet aux entreprises de :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Évaluer leur niveau d'engagement sociétal et environnemental</li>
                <li>Obtenir une certification reconnaissant leurs efforts</li>
                <li>Accéder à des recommandations d'amélioration personnalisées</li>
                <li>Télécharger des justificatifs et documents de certification</li>
                <li>Suivre leur progression au fil du temps</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 4 : Inscription et Compte Utilisateur</h2>
              <p className="text-muted-foreground mb-4">
                L'utilisation du service nécessite la création d'un compte utilisateur. L'utilisateur s'engage à :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fournir des informations exactes et à jour</li>
                <li>Maintenir la confidentialité de ses identifiants</li>
                <li>Notifier immédiatement tout usage non autorisé de son compte</li>
                <li>Être responsable de toutes les activités réalisées sous son compte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 5 : Utilisation du Service</h2>
              <p className="text-muted-foreground mb-4">
                L'utilisateur s'engage à utiliser le service conformément à sa destination et à :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Respecter la législation en vigueur</li>
                <li>Ne pas porter atteinte aux droits de tiers</li>
                <li>Fournir des informations véridiques lors des évaluations</li>
                <li>Ne pas tenter de contourner les mesures de sécurité</li>
                <li>Ne pas utiliser le service à des fins frauduleuses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 6 : Propriété Intellectuelle</h2>
              <p className="text-muted-foreground mb-4">
                Tous les éléments du service (design, textes, images, logos, etc.) sont protégés par les droits de propriété intellectuelle. Toute reproduction non autorisée est interdite.
              </p>
              <p className="text-muted-foreground">
                Les données saisies par l'utilisateur lui appartiennent. Nous nous engageons à ne les utiliser que dans le cadre du service fourni.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 7 : Protection des Données</h2>
              <p className="text-muted-foreground mb-4">
                La collecte et le traitement des données personnelles sont régis par notre Politique de Confidentialité, conformément au RGPD.
              </p>
              <p className="text-muted-foreground">
                L'utilisateur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 8 : Responsabilité</h2>
              <p className="text-muted-foreground mb-4">
                Nous nous efforçons de maintenir le service accessible et fonctionnel, mais ne pouvons garantir :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Une disponibilité ininterrompue du service</li>
                <li>L'absence totale d'erreurs ou de bugs</li>
                <li>La compatibilité avec tous les équipements</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Notre responsabilité est limitée aux dommages directs et prévisibles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 9 : Certification</h2>
              <p className="text-muted-foreground mb-4">
                La certification délivrée atteste du niveau d'engagement évalué à une date donnée. Elle :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Est basée sur les informations fournies par l'utilisateur</li>
                <li>Peut faire l'objet de vérifications ultérieures</li>
                <li>A une durée de validité limitée</li>
                <li>Peut être révoquée en cas de non-conformité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 10 : Suspension et Résiliation</h2>
              <p className="text-muted-foreground mb-4">
                Nous nous réservons le droit de suspendre ou résilier l'accès au service en cas de :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Violation des présentes conditions</li>
                <li>Utilisation frauduleuse du service</li>
                <li>Non-paiement des frais applicables</li>
                <li>Inactivité prolongée du compte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 11 : Modification des Conditions</h2>
              <p className="text-muted-foreground">
                Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront informés des modifications par email ou via le service. L'utilisation continue du service après notification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 12 : Droit Applicable et Juridiction</h2>
              <p className="text-muted-foreground">
                Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 13 : Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter via notre page de contact ou par email.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}