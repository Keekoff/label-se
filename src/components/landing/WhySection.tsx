const WhySection = () => {
  const reasons = [
    {
      icon: "📢",
      title: "Valoriser vos engagements",
      description: "Auprès de vos clients, partenaires et talents. Montrez que vous agissez concrètement.",
    },
    {
      icon: "🏗️",
      title: "Structurer votre démarche",
      description: "Même si vous partez de zéro, utilisez notre cadre pour construire une politique RSE solide.",
    },
    {
      icon: "🤝",
      title: "Rassurer vos prospects",
      description: "Un atout décisif pour répondre aux exigences RSE des appels d'offres.",
    },
  ];

  return (
    <section id="pourquoi" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Pourquoi se labelliser ?
          </h2>
          <p className="text-text-gray text-lg">
            Plus qu'un badge, c'est un accélérateur de crédibilité pour votre entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-2xl shadow-landing border border-black/5 hover:-translate-y-2.5 hover:border-secondary hover:shadow-landing-hover transition-all duration-300"
            >
              <div className="w-16 h-16 bg-secondary/10 text-primary rounded-xl flex items-center justify-center text-3xl mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{reason.title}</h3>
              <p className="text-text-gray">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
