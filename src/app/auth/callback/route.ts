import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Callback do OAuth (Google, etc.). O provedor redireciona pra cá com `?code=`,
 * que trocamos por uma sessão (grava os cookies) e mandamos pro hub.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/hub";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // sem code ou falha → volta pro login sinalizando erro
  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
