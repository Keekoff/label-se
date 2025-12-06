import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="tarif" className="py-24">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="bg-white border-2 border-primary rounded-3xl p-10 max-w-md mx-auto text-center shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.15)] relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-accent" />
          
          <h3 className="text-2xl font-bold text-primary mt-4">Tarif labellisation</h3>
          
          <div className="my-6">
            <span className="text-2xl line-through text-gray-300 font-semibold">149 €</span>
            <span className="block text-5xl font-extrabold text-primary mt-2">
              à partir de 129 € <span className="text-2xl text-text-gray font-normal">HT</span>
            </span>
          </div>

          <div className="bg-accent/10 text-text-dark p-4 rounded-xl mb-6">
            <span className="text-primary font-extrabold block mb-1">-50% Code Promo</span>
            <p className="text-sm">Pour nos abonnés LinkedIn</p>
          </div>

          <p className="text-text-gray text-sm mb-8">
            Tarif valable jusqu'au 31 Décembre 2025
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-bold py-4 px-6 rounded-full shadow-btn-accent hover:shadow-btn-accent-hover hover:-translate-y-0.5 transition-all"
          >
            🚀 Me labelliser
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
