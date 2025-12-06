import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LandingHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#pourquoi", label: "Pourquoi se labelliser ?" },
    { href: "#process", label: "Les étapes" },
    { href: "#echelons", label: "Les échelons" },
    { href: "#tarif", label: "Le tarif" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 py-5">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/images/landing/Logo_LSE_horizontal.jpg" 
            alt="Logo Label Startup Engagée" 
            className="h-10 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-primary font-semibold hover:text-secondary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/signup")}
            className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold py-3 px-6 rounded-full shadow-btn-accent hover:shadow-btn-accent-hover hover:-translate-y-0.5 transition-all"
          >
            🚀 Me labelliser
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-black/5 py-4">
          <div className="container mx-auto px-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-primary font-semibold hover:text-secondary transition-colors text-left py-2"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/signup")}
              className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold py-3 px-6 rounded-full shadow-btn-accent hover:shadow-btn-accent-hover transition-all text-center mt-2"
            >
              🚀 Me labelliser
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
