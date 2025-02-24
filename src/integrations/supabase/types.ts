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
      label_submissions: {
        Row: {
          associative_contribution: string[] | null
          carbon_emissions: string[] | null
          circular_economy: string[] | null
          city: string | null
          communication: string[] | null
          company_name: string | null
          continuous_evaluation: string[] | null
          created_at: string | null
          current_step: number | null
          disclaimer_accepted: boolean | null
          eco_design: string[] | null
          email: string | null
          employee_count: string | null
          energy_management: string[] | null
          first_name: string | null
          founding_year: string | null
          funding_details: string | null
          has_funding: string | null
          id: string
          legal_form: string | null
          payment_id: string | null
          payment_status: string | null
          postal_code: string | null
          production: string[] | null
          responsible_digital: string[] | null
          responsible_purchasing: string[] | null
          sectors: string[] | null
          social_impact: string[] | null
          status: string | null
          street_address: string | null
          supplier_relations: string[] | null
          updated_at: string | null
          user_id: string | null
          waste_management: string[] | null
        }
        Insert: {
          associative_contribution?: string[] | null
          carbon_emissions?: string[] | null
          circular_economy?: string[] | null
          city?: string | null
          communication?: string[] | null
          company_name?: string | null
          continuous_evaluation?: string[] | null
          created_at?: string | null
          current_step?: number | null
          disclaimer_accepted?: boolean | null
          eco_design?: string[] | null
          email?: string | null
          employee_count?: string | null
          energy_management?: string[] | null
          first_name?: string | null
          founding_year?: string | null
          funding_details?: string | null
          has_funding?: string | null
          id?: string
          legal_form?: string | null
          payment_id?: string | null
          payment_status?: string | null
          postal_code?: string | null
          production?: string[] | null
          responsible_digital?: string[] | null
          responsible_purchasing?: string[] | null
          sectors?: string[] | null
          social_impact?: string[] | null
          status?: string | null
          street_address?: string | null
          supplier_relations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          waste_management?: string[] | null
        }
        Update: {
          associative_contribution?: string[] | null
          carbon_emissions?: string[] | null
          circular_economy?: string[] | null
          city?: string | null
          communication?: string[] | null
          company_name?: string | null
          continuous_evaluation?: string[] | null
          created_at?: string | null
          current_step?: number | null
          disclaimer_accepted?: boolean | null
          eco_design?: string[] | null
          email?: string | null
          employee_count?: string | null
          energy_management?: string[] | null
          first_name?: string | null
          founding_year?: string | null
          funding_details?: string | null
          has_funding?: string | null
          id?: string
          legal_form?: string | null
          payment_id?: string | null
          payment_status?: string | null
          postal_code?: string | null
          production?: string[] | null
          responsible_digital?: string[] | null
          responsible_purchasing?: string[] | null
          sectors?: string[] | null
          social_impact?: string[] | null
          status?: string | null
          street_address?: string | null
          supplier_relations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          waste_management?: string[] | null
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
