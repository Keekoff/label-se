import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 min-h-[80vh] flex items-center bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary)/0.1),transparent_40%)]">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <span className="inline-block bg-secondary/15 text-primary py-2 px-4 rounded-full font-bold text-sm mb-5">
              Label Startup Engagée
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight tracking-tight">
              Le label RSE des entreprises qui veulent agir, pas juste promettre
            </h1>
            
            <p className="text-text-gray text-base md:text-lg mb-5 text-justify">
              Le Label Startup Engagée est une méthodologie conçue pour les startups et les petites entreprises qui souhaitent structurer rapidement leur démarche RSE sans complexité ni budget démesuré.
            </p>
            
            <p className="text-text-gray text-base md:text-lg mb-5 text-justify">
              Un parcours simple, guidé, basé sur des preuves, qui permet d'obtenir une reconnaissance claire, crédible et opérationnelle de ses engagements.
            </p>
            
            <p className="text-text-gray text-base md:text-lg mb-8 text-justify">
              Créé avec des experts ESG, et soutenu par le Fonds Parisien pour l'Innovation de la BPI, le Label Startup Engagée est référencé depuis 3 ans dans le mapping Impact France. Il est utilisé par des dizaines de startups depuis 2023 pour démontrer leur engagement.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/signup")}
                className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold py-4 px-8 rounded-full shadow-btn-accent hover:shadow-btn-accent-hover hover:-translate-y-0.5 transition-all"
              >
                Commencer la labellisation
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <img 
              src="/images/landing/Logo_LSE_vertical.jpg" 
              alt="Label Startup Engagée" 
              className="max-h-[400px] md:max-h-[500px] w-auto animate-float rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
