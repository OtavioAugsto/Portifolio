"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Settings,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Code2,
  FolderKanban,
  MessageSquare,
  LogOut,
  Check,
  X,
  Mail,
} from "lucide-react";
import { FaGithub, FaWhatsapp, FaLinkedinIn } from "react-icons/fa6";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { SettingsModal } from "@/components/SettingsModal";
import { SERVICES, getService } from "@/lib/services";

// mesma duração da saída do login → entrada sincronizada
const SLIDE = "transform 700ms ease-in-out";
const PER_PAGE = 8;

// fundo translúcido na cor do serviço (funciona com CSS var)
const tint = (color: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, transparent)`;

const CONTACT_EMAIL = "otaviofreitas.contato@gmail.com";
const NOTIF_COUNT = 3;

const CONTACTS = {
  githubUrl: "https://github.com/OtavioAugsto",
  githubLabel: "github.com/OtavioAugsto",
  linkedinUrl: "https://www.linkedin.com/in/ot%C3%A1vio-augusto-0a2962345/",
  linkedinLabel: "in/otávio-augusto",
  whatsappUrl: "https://wa.me/55349966630857",
  whatsappLabel: "(34) 99666-30857",
  email: CONTACT_EMAIL,
};

export default function HubPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [entered, setEntered] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [unread, setUnread] = useState(NOTIF_COUNT);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 20);
    return () => clearTimeout(t);
  }, []);

  // persiste o "notificações lidas" por usuário (sobrevive ao logout/login)
  const notifKey = user?.email ? `klix.notifRead.${user.email}` : null;
  useEffect(() => {
    if (notifKey && localStorage.getItem(notifKey) === "1") setUnread(0);
  }, [notifKey]);

  function markAllRead() {
    setUnread(0);
    if (notifKey) localStorage.setItem(notifKey, "1");
  }

  const name = user?.name ?? "Visitante";
  const firstName = name.split(" ")[0];
  const avatar = user?.avatarUrl;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const techCount = new Set(SERVICES.flatMap((s) => s.tags)).size;
  const pageCount = Math.ceil(SERVICES.length / PER_PAGE);
  const pageItems = SERVICES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const featured = getService("automacao")!;
  const recents = ["crm", "financeiro", "agendamento"]
    .map((slug) => getService(slug))
    .filter(Boolean) as typeof SERVICES;

  // últimos projetos adicionados → viram as notificações
  const notifications = [
    { service: getService("helpdesk")!, when: "há 2 horas" },
    { service: getService("financas-pessoais")!, when: "ontem" },
    { service: getService("automacao")!, when: "há 2 dias" },
  ];

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="grid h-screen overflow-hidden lg:grid-cols-2">
      {/* ================= LEFT: painel do usuário ================= */}
      <aside
        style={{
          transform: entered ? "translateX(0)" : "translateX(-100%)",
          transition: SLIDE,
        }}
        className="relative flex flex-col overflow-hidden bg-background px-6 py-6 will-change-transform sm:px-8 [&>*]:shrink-0"
      >
        {/* header */}
        <div className="relative flex items-center justify-between gap-2">
          {/* foto de perfil */}
          <button
            onClick={() => setSettingsOpen(true)}
            title="Ver / trocar foto de perfil"
            className="group flex items-center gap-3 rounded-full p-1 pr-4 transition hover:bg-card"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-brand text-sm font-bold text-white ring-2 ring-border transition group-hover:ring-brand/40">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <span className="min-w-0 text-left">
              <span className="block truncate text-sm font-semibold">{name}</span>
              <span className="block truncate text-xs text-muted">
                Ver perfil
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="group relative grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-card hover:text-foreground active:scale-90"
            title="Notificações"
          >
            <Bell className="anim-bell h-5 w-5 origin-top" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="group grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-card hover:text-foreground active:scale-90"
            title="Configurações"
          >
            <Settings className="anim-wiggle h-5 w-5" />
          </button>
          </div>

          {/* popover de notificações (abre aqui, do lado do sino) */}
          {notifOpen && (
            <div className="animate-pop-in absolute right-0 top-12 z-20 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-brand" />
                  <span className="font-semibold">Notificações</span>
                  {unread > 0 && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  disabled={unread === 0}
                  className="text-xs font-semibold text-brand transition hover:underline disabled:text-muted disabled:no-underline"
                >
                  Marcar todas lidas
                </button>
              </div>
              <p className="mt-1 text-xs text-muted">
                Últimos projetos adicionados
              </p>
              <ul className="mt-3 space-y-1">
                {notifications.map((n) => {
                  const Icon = n.service.icon;
                  return (
                    <li key={n.service.slug}>
                      <Link
                        href={`/${n.service.slug}`}
                        onClick={() => setNotifOpen(false)}
                        className="group/n flex items-center gap-3 rounded-lg p-2 transition hover:translate-x-0.5 hover:bg-background"
                      >
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg transition group-hover/n:scale-110"
                          style={{
                            background: tint(n.service.color, 12),
                            color: n.service.color,
                          }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {n.service.name}
                          </p>
                          <p className="truncate text-xs text-muted">
                            Novo projeto · {n.when}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => {
                  setNotifOpen(false);
                  setNotifModalOpen(true);
                }}
                className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:gap-2.5"
              >
                Ver todas
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* greeting */}
        <div className="mt-5">
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {firstName} <span className="inline-block">👋</span>
          </h1>
          <p className="mt-1.5 text-lg font-semibold">
            Bem-vindo ao <span className="text-brand">Hub de Projetos</span>.
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Explore de perto tudo que eu desenvolvo — projetos, tecnologias e
            ideias reunidos em um só lugar.
          </p>
        </div>

        {/* último projeto adicionado */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 transition hover:border-brand/30 hover:shadow-sm">
          <p className="text-xs text-muted">Último projeto adicionado</p>
          <div className="mt-2 flex items-center gap-3">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
              style={{ background: tint(featured.color, 14), color: featured.color }}
            >
              <featured.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{featured.name}</p>
              <p className="truncate text-xs text-muted">
                Adicionado em 13/07/2026 às 00:18
              </p>
            </div>
            <Link
              href={`/${featured.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-050 px-3 py-2 text-xs font-semibold text-brand-600 transition hover:gap-2.5 hover:bg-brand hover:text-white active:scale-95"
            >
              Ver projeto <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* stats rápidos */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="group rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-sm">
            <FolderKanban className="h-5 w-5 text-brand transition group-hover:scale-110" />
            <p className="mt-3 text-2xl font-bold leading-none">
              {String(SERVICES.length).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-muted">Projetos ativos</p>
          </div>
          <div className="group rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-sm">
            <Code2
              className="h-5 w-5 transition group-hover:scale-110"
              style={{ color: "var(--c-auto)" }}
            />
            <p className="mt-3 text-2xl font-bold leading-none">{techCount}+</p>
            <p className="mt-1 text-xs text-muted">Tecnologias utilizadas</p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-sm"
          >
            <MessageSquare
              className="h-5 w-5"
              style={{ color: "var(--c-agenda)" }}
            />
            <p className="mt-3 text-sm font-bold leading-tight">Entre em contato</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
              Fale comigo{" "}
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </p>
          </a>
        </div>

        {/* contatos */}
        <div className="relative mt-4 overflow-hidden rounded-2xl bg-brand-050 p-5">
          <p className="font-semibold text-brand-700">
            Precisa de um serviço ou quer me contratar?
          </p>
          <p className="mt-1 max-w-sm text-sm text-brand-700/70">
            Se você tem interesse em algum dos meus serviços ou quer tirar um
            projeto do papel, é só me chamar por aqui.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {/* GitHub */}
            <a
              href={CONTACTS.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={CONTACTS.githubLabel}
              className="group flex flex-col rounded-xl bg-white/80 p-3 ring-1 ring-brand/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm hover:ring-brand/25"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#1b1f24] text-white transition group-hover:scale-110">
                  <FaGithub className="h-4 w-4" />
                </span>
                <span className="grid h-6 w-6 place-items-center rounded-full text-muted ring-1 ring-black/10 transition group-hover:bg-foreground group-hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">GitHub</p>
              <p className="w-full truncate text-xs text-muted">
                {CONTACTS.githubLabel.replace("github.com/", "@")}
              </p>
            </a>

            {/* LinkedIn */}
            <a
              href={CONTACTS.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Veja meu LinkedIn"
              className="group flex flex-col rounded-xl bg-white/80 p-3 ring-1 ring-brand/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm hover:ring-brand/25"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0A66C2] text-white transition group-hover:scale-110">
                  <FaLinkedinIn className="h-4 w-4" />
                </span>
                <span className="grid h-6 w-6 place-items-center rounded-full text-muted ring-1 ring-black/10 transition group-hover:bg-[#0A66C2] group-hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                LinkedIn
              </p>
              <p className="w-full truncate text-xs text-muted">
                {CONTACTS.linkedinLabel}
              </p>
            </a>

            {/* WhatsApp */}
            <a
              href={CONTACTS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Fale comigo no WhatsApp"
              className="group flex flex-col rounded-xl bg-white/80 p-3 ring-1 ring-brand/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm hover:ring-brand/25"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366] text-white transition group-hover:scale-110">
                  <FaWhatsapp className="h-4 w-4" />
                </span>
                <span className="grid h-6 w-6 place-items-center rounded-full text-muted ring-1 ring-black/10 transition group-hover:bg-[#25D366] group-hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">WhatsApp</p>
              <p className="w-full truncate text-xs text-muted">
                {CONTACTS.whatsappLabel}
              </p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${CONTACTS.email}`}
              title={CONTACTS.email}
              className="group flex flex-col rounded-xl bg-white/80 p-3 ring-1 ring-brand/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm hover:ring-brand/25"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white transition group-hover:scale-110">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="grid h-6 w-6 place-items-center rounded-full text-muted ring-1 ring-black/10 transition group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">Email</p>
              <p className="w-full truncate text-xs text-muted">
                {CONTACTS.email}
              </p>
            </a>
          </div>
        </div>

        {/* últimos acessos — alinhado ao rodapé do lado direito */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Últimos acessos</p>
            <button
              onClick={() => setRecentsOpen(true)}
              className="group inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:gap-2"
            >
              Ver todos
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </button>
          </div>
          <ul className="mt-3 space-y-1">
            {recents.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}`}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2 transition hover:translate-x-1 hover:bg-card"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg transition group-hover:scale-110"
                      style={{ background: tint(s.color, 12), color: s.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="truncate text-xs text-muted">{s.lastAccess}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-brand" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </aside>

      {/* ================= RIGHT: projetos ================= */}
      <section
        style={{
          transform: entered ? "translateX(0)" : "translateX(100%)",
          transition: SLIDE,
        }}
        className="relative flex flex-col overflow-hidden bg-gradient-to-br from-brand to-brand-700 px-6 py-6 text-white will-change-transform sm:px-10"
      >
        <div className="dot-grid pointer-events-none absolute right-16 top-8 h-28 w-28 opacity-40" />

        {/* header: logo + sair */}
        <div className="flex items-center justify-between">
          <Logo variant="white" size={40} />
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        <div className="mt-5">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Você vê todos os meus projetos com mais detalhes.
          </h2>
          <p className="mt-1.5 text-sm text-white/60">
            Acesse, gerencie e acompanhe cada projeto de perto.
          </p>
        </div>

        {/* projetos — grid compacto lado a lado (paginado) */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {pageItems.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="group flex flex-col rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.08] hover:ring-white/25"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition group-hover:scale-105"
                    style={{ background: tint(s.color, 22), color: s.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="min-w-0 flex-1 font-bold leading-tight">
                    {s.name}
                  </p>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {s.description}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-white/70 ring-1 ring-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {/* paginação — empurrada pra baixo, longe dos projetos */}
        {pageCount > 1 && (
          <div className="mt-auto flex items-center justify-center gap-1.5 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="grid h-7 w-7 place-items-center rounded-md ring-1 ring-white/15 transition hover:bg-white/10 active:scale-90 disabled:opacity-30"
              title="Anterior"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`grid h-7 w-7 place-items-center rounded-md text-xs font-semibold transition active:scale-90 ${
                  i === page
                    ? "bg-white text-brand-700"
                    : "ring-1 ring-white/15 hover:bg-white/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              className="grid h-7 w-7 place-items-center rounded-md ring-1 ring-white/15 transition hover:bg-white/10 active:scale-90 disabled:opacity-30"
              title="Próxima"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* rodapé — no fim da página */}
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-sm text-white/50">
          <span className="inline-flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            {String(SERVICES.length).padStart(2, "0")} projetos ativos
          </span>
          <span className="inline-flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            {techCount}+ tecnologias utilizadas
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-400" />
            Atualizado agora há pouco
          </span>
        </div>
      </section>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      {/* modal: todas as notificações */}
      {notifModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setNotifModalOpen(false)}
        >
          <div
            className="animate-pop-in flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand" />
                <h2 className="text-lg font-bold">Notificações</h2>
                {unread > 0 && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllRead}
                  disabled={unread === 0}
                  className="text-xs font-semibold text-brand transition hover:underline disabled:text-muted disabled:no-underline"
                >
                  Marcar todas lidas
                </button>
                <button
                  onClick={() => setNotifModalOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-background hover:text-foreground active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <ul className="overflow-y-auto p-2">
              {notifications.map((n) => {
                const Icon = n.service.icon;
                return (
                  <li key={n.service.slug}>
                    <Link
                      href={`/${n.service.slug}`}
                      onClick={() => setNotifModalOpen(false)}
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:translate-x-1 hover:bg-background"
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg transition group-hover:scale-110"
                        style={{
                          background: tint(n.service.color, 12),
                          color: n.service.color,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {n.service.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          Novo projeto · {n.when}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-brand" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* modal: todos os acessos */}
      {recentsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setRecentsOpen(false)}
        >
          <div
            className="animate-pop-in flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-lg font-bold">Todos os acessos</h2>
                <p className="text-xs text-muted">
                  Histórico dos projetos que você abriu
                </p>
              </div>
              <button
                onClick={() => setRecentsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-background hover:text-foreground active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="overflow-y-auto p-2">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/${s.slug}`}
                      onClick={() => setRecentsOpen(false)}
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:translate-x-1 hover:bg-background"
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg transition group-hover:scale-110"
                        style={{ background: tint(s.color, 12), color: s.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{s.name}</p>
                        <p className="truncate text-xs text-muted">
                          {s.lastAccess}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-brand" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
