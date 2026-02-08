export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      coaching_sessions: {
        Row: {
          created_at: string
          id: string
          stage: Database["public"]["Enums"]["COACHING_STAGE"]
          status: Database["public"]["Enums"]["COACHING_STATUS"]
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stage?: Database["public"]["Enums"]["COACHING_STAGE"]
          status?: Database["public"]["Enums"]["COACHING_STATUS"]
          title?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          stage?: Database["public"]["Enums"]["COACHING_STAGE"]
          status?: Database["public"]["Enums"]["COACHING_STATUS"]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      cv_reviews: {
        Row: {
          checklist: Json | null
          created_at: string
          id: string
          parsed_content: Json | null
          resume_id: string | null
          review: Json | null
          session_id: string
          suggestions: Json | null
          user_id: string | null
        }
        Insert: {
          checklist?: Json | null
          created_at?: string
          id?: string
          parsed_content?: Json | null
          resume_id?: string | null
          review?: Json | null
          session_id?: string
          suggestions?: Json | null
          user_id?: string | null
        }
        Update: {
          checklist?: Json | null
          created_at?: string
          id?: string
          parsed_content?: Json | null
          resume_id?: string | null
          review?: Json | null
          session_id?: string
          suggestions?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_reviews_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "coaching_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview: {
        Row: {
          created_at: string
          id: string
          result: Json | null
          session_id: string
          step: number
          target_role: string
          target_role_level: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          result?: Json | null
          session_id?: string
          step?: number
          target_role: string
          target_role_level: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          result?: Json | null
          session_id?: string
          step?: number
          target_role?: string
          target_role_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "coaching_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_qas: {
        Row: {
          answer: string | null
          created_at: string
          feedback: Json | null
          id: string
          interview_id: string
          question: string
          step: number
          type: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          feedback?: Json | null
          id?: string
          interview_id: string
          question: string
          step: number
          type: string
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          feedback?: Json | null
          id?: string
          interview_id?: string
          question?: string
          step?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_qas_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interview"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string
          id: string
          name: string
          path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          path: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          path?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_gaps: {
        Row: {
          created_at: string
          id: string
          result: Json | null
          resume_id: string
          session_id: string
          skills: string[] | null
          target_role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          result?: Json | null
          resume_id?: string
          session_id?: string
          skills?: string[] | null
          target_role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          result?: Json | null
          resume_id?: string
          session_id?: string
          skills?: string[] | null
          target_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_gaps_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_gaps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "coaching_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      COACHING_STAGE: "CV_REVIEW" | "MOCK_INTERVIEW" | "SKILL_GAP"
      COACHING_STATUS: "PENDING" | "COMPLETED"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      COACHING_STAGE: ["CV_REVIEW", "MOCK_INTERVIEW", "SKILL_GAP"],
      COACHING_STATUS: ["PENDING", "COMPLETED"],
    },
  },
} as const

