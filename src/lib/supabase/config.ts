/**
 * True quando as chaves do Supabase estão presentes no ambiente.
 * Enquanto for false, o app roda em modo mock (localStorage). Assim que você
 * preencher o `.env.local`, tudo passa a usar o Supabase Auth de verdade —
 * sem trocar nenhuma tela.
 */
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
