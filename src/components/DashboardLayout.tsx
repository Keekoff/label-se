import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, User, ArrowLeft, ArrowRight, LogOut, Receipt, Upload, HelpCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useAuth } from "@/contexts/AuthContext";

// Définir des types distincts pour les éléments de menu
type BaseMenuItem = {
  icon: React.FC<any>;
  label: string;
};

type InternalMenuItem = BaseMenuItem & {
  path: string;
  isExternalLink?: never;
  onClick?: never;
};

type ExternalMenuItem = BaseMenuItem & {
  path?: never;
  isExternalLink: true;
  onClick: () => void;
};

type MenuItem = InternalMenuItem | ExternalMenuItem;

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { companyData } = useCompanyData();
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Handle responsiveness - close sidebar on small screens by default
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPaymentAndValidationStatus = async () => {
      if (!user) return;

      try {
        console.log('DashboardLayout: Fetching payment and validation status');
        
        const { data: submission } = await supabase
          .from('label_submissions')
          .select('payment_status, valide')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setHasPaid(submission?.payment_status === 'paid');
        setIsValidated(submission?.valide === true);
      } catch (error) {
        console.error('DashboardLayout: Error fetching submission data:', error);
      }
    };

    fetchPaymentAndValidationStatus();
  }, [user]);

  // Déterminer l'URL du kit media en fonction de l'échelon
  const getKitMediaUrl = () => {
    if (!companyData || !companyData.echelonTexte) return "";
    
    // Gérer le cas où echelonTexte est un tableau
    let echelon = companyData.echelonTexte;
    
    // Si c'est un tableau, prendre le premier élément
    if (Array.isArray(echelon)) {
      echelon = echelon[0];
      console.log("Échelon extrait du tableau:", echelon);
    }
    
    if (echelon === "1") {
      return "https://startupengagee.notion.site/chelon-1-Kit-de-communication-fced9a87298f466786bb2346f2e66a51";
    } else if (echelon === "2") {
      return "https://startupengagee.notion.site/chelon-2-Kit-de-communication-dbed159dadd240b697239e6af1f2fdd8";
    } else if (echelon === "3") {
      return "https://startupengagee.notion.site/chelon-3-Kit-de-communication-9865c5e63eb94cf1bb6df6f28d2893a8";
    }
    
    return "";
  };

  // Ouvrir le kit media dans un nouvel onglet
  const openKitMedia = () => {
    const url = getKitMediaUrl();
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error("Lien du kit media non disponible");
    }
  };

  const baseMenuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: "Tableau de bord",
      path: "/dashboard"
    }, 
    {
      icon: HelpCircle,
      label: "FAQ",
      path: "/dashboard/faq"
    }, 
    {
      icon: Settings,
      label: "Paramètres",
      path: "/dashboard/settings"
    }
  ];

  // Ajouter l'option Kit media si la soumission est validée
  const menuItemsWithKitMedia: MenuItem[] = isValidated && companyData?.echelonTexte 
    ? [
        ...baseMenuItems.slice(0, 2), 
        {
          icon: FileText,
          label: "Kit media",
          isExternalLink: true,
          onClick: openKitMedia
        }, 
        ...baseMenuItems.slice(2)
      ] 
    : baseMenuItems;

  const menuItems: MenuItem[] = hasPaid 
    ? [
        ...menuItemsWithKitMedia.slice(0, menuItemsWithKitMedia.length - 1), 
        {
          icon: Upload,
          label: "Justificatifs",
          path: "/dashboard/justificatifs"
        }, 
        {
          icon: Receipt,
          label: "Mes paiements",
          path: "/dashboard/payments"
        }, 
        ...menuItemsWithKitMedia.slice(menuItemsWithKitMedia.length - 1)
      ] 
    : menuItemsWithKitMedia;

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed positioned sidebar with higher z-index to ensure it's above content on small screens */}
      <div className={`fixed top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-20"} z-40 shadow-lg`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/10 backdrop-blur-sm bg-primary/95">
          <div className="text-slate-50 text-base font-bold">
            {sidebarOpen ? <img src="/lovable-uploads/de6325b8-2d80-4327-963c-d4a068f337fe.png" alt="Logo" className="h-10" /> : <img src="/lovable-uploads/de6325b8-2d80-4327-963c-d4a068f337fe.png" alt="Logo" className="h-6" />}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-white/10 text-white bg-white/0">
            {sidebarOpen ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => 
            <Button 
              key={`${item.label}-${index}`}
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-[#8985FF] ${!sidebarOpen && "justify-center"} ${
                'path' in item && location.pathname === item.path ? "bg-[#35DA56]" : ""
              } transition-all duration-300`} 
              onClick={() => {
                if ('isExternalLink' in item && item.isExternalLink) {
                  item.onClick();
                } else if ('path' in item) {
                  navigate(item.path);
                }
              }}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          )}
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
                  await signOut();
                  navigate("/login");
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="pt-16 min-h-screen bg-white">
          <div className="p-6 backdrop-blur-sm bg-white">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
