
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/components/DashboardLayout";
import EligibilityForm from "./pages/EligibilityForm";
import Form from "./pages/Dashboard/Form";
import Justificatifs from "./pages/Dashboard/Justificatifs";
import Payments from "./pages/Dashboard/Payments";
import Profil from "./pages/Dashboard/Profil";
import Faq from "./pages/Faq";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="eligibility" element={<EligibilityForm />} />
          <Route path="form" element={<Form />} />
          <Route path="justificatifs" element={<Justificatifs />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profil" element={<Profil />} />
          <Route path="settings" element={<div>Settings Page</div>} />
          <Route path="faq" element={<Faq />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
