"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Hammer } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getService } from "@/lib/services";

/**
 * Shared frame for every service route. Renders a branded header + a
 * production-ready empty scaffold. Drop each service's real UI into `children`
 * later — the chrome stays consistent across tools.
 */
export function ServiceShell({
  slug,
  children,
}: {
  slug: string;
  children?: React.ReactNode;
}) {
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      {/* header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-3">
          <Link
            href="/hub"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Hub
          </Link>
          <span className="h-5 w-px bg-border" />
          <span
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ background: `${service.color}1a`, color: service.color }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-semibold">{service.name}</span>
          <div className="ml-auto">
            <Logo showWordmark={false} />
          </div>
        </div>
      </header>

      {/* body */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{service.name}</h1>
          <p className="mt-2 max-w-xl text-muted">{service.description}</p>
        </div>

        {children ?? (
          <>
            {/* placeholder stat row */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="h-3 w-20 rounded bg-border" />
                  <div className="mt-3 h-7 w-16 rounded bg-border/70" />
                </div>
              ))}
            </div>

            {/* empty state */}
            <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <span
                className="grid h-12 w-12 place-items-center rounded-xl"
                style={{
                  background: `${service.color}1a`,
                  color: service.color,
                }}
              >
                <Hammer className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">
                Módulo em construção
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted">
                O scaffold de <strong>{service.name}</strong> está pronto. Aqui
                entra a interface real do serviço — basta plugar os dados e a
                lógica quando o backend estiver conectado.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
