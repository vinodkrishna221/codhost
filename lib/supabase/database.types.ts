export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
      }
      problems: {
        Row: {
          id: string
          title: string
          summary: string
          detailed_description: string
          use_cases: Json | null
          supported_languages: Json | null
          key_insights: Json | null
          is_active: boolean
          visibility: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          detailed_description: string
          use_cases?: Json | null
          supported_languages?: Json | null
          key_insights?: Json | null
          is_active?: boolean
          visibility?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          detailed_description?: string
          use_cases?: Json | null
          supported_languages?: Json | null
          key_insights?: Json | null
          is_active?: boolean
          visibility?: string
          created_at?: string
          updated_at?: string
        }
      }
      solutions: {
        Row: {
          id: string
          problem_id: string
          approaches: Json | null
          complexity_analysis: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          problem_id: string
          approaches?: Json | null
          complexity_analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          problem_id?: string
          approaches?: Json | null
          complexity_analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          problem_id: string | null
          problem_title: string
          action: string
          difficulty: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problem_id?: string | null
          problem_title: string
          action: string
          difficulty: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          problem_id?: string | null
          problem_title?: string
          action?: string
          difficulty?: string
          created_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          problems_solved: number
          current_streak: number
          achievement_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problems_solved?: number
          current_streak?: number
          achievement_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          problems_solved?: number
          current_streak?: number
          achievement_points?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_problems: {
        Args: {
          page_number?: number
        }
        Returns: Json
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_stats_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      update_user_stats_on_solve: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}