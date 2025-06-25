
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import EligibilityForm from "./pages/EligibilityForm";
import Form from "./pages/Dashboard/Form";
import Justificatifs from "./pages/Dashboard/Justificatifs";
import Payments from "./pages/Dashboard/Payments";
import Profil from "./pages/Dashboard/Profil";
import Faq from "./pages/Faq";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Routes protégées */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="eligibility" element={<EligibilityForm />} />
            <Route path="form" element={<Form />} />
            <Route path="justificatifs" element={<Justificatifs />} />
            <Route path="payments" element={<Payments />} />
            <Route path="profil" element={<Profil />} />
            <Route path="settings" element={<div>Settings Page</div>} />
            <Route path="faq" element={<Faq />} />
          </Route>
          
          {/* Routes d'erreur */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
