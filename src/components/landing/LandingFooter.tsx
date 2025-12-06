import { useNavigate } from "react-router-dom";

const LandingFooter = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="container mx-auto px-6 text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/images/landing/Logo_LSE_horizontal.jpg"
            alt="Logo Label Startup Engagée"
            className="h-10 w-auto mx-auto"
          />
          <p className="text-text-gray mt-4">Structurer. Prouver. Progresser.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <button
            onClick={() => navigate("/terms")}
            className="text-text-gray hover:text-primary text-sm transition-colors"
          >
            Mentions Légales
          </button>
          <button
            onClick={() => navigate("/privacy")}
            className="text-text-gray hover:text-primary text-sm transition-colors"
          >
            Politique de Confidentialité
          </button>
          <button
            onClick={scrollToContact}
            className="text-text-gray hover:text-primary text-sm transition-colors"
          >
            Contact
          </button>
        </div>

        {/* France 2030 Block */}
        <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
          <img
            src="/images/landing/Logo_France2030.jpg"
            alt="France 2030"
            className="h-16 w-auto"
          />
          <p className="text-text-gray text-sm italic max-w-lg">
            Ce projet a été financé par la Région et/ou par l'État dans le cadre de France 2030
          </p>
        </div>

        {/* Copyright */}
        <p className="text-gray-300 text-sm mt-8">
          © 2025 Label Startup Engagée. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
