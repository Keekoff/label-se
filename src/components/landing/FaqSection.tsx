import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "C'est quoi le Label Startup Engagée en 1 phrase ?",
      answer: "Un label simple, rapide et accessible qui permet aux startups de montrer qu'elles ont une démarche RSE structurée — même quand elles partent de zéro.",
    },
    {
      question: "Combien de temps cela prend pour se labelliser ?",
      answer: "Environ 30 minutes pour remplir le questionnaire + le temps que vous prenez pour déposer les preuves, puis 7 jours pour recevoir les résultats.",
    },
    {
      question: "Est-ce que c'est compliqué si je n'ai rien mis en place ?",
      answer: "Non, justement. Nous vous fournissons les templates essentiels : politiques internes, charte éthique, etc. Vous pouvez ainsi les personnaliser et les adapter à votre entreprise.",
    },
    {
      question: "Pourquoi se labelliser maintenant ?",
      answer: "Le label a fait peau neuve : nouveau parcours, nouvelles ressources. Les clients demandent de plus en plus de preuves d'engagements RSE notamment dans les appels d'offres. Les délais d'audit sont très courts et vous permettent de vous lancer vite. Ne soyez pas les derniers à vous engager ! En bref : c'est le meilleur moment pour se lancer.",
    },
    {
      question: "À qui s'adresse le Label Startup Engagée ?",
      answer: "Principalement aux entreprises qui ne sont pas encore matures sur le sujet RSE, toutes les startups, TPE et PME peuvent se lancer. Si votre entreprise a entre 1 et 10 collaborateurs, vous profitez du tarif spécial le plus bas, écrivez-nous directement.",
    },
    {
      question: "Comment se déroule le parcours ?",
      answer: "En 3 étapes : 1. Répondre au questionnaire, 2. Déposer les preuves, 3. Audit du dossier par nos soins. Réception de votre résultat + un kit communication adapté. Tout se fait en ligne sur la plateforme pour avancer à votre rythme et accéder à votre dossier à tout moment.",
    },
    {
      question: "Quelles preuves faut-il fournir ?",
      answer: "Des documents simples : politiques internes, éléments sur vos consommations d'énergie, gestion des déchets, inclusion et diversité, règlement intérieur, engagement sociétal, etc. Si vous n'avez pas encore tout formalisé, pas de panique vous pouvez utiliser nos modèles prêts à l'emploi pour vous aider.",
    },
    {
      question: "Est-ce que le label est reconnu ?",
      answer: "Oui, le label Startup Engagé gagne en notoriété et en visibilité à chaque nouveau labellisé. Incubé par Matrice (2024-2025), soutenu par la BPI et le Fonds Parisien pour l'Innovation, présent dans le mapping Impact France depuis 3 ans, utilisé par +200 startups pour se lancer dans la RSE depuis 2023. C'est un label crédible, simple et adapté aux petites entreprises, startups et TPE-PME.",
    },
    {
      question: "Combien ça coûte ?",
      answer: "Nous proposons un tarif à partir de 129 € jusqu'au 31 janvier 2026, puis 149 € à partir du 1er février 2026. Offre speciale de -50% pour les abonnés LinkedIn → valable jusqu'au 31 décembre.",
    },
    {
      question: "Et si j'ai une question ou un doute en cours de route ?",
      answer: "Vous pouvez accéder au support facilement dès lors que vous avez créé votre compte sur la plateforme, ou poser votre question via le formulaire de contact sur le site. On répond vite (vraiment vite).",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-8 md:px-12 lg:px-16 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Questions Fréquentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-2xl px-6 shadow-sm border-none data-[state=open]:border-l-4 data-[state=open]:border-l-accent transition-all"
            >
              <AccordionTrigger className="text-primary font-bold text-left hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-gray pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
