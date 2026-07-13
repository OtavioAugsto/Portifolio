import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// nunca cachear — precisa executar de verdade a cada chamada do cron
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Keep-alive do Supabase.
 *
 * O plano free do Supabase pausa o projeto após 7 dias sem atividade. Esta rota
 * faz uma consulta trivial (basta a requisição chegar na API) para zerar esse
 * contador. É chamada pelo Vercel Cron (ver `vercel.json`) a cada ~3 dias.
 *
 * Segurança: se `CRON_SECRET` estiver definido no ambiente, a Vercel envia
 * `Authorization: Bearer <CRON_SECRET>` e exigimos esse header. Sem a variável,
 * a rota fica aberta (inofensiva — só faz um select vazio).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured) {
    return Response.json({ ok: true, skipped: "supabase-not-configured" });
  }

  try {
    const supabase = await createClient();
    // consulta trivial só para registrar atividade (RLS pode retornar vazio;
    // o que importa é a requisição bater na API do Supabase)
    const { error } = await supabase.from("hub_perfis").select("id").limit(1);
    if (error) {
      // o erro do Supabase (PostgrestError) não é um Error nativo
      return Response.json(
        { ok: false, code: error.code, error: error.message, hint: error.hint },
        { status: 500 },
      );
    }
    return Response.json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
