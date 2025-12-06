const TrustBar = () => {
  const partners = [
    { src: "/images/landing/Logo_Bpifrance.png", alt: "BPI France" },
    { src: "/images/landing/Logo_ImpactFrance.png", alt: "Impact France" },
  ];

  return (
    <div className="bg-white py-10 border-b border-gray-100">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {partners.map((partner) => (
            <img
              key={partner.alt}
              src={partner.src}
              alt={partner.alt}
              className="h-10 md:h-12 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
