import { ServiceShell } from "@/components/ServiceShell";

/**
 * Rota de fallback para qualquer projeto do catálogo que ainda não tem pasta
 * própria (ex.: os projetos de preview). Renderiza o scaffold "em construção".
 * As rotas explícitas (crm, agendamento, etc.) têm prioridade sobre esta.
 *
 * Next.js 16: `params` é assíncrono.
 */
export default async function ProjectFallbackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceShell slug={slug} />;
}
