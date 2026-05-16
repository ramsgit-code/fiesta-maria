export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      comentarios: {
        Row: {
          id: string
          nombre: string
          email: string | null
          mensaje: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email?: string | null
          mensaje: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string | null
          mensaje?: string
          created_at?: string
        }
        Relationships: []
      }
      tareas: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          asignado_a: string | null
          email_asignado: string | null
          completada: boolean
          created_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          asignado_a?: string | null
          email_asignado?: string | null
          completada?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string | null
          asignado_a?: string | null
          email_asignado?: string | null
          completada?: boolean
          created_at?: string
        }
        Relationships: []
      }
      invitados: {
        Row: {
          id: string
          nombre: string
          email: string | null
          telefono: string | null
          confirmado: boolean
          num_acompanantes: number
          comentario: string | null
          bebida: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email?: string | null
          telefono?: string | null
          confirmado?: boolean
          num_acompanantes?: number
          comentario?: string | null
          bebida?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string | null
          telefono?: string | null
          confirmado?: boolean
          num_acompanantes?: number
          comentario?: string | null
          bebida?: string | null
          created_at?: string
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

export type Comentario = Database['public']['Tables']['comentarios']['Row']
export type Tarea = Database['public']['Tables']['tareas']['Row']
export type Invitado = Database['public']['Tables']['invitados']['Row']
