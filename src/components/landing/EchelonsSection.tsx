const EchelonsSection = () => {
  const echelons = [
    {
      image: "/images/landing/Echelon1.png",
      title: "Engagé",
      description: "L'entreprise a formalisé ses premiers engagements et mis en place les documents structurants.",
      borderColor: "border-t-accent",
    },
    {
      image: "/images/landing/Echelon2.png",
      title: "Confirmé",
      description: "L'entreprise pilote sa RSE avec des plans d'action concrets et mesure ses indicateurs clés.",
      borderColor: "border-t-secondary",
    },
    {
      image: "/images/landing/Echelon3.png",
      title: "Exemplaire",
      description: "La RSE est au cœur du modèle d'affaires avec un impact positif mesurable sur les 3 piliers.",
      borderColor: "border-t-primary",
    },
  ];

  return (
    <section id="echelons" className="py-24 bg-white">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Votre progression valorisée
          </h2>
          <p className="text-text-gray text-lg">
            3 niveaux de maturité pour accompagner votre croissance RSE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {echelons.map((echelon, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-landing border border-gray-100 border-t-[5px] ${echelon.borderColor} text-center hover:-translate-y-2.5 hover:shadow-landing-hover transition-all duration-300`}
            >
              <img
                src={echelon.image}
                alt={`Echelon ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md mb-6"
              />
              <h3 className="text-xl font-bold text-primary mb-3">{echelon.title}</h3>
              <p className="text-text-gray text-sm">{echelon.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EchelonsSection;
