
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, loading: authLoading } = useAuth();
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [needsEligibility, setNeedsEligibility] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkEligibility = async () => {
      if (!session?.user || location.pathname === '/dashboard/eligibility') {
        setEligibilityLoading(false);
        return;
      }

      try {
        console.log('ProtectedRoute: Checking eligibility for user:', session.user.id);
        
        const { data: eligibilitySubmission, error } = await supabase
          .from('eligibility_submissions')
          .select('legal_form')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('ProtectedRoute: Error checking eligibility:', error);
          toast.error("Erreur lors de la vérification d'éligibilité");
          setEligibilityLoading(false);
          return;
        }
        
        // Vérifier si l'utilisateur doit remplir le formulaire d'éligibilité
        if (!eligibilitySubmission) {
          console.log('ProtectedRoute: No eligibility submission found');
          setNeedsEligibility(true);
        } else if (["Association Loi 1901", "EI (auto-entrepreneur, micro-entreprise)"].includes(eligibilitySubmission.legal_form)) {
          console.log('ProtectedRoute: Ineligible legal form');
          setNeedsEligibility(true);
        } else {
          console.log('ProtectedRoute: Eligibility check passed');
          setNeedsEligibility(false);
        }
      } catch (error) {
        console.error('ProtectedRoute: Error in eligibility check:', error);
        toast.error("Une erreur est survenue lors de la vérification");
      } finally {
        setEligibilityLoading(false);
      }
    };

    if (session) {
      checkEligibility();
    } else {
      setEligibilityLoading(false);
    }
  }, [session, location.pathname]);

  // Affichage du loading pendant la vérification de l'auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35DA56] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Redirection vers login si pas d'utilisateur connecté
  if (!user || !session) {
    console.log('ProtectedRoute: No user/session, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Affichage du loading pendant la vérification d'éligibilité
  if (eligibilityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35DA56] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'éligibilité...</p>
        </div>
      </div>
    );
  }

  // Redirection vers éligibilité si nécessaire
  if (needsEligibility && location.pathname !== '/dashboard/eligibility') {
    console.log('ProtectedRoute: Needs eligibility, redirecting');
    return <Navigate to="/dashboard/eligibility" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
