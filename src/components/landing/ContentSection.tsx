import { Check } from "lucide-react";

const ContentSection = () => {
  const features = [
    "Le questionnaire complet digitalisé",
    "Les modèles de documents (Word/PDF)",
    "L'audit par un expert ESG",
    "Les recommandations personnalisées",
    "Le kit communication (badges, visuels)",
    "Un livret de résultats à partager",
  ];

  return (
    <section id="contenu" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Platform Image */}
          <div className="order-2 lg:order-1">
            <div className="bg-secondary p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-10px_hsl(var(--secondary)/0.4)] hover:-translate-y-1 transition-transform duration-300">
              <img
                src="/images/landing/plateforme_signup.png"
                alt="Interface Plateforme Label Startup Engagée"
                className="rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] w-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <span className="text-secondary font-bold text-sm uppercase tracking-wide">
              TOUT INCLUS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Ce que contient votre labellisation
            </h2>
            <p className="text-text-gray text-lg mb-8">
              Nous vous donnons les outils pour réussir, pas juste un examen à passer. 
              Accédez à une plateforme intuitive pensée pour les entrepreneurs.
            </p>

            <ul className="space-y-4 text-left inline-block">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 font-semibold text-primary">
                  <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-primary" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
