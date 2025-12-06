const MediaSection = () => {
  const mediaLinks = [
    {
      href: "https://www.decideurs-magazine.com/immobilier-public-environnement/43427-sommet-de-la-transformation-2022-coup-de-projecteur-sur-les-start-up-laureates.html",
      name: "Decideurs Magazine",
    },
    {
      href: "https://www.maddyness.com/2022/05/11/startup-engagee-label-keekoff/",
      name: "Maddyness",
    },
    {
      href: "https://business.ladn.eu/news-business/actualites-startups/keekoff-label-startup-engagee-entreprises-impact-positif/",
      name: "L'ADN",
    },
    {
      href: "https://www.carenews.com/carenews-pro/news/comment-les-startups-percoivent-elles-leur-impact",
      name: "Carenews",
    },
  ];

  return (
    <section id="media" className="py-12 bg-secondary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-white text-xl md:text-2xl font-bold mb-8">
          Ils parlent de nous
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {mediaLinks.map((media) => (
            <a
              key={media.name}
              href={media.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white font-bold text-lg hover:scale-105 transition-all"
            >
              {media.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
