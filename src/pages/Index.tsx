import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LandingHeader,
  HeroSection,
  TrustBar,
  WhySection,
  ContentSection,
  ProcessSection,
  EchelonsSection,
  PricingSection,
  FaqSection,
  ContactSection,
  MediaSection,
  LandingFooter,
} from "@/components/landing";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-light font-sen">
      <LandingHeader />
      <HeroSection />
      <TrustBar />
      <WhySection />
      <ContentSection />
      <ProcessSection />
      <EchelonsSection />
      <PricingSection />
      <FaqSection />
      <ContactSection />
      <MediaSection />
      <LandingFooter />
    </div>
  );
};

export default Index;
