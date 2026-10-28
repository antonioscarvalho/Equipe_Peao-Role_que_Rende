import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Fica null enquanto o projeto Supabase não está configurado, para o app abrir mesmo assim. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null
