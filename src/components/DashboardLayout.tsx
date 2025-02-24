
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, User, ArrowLeft, ArrowRight, LogOut, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [{
    icon: LayoutDashboard,
    label: "Tableau de bord",
    path: "/dashboard"
  }, {
    icon: Receipt,
    label: "Mes paiements",
    path: "/dashboard/payments"
  }, {
    icon: Settings,
    label: "Paramètres",
    path: "/dashboard/settings"
  }];

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        // Check for eligibility submission
        const { data: submission, error } = await supabase
          .from('eligibility_submissions')
          .select('legal_form')
          .eq('user_id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        // If no submission exists or if we're already on the eligibility form, don't redirect
        if (!submission && location.pathname !== '/dashboard/eligibility') {
          navigate('/dashboard/eligibility');
          return;
        }

        // If submission exists but legal form is ineligible, show message and navigate to eligibility
        if (submission && ["Association Loi 1901", "EI (auto-entrepreneur, micro-entreprise)"].includes(submission.legal_form)) {
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

    checkEligibility();
  }, [navigate, location.pathname]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      Chargement...
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`fixed top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-20"} z-30`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/10">
          <span className="text-slate-50 text-base font-bold">
            {sidebarOpen ? "Startup Engagée" : "SE"}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="hover:bg-white/10 text-white bg-white/0"
          >
            {sidebarOpen ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <Button 
              key={item.path} 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-[#8985FF] ${
                !sidebarOpen && "justify-center"
              } ${location.pathname === item.path ? "bg-[#35DA56]" : ""}`} 
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="h-16 border-b border-border bg-white/80 backdrop-blur-sm fixed top-0 right-0 left-auto w-full z-20">
          <div className="flex items-center justify-end h-full px-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => navigate("/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="pt-16 min-h-screen bg-gray-50/30">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
