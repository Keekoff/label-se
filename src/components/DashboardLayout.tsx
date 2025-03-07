import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, User, ArrowLeft, ArrowRight, LogOut, Receipt, Upload, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        // Check payment status
        const {
          data: submission
        } = await supabase.from('label_submissions').select('payment_status').eq('user_id', session.user.id).maybeSingle();
        setHasPaid(submission?.payment_status === 'paid');

        // Check for eligibility submission
        const {
          data: eligibilitySubmission,
          error
        } = await supabase.from('eligibility_submissions').select('legal_form').eq('user_id', session.user.id).single();
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        if (!eligibilitySubmission && location.pathname !== '/dashboard/eligibility') {
          navigate('/dashboard/eligibility');
          return;
        }
        if (eligibilitySubmission && ["Association Loi 1901", "EI (auto-entrepreneur, micro-entreprise)"].includes(eligibilitySubmission.legal_form)) {
          navigate('/dashboard/eligibility');
          return;
        }
      } catch (error) {
        console.error('Error checking eligibility:', error);
        toast.error("Une erreur est survenue lors de la vérification de votre éligibilité.");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();

    // Subscribe to auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);
  const baseMenuItems = [{
    icon: LayoutDashboard,
    label: "Tableau de bord",
    path: "/dashboard"
  }, {
    icon: HelpCircle,
    label: "FAQ",
    path: "/dashboard/faq"
  }, {
    icon: Settings,
    label: "Paramètres",
    path: "/dashboard/settings"
  }];
  const menuItems = hasPaid ? [...baseMenuItems.slice(0, 2), {
    icon: Upload,
    label: "Justificatifs",
    path: "/dashboard/justificatifs"
  }, {
    icon: Receipt,
    label: "Mes paiements",
    path: "/dashboard/payments"
  }, ...baseMenuItems.slice(2)] : baseMenuItems;
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      Chargement...
    </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className={`fixed top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-20"} z-30 shadow-lg`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/10 backdrop-blur-sm bg-primary/95">
          <div className="text-slate-50 text-base font-bold">
            {sidebarOpen ? <img src="/lovable-uploads/de6325b8-2d80-4327-963c-d4a068f337fe.png" alt="Logo" className="h-10" /> : <img src="/lovable-uploads/de6325b8-2d80-4327-963c-d4a068f337fe.png" alt="Logo" className="h-6" />}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-white/10 text-white bg-white/0">
            {sidebarOpen ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map(item => <Button key={item.path} variant="ghost" className={`w-full justify-start text-white hover:bg-[#8985FF] ${!sidebarOpen && "justify-center"} ${location.pathname === item.path ? "bg-[#35DA56]" : ""} transition-all duration-300`} onClick={() => navigate(item.path)}>
              <item.icon className="h-4 w-4 mr-2" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>)}
        </nav>
      </div>

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="h-16 border-b border-border bg-white/80 backdrop-blur-sm fixed top-0 right-0 left-auto w-full z-20 shadow-sm">
          <div className="flex items-center justify-end h-full px-6 bg-white">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100/50">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm shadow-md" align="end" forceMount>
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/profil")} className="hover:bg-gray-100/70">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="hover:bg-gray-100/70">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 hover:bg-red-50/70" onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="pt-16 min-h-screen bg-neutral-100/80">
          <div className="p-6 backdrop-blur-sm bg-white">
            <Outlet />
          </div>
        </main>
      </div>
    </div>;
};
export default DashboardLayout;