const MediaSection = () => {
  const mediaLinks = [
    {
      href: "https://www.decideurs-magazine.com/immobilier-public-environnement/43427-sommet-de-la-transformation-2022-coup-de-projecteur-sur-les-start-up-laureates.html",
      name: "Decideurs Magazine",
      logo: "/images/landing/media_decideurs.png",
    },
    {
      href: "https://www.maddyness.com/2022/05/11/startup-engagee-label-keekoff/",
      name: "Maddyness",
      logo: "/images/landing/media_maddyness.png",
    },
    {
      href: "https://business.ladn.eu/news-business/actualites-startups/keekoff-label-startup-engagee-entreprises-impact-positif/",
      name: "L'ADN",
      logo: "/images/landing/media_adn.png",
    },
    {
      href: "https://www.carenews.com/carenews-pro/news/comment-les-startups-percoivent-elles-leur-impact",
      name: "Carenews",
      logo: "/images/landing/media_carenews.png",
    },
  ];

  return (
    <section id="media" className="py-12 bg-secondary">
      <div className="container mx-auto px-8 md:px-12 lg:px-16 text-center">
        <h2 className="text-white text-xl md:text-2xl font-bold mb-8">
          Ils parlent de nous
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {mediaLinks.map((media) => (
            <a
              key={media.name}
              href={media.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 hover:scale-105 transition-all"
            >
              <img
                src={media.logo}
                alt={media.name}
                className="h-8 md:h-12 w-auto"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
