import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
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
            Politique de Confidentialité
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
                La présente politique de confidentialité a pour but d'informer les utilisateurs du site :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Sur la manière dont sont collectées leurs données personnelles. Sont considérées comme des données personnelles, toute information permettant d'identifier un utilisateur. A ce titre, il peut s'agir : de ses noms et prénoms, de son âge, de son adresse postale ou email, de sa localisation ou encore de son adresse IP (liste non-exhaustive) ;</li>
                <li>Sur les droits dont ils disposent concernant ces données ;</li>
                <li>Sur la personne responsable du traitement des données à caractère personnel collectées et traitées ;</li>
                <li>Sur les destinataires de ces données personnelles ;</li>
                <li>Sur la politique du site en matière de cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 2 : Principes relatifs à la collecte et au traitement des données personnelles</h2>
              <p className="text-muted-foreground mb-4">
                Conformément à l'article 5 du Règlement européen 2016/679, les données à caractère personnel sont :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Traitées de manière licite, loyale et transparente au regard de la personne concernée ;</li>
                <li>Collectées pour des finalités déterminées, explicites et légitimes, et ne pas être traitées ultérieurement d'une manière incompatible avec ces finalités ;</li>
                <li>Adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées ;</li>
                <li>Exactes et, si nécessaire, tenues à jour. Toutes les mesures raisonnables doivent être prises pour que les données à caractère personnel qui sont inexactes, eu égard aux finalités pour lesquelles elles sont traitées, soient effacées ou rectifiées sans tarder ;</li>
                <li>Conservées sous une forme permettant l'identification des personnes concernées pendant une durée n'excédant pas celle nécessaire au regard des finalités pour lesquelles elles sont traitées ;</li>
                <li>Traitées de façon à garantir une sécurité appropriée des données collectées, y compris la protection contre le traitement non autorisé ou illicite et contre la perte, la destruction ou les dégâts d'origine accidentelle, à l'aide de mesures techniques ou organisationnelles appropriées.</li>
              </ul>
              
              <p className="text-muted-foreground mt-4 mb-4">
                Le traitement n'est licite que si, et dans la mesure où, au moins une des conditions suivantes est remplie :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>La personne concernée a consenti au traitement de ses données à caractère personnel pour une ou plusieurs finalités spécifiques ;</li>
                <li>Le traitement est nécessaire à l'exécution d'un contrat auquel la personne concernée est partie ou à l'exécution de mesures précontractuelles prises à la demande de celle-ci ;</li>
                <li>Le traitement est nécessaire au respect d'une obligation légale à laquelle le responsable du traitement est soumis ;</li>
                <li>Le traitement est nécessaire à la sauvegarde des intérêts vitaux de la personne concernée ou d'une autre personne physique ;</li>
                <li>Le traitement est nécessaire à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement ;</li>
                <li>Le traitement est nécessaire aux fins des intérêts légitimes poursuivis par le responsable du traitement ou par un tiers, à moins que ne prévalent les intérêts ou les libertés et droits fondamentaux de la personne concernée qui exigent une protection des données à caractère personnel, notamment lorsque la personne concernée est un enfant.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 3 : Données à caractère personnel collectées et traitées dans le cadre de la navigation sur le site</h2>
              
              <h3 className="text-lg font-medium mb-3 text-foreground">Article 3.1 : Données collectées</h3>
              <p className="text-muted-foreground mb-4">
                Les données personnelles collectées dans le cadre de notre activité sont les suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>nom</li>
                <li>prénom</li>
                <li>email</li>
                <li>société</li>
                <li>fonction</li>
                <li>nombre de collaborateurs</li>
                <li>autres informations diverses concernant la structure</li>
              </ul>
              
              <p className="text-muted-foreground mt-4 mb-4">
                La collecte et le traitement de ces données répond aux finalités suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>gestion de la relation client</li>
                <li>suivi de la qualité des services</li>
                <li>évaluation et certification d'engagement sociétal</li>
                <li>newsletter</li>
                <li>prospection commerciale</li>
                <li>business intelligence</li>
                <li>CRM</li>
              </ul>

              <h3 className="text-lg font-medium mb-3 mt-6 text-foreground">Article 3.2 : Mode de collecte des données</h3>
              <p className="text-muted-foreground mb-4">
                Nous collectons et utilisons les informations personnelles des utilisateurs, telles que leur nom et leur adresse e-mail, pour fournir les services qu'ils demandent.
              </p>
              <p className="text-muted-foreground">
                Elles sont conservées par le responsable du traitement dans des conditions raisonnables de sécurité, pour une durée de 18 mois. La société est susceptible de conserver certaines données à caractère personnel au-delà des délais annoncés ci-dessus afin de remplir ses obligations légales ou réglementaires.
              </p>

              <h3 className="text-lg font-medium mb-3 mt-6 text-foreground">Article 3.3 : Hébergement des données</h3>
              <p className="text-muted-foreground mb-4">
                Le site est hébergé par Supabase, Inc.
              </p>
              <p className="text-muted-foreground">
                Les données sont stockées de manière sécurisée conformément aux standards internationaux de sécurité.
              </p>

              <h3 className="text-lg font-medium mb-3 mt-6 text-foreground">Article 3.4 : Politique en matière de "cookies"</h3>
              <p className="text-muted-foreground">
                Notre site utilise des cookies techniques nécessaires au fonctionnement du service d'authentification et de navigation. Ces cookies sont essentiels et ne peuvent être désactivés.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 4 : Responsable du traitement des données et délégué à la protection des données</h2>
              
              <h3 className="text-lg font-medium mb-3 text-foreground">Article 4.1 : Le responsable du traitement des données</h3>
              <p className="text-muted-foreground mb-4">
                Les données à caractère personnel sont collectées par notre société.
              </p>
              <p className="text-muted-foreground mb-4">
                Le responsable du traitement des données à caractère personnel peut être contacté via notre formulaire de contact ou par email.
              </p>

              <h3 className="text-lg font-medium mb-3 text-foreground">Article 4.2 : Le délégué à la protection des données</h3>
              <p className="text-muted-foreground">
                Si vous estimez, après nous avoir contactés, que vos droits "Informatique et Libertés" ne sont pas respectés, vous pouvez adresser une information à la CNIL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 5 : Les droits de l'utilisateur en matière de collecte et de traitement des données</h2>
              <p className="text-muted-foreground mb-4">
                Tout utilisateur concerné par le traitement de ses données personnelles peut se prévaloir des droits suivants, en application du règlement européen 2016/679 et de la Loi Informatique et Liberté (Loi 78-17 du 6 janvier 1978) :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Droit d'accès, de rectification et droit à l'effacement des données (posés respectivement aux articles 15, 16 et 17 du RGPD) ;</li>
                <li>Droit à la portabilité des données (article 20 du RGPD) ;</li>
                <li>Droit à la limitation (article 18 du RGPD) et à l'opposition du traitement des données (article 21 du RGPD) ;</li>
                <li>Droit de ne pas faire l'objet d'une décision fondée exclusivement sur un procédé automatisé ;</li>
                <li>Droit de déterminer le sort des données après la mort ;</li>
                <li>Droit de saisir l'autorité de contrôle compétente (article 77 du RGPD).</li>
              </ul>
              
              <p className="text-muted-foreground mt-4 mb-4">
                Pour exercer vos droits, veuillez nous contacter via notre formulaire de contact ou par email.
              </p>
              
              <p className="text-muted-foreground mb-4">
                Afin que le responsable du traitement des données puisse faire droit à sa demande, l'utilisateur peut être tenu de lui communiquer certaines informations telles que : ses noms et prénoms, son adresse e-mail et la dénomination de l'entreprise pour laquelle elle agit.
              </p>
              
              <p className="text-muted-foreground">
                Consultez le site <a href="https://www.cnil.fr/professionnel" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cnil.fr</a> pour plus d'informations sur vos droits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Article 6 : Conditions de modification de la politique de confidentialité</h2>
              <p className="text-muted-foreground mb-4">
                L'éditeur du site se réserve le droit de pouvoir modifier la présente Politique à tout moment afin d'assurer aux utilisateurs du site sa conformité avec le droit en vigueur.
              </p>
              <p className="text-muted-foreground mb-4">
                Les éventuelles modifications ne sauraient avoir d'incidence sur les services antérieurement fournis, lesquels restent soumis à la Politique en vigueur au moment de leur utilisation.
              </p>
              <p className="text-muted-foreground">
                L'utilisateur est invité à prendre connaissance de cette Politique à chaque fois qu'il utilise nos services, sans qu'il soit nécessaire de l'en prévenir formellement.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}