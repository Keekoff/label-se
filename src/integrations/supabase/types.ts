export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      justificatifs: {
        Row: {
          created_at: string | null
          id: string
          justificatifs: string | null
          questions: string
          reponses: string
          submission_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          justificatifs?: string | null
          questions: string
          reponses: string
          submission_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          justificatifs?: string | null
          questions?: string
          reponses?: string
          submission_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "justificatifs_submission_id_fkey"
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
          annee_creation: string | null
          code_postal: string | null
          communication_transparente: string[] | null
          confidentialite_donnees: string[] | null
          contribution_associative: string[] | null
          courriel: string | null
          created_at: string | null
          current_step: number | null
          details_financement: string | null
          disclaimer_accepted: boolean | null
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
          updated_at: string | null
          user_id: string | null
          ville: string | null
        }
        Insert: {
          a_financements?: string | null
          achats_responsables?: string[] | null
          adresse?: string | null
          annee_creation?: string | null
          code_postal?: string | null
          communication_transparente?: string[] | null
          confidentialite_donnees?: string[] | null
          contribution_associative?: string[] | null
          courriel?: string | null
          created_at?: string | null
          current_step?: number | null
          details_financement?: string | null
          disclaimer_accepted?: boolean | null
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
          updated_at?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Update: {
          a_financements?: string | null
          achats_responsables?: string[] | null
          adresse?: string | null
          annee_creation?: string | null
          code_postal?: string | null
          communication_transparente?: string[] | null
          confidentialite_donnees?: string[] | null
          contribution_associative?: string[] | null
          courriel?: string | null
          created_at?: string | null
          current_step?: number | null
          details_financement?: string | null
          disclaimer_accepted?: boolean | null
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
          updated_at?: string | null
          user_id?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
