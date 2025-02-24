
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormState } from "./types";

export const useFormSubmission = (
  formState: FormState,
  setCurrentStep: (step: number) => void
) => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatSubmissionData = async (data: FormState, status: 'draft' | 'submitted') => {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to submit form");
    }

    return {
      user_id: user.id, // Add user_id to link submission to user
      first_name: data.firstName,
      email: data.email,
      company_name: data.companyName,
      sectors: data.sectors,
      legal_form: data.legalForm,
      street_address: data.streetAddress,
      postal_code: data.postalCode,
      city: data.city,
      founding_year: data.foundingYear,
      employee_count: data.employeeCount,
      has_funding: data.hasFunding,
      funding_details: data.fundingDetails,
      status: status,
      current_step: status === 'submitted' ? 6 : data.currentStep,
      disclaimer_accepted: data.disclaimerAccepted,
      associative_contribution: data.associativeContribution || [],
      responsible_digital: data.responsibleDigital || [],
      communication: data.communication || [],
      supplier_relations: data.supplierRelations || [],
      social_impact: data.socialImpact || [],
      production: data.production || [],
      eco_design: data.ecoDesign || [],
      continuous_evaluation: data.continuousEvaluation || [],
      energy_management: data.energyManagement || [],
      carbon_emissions: data.carbonEmissions || [],
      circular_economy: data.circularEconomy || [],
      waste_management: data.wasteManagement || [],
      responsible_purchasing: data.responsiblePurchasing || []
    };
  };

  const handleSave = async () => {
    try {
      const submissionData = await formatSubmissionData(formState, 'draft');

      if (submissionId) {
        const { error } = await supabase
          .from('label_submissions')
          .update(submissionData)
          .eq('id', submissionId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('label_submissions')
          .insert([submissionData])
          .select('id')
          .single();

        if (error) throw error;
        setSubmissionId(data.id);
      }

      toast({
        title: "Brouillon sauvegardé",
        description: "Votre progression a été enregistrée avec succès.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const submissionData = await formatSubmissionData(formState, 'submitted');

      if (submissionId) {
        const { error } = await supabase
          .from('label_submissions')
          .update(submissionData)
          .eq('id', submissionId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('label_submissions')
          .insert([submissionData])
          .select('id')
          .single();

        if (error) throw error;
        setSubmissionId(data.id);
      }

      setCurrentStep(6);
      window.scrollTo(0, 0);

      toast({
        title: "Formulaire envoyé",
        description: "Votre demande a été enregistrée avec succès.",
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire.",
        variant: "destructive"
      });
    }
  };

  return {
    submissionId,
    handleSave,
    handleSubmit
  };
};
