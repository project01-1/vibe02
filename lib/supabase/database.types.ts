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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      auth_rate_limits: {
        Row: {
          failed_attempts: number
          key_hash: string
          locked_until: string | null
          updated_at: string
          window_started_at: string
        }
        Insert: {
          failed_attempts?: number
          key_hash: string
          locked_until?: string | null
          updated_at?: string
          window_started_at?: string
        }
        Update: {
          failed_attempts?: number
          key_hash?: string
          locked_until?: string | null
          updated_at?: string
          window_started_at?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string
          icon_key: string
          id: string
          is_published: boolean
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon_key: string
          id?: string
          is_published?: boolean
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_key?: string
          id?: string
          is_published?: boolean
          slug?: string
          title?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          order_index: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          order_index: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          order_index?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mission_steps: {
        Row: {
          block_definition: Json
          code_template: string
          hint: string
          id: string
          instruction: string
          mission_id: string
          order_index: number
          step_type: string
          validation_rule: Json
        }
        Insert: {
          block_definition?: Json
          code_template?: string
          hint?: string
          id?: string
          instruction: string
          mission_id: string
          order_index: number
          step_type: string
          validation_rule?: Json
        }
        Update: {
          block_definition?: Json
          code_template?: string
          hint?: string
          id?: string
          instruction?: string
          mission_id?: string
          order_index?: number
          step_type?: string
          validation_rule?: Json
        }
        Relationships: [
          {
            foreignKeyName: "mission_steps_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          concept: string
          created_at: string
          difficulty: number
          expected_result: Json
          id: string
          is_published: boolean
          is_trial: boolean
          learning_path_id: string
          order_index: number
          slug: string
          starter_code: string
          summary: string
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          concept: string
          created_at?: string
          difficulty?: number
          expected_result?: Json
          id?: string
          is_published?: boolean
          is_trial?: boolean
          learning_path_id: string
          order_index: number
          slug: string
          starter_code: string
          summary?: string
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          concept?: string
          created_at?: string
          difficulty?: number
          expected_result?: Json
          id?: string
          is_published?: boolean
          is_trial?: boolean
          learning_path_id?: string
          order_index?: number
          slug?: string
          starter_code?: string
          summary?: string
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "missions_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_key: string | null
          created_at: string
          current_level: number
          display_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          total_xp: number
          updated_at: string
        }
        Insert: {
          avatar_key?: string | null
          created_at?: string
          current_level?: number
          display_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          total_xp?: number
          updated_at?: string
        }
        Update: {
          avatar_key?: string | null
          created_at?: string
          current_level?: number
          display_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          total_xp?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mission_progress: {
        Row: {
          attempts: number
          best_result: Json
          code: string
          completed_at: string | null
          created_at: string
          current_step: number
          id: string
          mission_id: string
          status: Database["public"]["Enums"]["progress_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          best_result?: Json
          code?: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          mission_id: string
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          best_result?: Json
          code?: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          mission_id?: string
          status?: Database["public"]["Enums"]["progress_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mission_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_mission_progress: {
        Args: {
          p_code: string
          p_completed: boolean
          p_count_attempt: boolean
          p_mission_id: string
          p_user_id: string
        }
        Returns: {
          total_xp: number
        }[]
      }
    }
    Enums: {
      progress_status: "in_progress" | "completed"
      user_role: "student" | "teacher" | "admin"
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
    Enums: {
      progress_status: ["in_progress", "completed"],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const
