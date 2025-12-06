const ProcessSection = () => {
  const steps = [
    {
      step: "Étape 1",
      title: "Questionnaire",
      description: "21 questions qui couvrent les 3 piliers du label :",
      items: ["Gouvernance & éthique", "Environnement", "Social & RH"],
    },
    {
      step: "Étape 2",
      title: "Dépôt des preuves",
      description: "Un système de dépôt simple directement sur la plateforme.",
      highlight: "Besoin d'aide ?",
      extra: "Nous vous fournissons également des templates (politiques, chartes, documents RH) si vous n'en avez pas.",
    },
    {
      step: "Étape 3",
      title: "Audit & obtention",
      description: "Un audit ultra rapide, vos résultats sont disponibles sous 7 jours.",
      highlight: "Vous recevez :",
      items: ["L'échelon obtenu", "Le livret détaillé de vos résultats", "Un kit de communication"],
    },
  ];

  return (
    <section id="process" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Un parcours simple et rapide
          </h2>
          <p className="text-text-gray text-lg">Un processus en 3 étapes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-landing border border-gray-100 text-left"
            >
              <span className="inline-block bg-primary text-white py-1 px-3 rounded-full text-sm font-bold mb-4">
                {step.step}
              </span>
              <h3 className="text-xl font-bold text-primary mb-4">{step.title}</h3>
              <p className="text-text-gray mb-4">{step.description}</p>
              
              {step.items && (
                <ul className="space-y-2 mb-4">
                  {step.items.map((item, i) => (
                    <li key={i} className="text-text-gray text-sm pl-4 relative before:content-['•'] before:text-accent before:font-bold before:absolute before:left-0">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              
              {step.highlight && (
                <>
                  <p className="font-semibold text-primary mt-4">{step.highlight}</p>
                  {step.extra && (
                    <p className="text-text-gray text-sm mt-2">{step.extra}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
