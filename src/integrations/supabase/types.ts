export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      eligibility_submissions: {
        Row: {
          certification_status: string
          company_name: string
          created_at: string | null
          email: string
          employee_count: string
          first_name: string
          growth_stage: string
          id: string
          implemented_actions: string[]
          is_mission_driven: string
          last_name: string
          legal_form: string
          motivations: string[]
          phone: string
          responsibilities: string[]
          roles: string[]
          sectors: string[]
          siret: string
          user_id: string | null
        }
        Insert: {
          certification_status: string
          company_name: string
          created_at?: string | null
          email: string
          employee_count: string
          first_name: string
          growth_stage: string
          id?: string
          implemented_actions: string[]
          is_mission_driven: string
          last_name: string
          legal_form: string
          motivations: string[]
          phone: string
          responsibilities: string[]
          roles: string[]
          sectors: string[]
          siret: string
          user_id?: string | null
        }
        Update: {
          certification_status?: string
          company_name?: string
          created_at?: string | null
          email?: string
          employee_count?: string
          first_name?: string
          growth_stage?: string
          id?: string
          implemented_actions?: string[]
          is_mission_driven?: string
          last_name?: string
          legal_form?: string
          motivations?: string[]
          phone?: string
          responsibilities?: string[]
          roles?: string[]
          sectors?: string[]
          siret?: string
          user_id?: string | null
        }
        Relationships: []
      }
      form_justificatifs: {
        Row: {
          created_at: string | null
          file_name: string | null
          file_path: string | null
          id: string
          justificatifs: string[]
          question_identifier: string
          response: string
          status: string | null
          submission_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          justificatifs: string[]
          question_identifier: string
          response: string
          status?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          justificatifs?: string[]
          question_identifier?: string
          response?: string
          status?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_justificatifs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "label_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      label_submissions: {
        Row: {
          a_financements: string | null
          achats_responsables: string[] | null
          adresse: string | null
          amount_paid: number | null
          annee_creation: string | null
          code_postal: string | null
          communication_transparente: string[] | null
          confidentialite_donnees: string[] | null
          contribution_associative: string[] | null
          courriel: string | null
          created_at: string | null
          currency: string | null
          current_step: number | null
          details_financement: string | null
          disclaimer_accepted: boolean | null
          discount_applied: number | null
          diversite: string[] | null
          eco_conception: string[] | null
          economie_circulaire: string[] | null
          egalite: string[] | null
          emissions_carbone: string[] | null
          evaluation_continue: string[] | null
          formation: string[] | null
          forme_juridique: string | null
          gestion_dechets: string[] | null
          gestion_energie: string[] | null
          id: string
          impact_social: string[] | null
          mobilite: string[] | null
          nom_entreprise: string | null
          nombre_employes: string | null
          numerique_responsable: string[] | null
          parentalite: string[] | null
          payment_date: string | null
          payment_id: string | null
          payment_status: string | null
          politique_rse: string[] | null
          prenom: string | null
          production_durable: string[] | null
          relations_fournisseurs: string[] | null
          sante_bien_etre: string[] | null
          secteurs_activite: string[] | null
          situation_handicap: string[] | null
          status: string | null
          stripe_invoice_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string | null
          valide: boolean | null
          ville: string | null
        }
        Insert: {
          a_financements?: string | null
          achats_responsables?: string[] | null
          adresse?: string | null
          amount_paid?: number | null
          annee_creation?: string | null
          code_postal?: string | null
          communication_transparente?: string[] | null
          confidentialite_donnees?: string[] | null
          contribution_associative?: string[] | null
          courriel?: string | null
          created_at?: string | null
          currency?: string | null
          current_step?: number | null
          details_financement?: string | null
          disclaimer_accepted?: boolean | null
          discount_applied?: number | null
          diversite?: string[] | null
          eco_conception?: string[] | null
          economie_circulaire?: string[] | null
          egalite?: string[] | null
          emissions_carbone?: string[] | null
          evaluation_continue?: string[] | null
          formation?: string[] | null
          forme_juridique?: string | null
          gestion_dechets?: string[] | null
          gestion_energie?: string[] | null
          id?: string
          impact_social?: string[] | null
          mobilite?: string[] | null
          nom_entreprise?: string | null
          nombre_employes?: string | null
          numerique_responsable?: string[] | null
          parentalite?: string[] | null
          payment_date?: string | null
          payment_id?: string | null
          payment_status?: string | null
          politique_rse?: string[] | null
          prenom?: string | null
          production_durable?: string[] | null
          relations_fournisseurs?: string[] | null
          sante_bien_etre?: string[] | null
          secteurs_activite?: string[] | null
          situation_handicap?: string[] | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          valide?: boolean | null
          ville?: string | null
        }
        Update: {
          a_financements?: string | null
          achats_responsables?: string[] | null
          adresse?: string | null
          amount_paid?: number | null
          annee_creation?: string | null
          code_postal?: string | null
          communication_transparente?: string[] | null
          confidentialite_donnees?: string[] | null
          contribution_associative?: string[] | null
          courriel?: string | null
          created_at?: string | null
          currency?: string | null
          current_step?: number | null
          details_financement?: string | null
          disclaimer_accepted?: boolean | null
          discount_applied?: number | null
          diversite?: string[] | null
          eco_conception?: string[] | null
          economie_circulaire?: string[] | null
          egalite?: string[] | null
          emissions_carbone?: string[] | null
          evaluation_continue?: string[] | null
          formation?: string[] | null
          forme_juridique?: string | null
          gestion_dechets?: string[] | null
          gestion_energie?: string[] | null
          id?: string
          impact_social?: string[] | null
          mobilite?: string[] | null
          nom_entreprise?: string | null
          nombre_employes?: string | null
          numerique_responsable?: string[] | null
          parentalite?: string[] | null
          payment_date?: string | null
          payment_id?: string | null
          payment_status?: string | null
          politique_rse?: string[] | null
          prenom?: string | null
          production_durable?: string[] | null
          relations_fournisseurs?: string[] | null
          sante_bien_etre?: string[] | null
          secteurs_activite?: string[] | null
          situation_handicap?: string[] | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          valide?: boolean | null
          ville?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
