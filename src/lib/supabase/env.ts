// Public Supabase settings. Both values are safe to expose to the browser;
// row-level security (RLS) in the database protects the data.
// The service role key must NEVER be prefixed with NEXT_PUBLIC_.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
