"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Code2,
  TrendingUp,
  Rocket,
  UserRound,
  FolderGit2,
  Zap,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
} from "react-icons/si";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

type Mode = "login" | "signup";

// título digitado no estilo "máquina de escrever" (\n vira quebra de linha)
const TITLE = "Bem-vindo ao\nmeu portfólio.";

// destaques mostrados no painel da marca
const FEATURES = [
  {
    icon: Code2,
    title: "Projetos reais",
    desc: "Cases completos com foco em resultados e experiência.",
  },
  {
    icon: TrendingUp,
    title: "Evolução constante",
    desc: "Sempre aprendendo, testando e entregando mais valor.",
  },
  {
    icon: Rocket,
    title: "Tecnologias modernas",
    desc: "Aplicações construídas com ferramentas atuais e eficientes.",
  },
  {
    icon: UserRound,
    title: "Foco no usuário",
    desc: "Interfaces intuitivas, responsivas e pensadas nos detalhes.",
  },
];

const TECHS = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
  { name: "TypeScript", Icon: SiTypescript, color: "#4C97F0" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#38BDF8" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#7CC352" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#7FB2E8" },
  { name: "Supabase", Icon: SiSupabase, color: "#3FCF8E" },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, signUp, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepConnected, setKeepConnected] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  // efeito "máquina de escrever" no título
  const [typed, setTyped] = useState(0);
  const [caretGone, setCaretGone] = useState(false);
  useEffect(() => {
    if (typed >= TITLE.length) {
      const t = setTimeout(() => setCaretGone(true), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((n) => n + 1), 55);
    return () => clearTimeout(t);
  }, [typed]);

  // marca que o usuário logou por aqui (pra rodar a animação em vez do
  // redirect instantâneo do efeito abaixo)
  const submittedRef = useRef(false);

  useEffect(() => {
    // quem chega já logado vai direto; quem acabou de logar roda a animação
    if (!loading && user && !submittedRef.current) router.replace("/hub");
  }, [loading, user, router]);

  // pré-carrega o hub pra revelação ser instantânea
  useEffect(() => {
    router.prefetch("/hub");
  }, [router]);

  // dispara a "cortina" e navega quando os painéis terminam de sair (700ms),
  // pra o hub começar a convergir logo em seguida (entrada sincronizada)
  function exitToHub() {
    setLeaving(true);
    window.setTimeout(() => router.replace("/hub"), 700);
  }

  // erro devolvido pelo callback do OAuth (ex.: /login?error=oauth)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "oauth") {
      setError("Não foi possível entrar com o Google. Tente de novo.");
    }
  }, []);

  async function onGoogle() {
    setError(null);
    setInfo(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle(); // redireciona o navegador
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar com Google.");
      setGoogleLoading(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "signup" && !name.trim()) {
      setError("Informe seu nome.");
      return;
    }
    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }

    setSubmitting(true);
    submittedRef.current = true;
    try {
      if (mode === "login") {
        await login(email, password);
        exitToHub();
      } else {
        const { needsEmailConfirm } = await signUp(name.trim(), email, password);
        if (needsEmailConfirm) {
          submittedRef.current = false;
          setInfo(
            `Conta criada! Enviamos um link de confirmação para ${email}. ` +
              "Confirme o email (veja também o spam) para poder entrar.",
          );
          setMode("login");
          setPassword("");
          setSubmitting(false);
          return;
        }
        exitToHub();
      }
    } catch (err) {
      submittedRef.current = false;
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente de novo.");
      setSubmitting(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <div className="grid min-h-screen overflow-hidden bg-background lg:grid-cols-2">
      {/* brand side (left) — desliza pra esquerda ao logar */}
      <div
        style={{
          transform: leaving ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 700ms ease-in-out",
        }}
        className="relative hidden overflow-hidden bg-gradient-to-br from-brand to-brand-700 will-change-transform lg:block"
      >
        <div className="dot-grid absolute right-10 top-10 h-40 w-40 opacity-60" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full bg-black/10" />

        <div className="relative flex h-full flex-col justify-between gap-8 p-10 text-white xl:p-12">
          <Logo variant="white" size={44} />

          <div className="space-y-8">
            <div>
              <h2
                style={{ minHeight: "2.3em" }}
                className="text-4xl font-bold leading-[1.1] tracking-tight xl:text-5xl"
              >
                {TITLE.slice(0, typed)
                  .split("\n")
                  .map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 ? <br /> : null}
                    </span>
                  ))}
                {!caretGone && <span className="type-caret">|</span>}
              </h2>
              <p className="mt-4 max-w-md text-white/80">
                Este é o hub central onde organizo, desenvolvo e evoluo projetos
                que transformam ideias em soluções reais.
              </p>
              <div className="mt-5 h-1 w-12 rounded-full bg-white/40" />
            </div>

            {/* destaques */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{f.title}</p>
                      <p className="mt-0.5 text-sm leading-snug text-white/70">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* card: tecnologias + stats */}
          <div className="rounded-3xl bg-black/15 p-7 ring-1 ring-white/10 backdrop-blur">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-base font-semibold">Tecnologias que utilizo</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {TECHS.map((t) => {
                    const Icon = t.Icon;
                    return (
                      <span
                        key={t.name}
                        title={t.name}
                        className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
                      >
                        <Icon className="h-6 w-6" style={{ color: t.color }} />
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-6 lg:mt-10">
                {/* escadinha: +25 fica mais à esquerda... */}
                <div className="flex items-start gap-2.5 sm:-ml-4">
                  <FolderGit2 className="mt-2 h-5 w-5 text-white/70" />
                  <div>
                    <p className="text-4xl font-extrabold leading-none tracking-tight">
                      +25
                    </p>
                    <p className="mt-2 text-xs leading-tight text-white/70">
                      Projetos
                      <br />
                      desenvolvidos
                    </p>
                  </div>
                </div>
                {/* ...e o 100% desce e desloca pra direita */}
                <div className="flex items-start gap-2.5 sm:ml-14">
                  <Zap className="mt-2 h-5 w-5 text-white/70" />
                  <div>
                    <p className="text-4xl font-extrabold leading-none tracking-tight">
                      100%
                    </p>
                    <p className="mt-2 text-xs leading-tight text-white/70">
                      Comprometimento
                      <br />
                      com qualidade
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm text-white/60">
              E muitas outras ferramentas que me ajudam a criar experiências
              incríveis.
            </p>
          </div>
        </div>
      </div>

      {/* form side (right) — desliza pra direita ao logar */}
      <div
        style={{
          transform: leaving ? "translateX(100%)" : "translateX(0)",
          transition: "transform 700ms ease-in-out",
        }}
        className="flex items-center justify-center bg-background px-6 py-12 will-change-transform"
      >
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size={52} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            {isSignup ? "Criar sua conta" : "Entrar na sua conta"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isSignup
              ? "Crie uma conta para acessar seu hub de ferramentas."
              : "Acesse seu hub de ferramentas e projetos com email e senha."}
          </p>

          <button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading || submitting}
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold transition hover:bg-background disabled:opacity-70"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            {isSignup ? "Cadastrar com Google" : "Entrar com Google"}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-border" />
            ou com email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {isSignup && (
              <Field label="Nome">
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
                />
              </Field>
            )}

            <Field label="Email">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
            </Field>

            <Field label="Senha">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted">
                  <input
                    type="checkbox"
                    checked={keepConnected}
                    onChange={(e) => setKeepConnected(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-brand"
                  />
                  Manter conectado
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setInfo("Fale com o administrador para redefinir sua senha.")
                  }
                  className="font-semibold text-brand hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            {info && (
              <p className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignup ? "Criando…" : "Entrando…"}
                </>
              ) : (
                <>
                  {isSignup ? "Criar conta" : "Entrar"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {isSignup ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
            <button
              onClick={() => switchMode(isSignup ? "login" : "signup")}
              className="font-semibold text-brand hover:underline"
            >
              {isSignup ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

/** Logo colorido do Google. */
function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
