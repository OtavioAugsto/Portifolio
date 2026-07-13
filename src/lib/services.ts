import {
  MessageCircle,
  CalendarDays,
  Bot,
  Wallet,
  Share2,
  ShoppingCart,
  BarChart3,
  Truck,
  GraduationCap,
  Sparkles,
  Boxes,
  Globe,
  PiggyBank,
  LifeBuoy,
  Star,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** css color token used for accents / donut slices */
  color: string;
  /** share of usage shown on the hub donut (mock data) */
  usage: number;
  /** stack de tecnologias do projeto (mostrado nos cards do hub) */
  tags: string[];
  /** último acesso (texto exibido em "Últimos acessos") */
  lastAccess: string;
  /** se definido, o card abre essa URL externa em nova aba (projeto real ao vivo) */
  externalUrl?: string;
};

/**
 * Single source of truth for every tool in the hub.
 * Add a service here and it shows up on the hub, the donut, and gets a route.
 */
export const SERVICES: Service[] = [
  {
    slug: "crm",
    name: "CRM para WhatsApp",
    short: "CRM",
    description:
      "Gerencie clientes, conversas, pipeline de vendas e histórico de atendimento.",
    icon: MessageCircle,
    color: "var(--c-crm)",
    usage: 38,
    tags: ["Laravel", "MySQL", "Vue.js", "Redis"],
    lastAccess: "Hoje às 18:20",
  },
  {
    slug: "agendamento",
    name: "Sistema de Agendamento",
    short: "Agendamento",
    description:
      "Gerencie horários, reservas, clientes e disponibilidade de serviços.",
    icon: CalendarDays,
    color: "var(--c-agenda)",
    usage: 18,
    tags: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    lastAccess: "11/07 às 11:45",
  },
  {
    slug: "automacao",
    name: "Automação para WhatsApp",
    short: "Automação",
    description:
      "Automatize mensagens, fluxos e respostas inteligentes para seus clientes.",
    icon: Bot,
    color: "var(--c-auto)",
    usage: 27,
    tags: ["Python", "FastAPI", "MongoDB", "Docker"],
    lastAccess: "10/07 às 00:18",
  },
  {
    slug: "financeiro",
    name: "Sistema Financeiro (ERP simples)",
    short: "Financeiro",
    description:
      "Controle financeiro completo: entradas, saídas, relatórios e gestão de caixa.",
    icon: Wallet,
    color: "var(--c-fin)",
    usage: 11,
    tags: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    lastAccess: "Ontem às 16:10",
  },
  {
    slug: "redes-sociais",
    name: "Gerenciador de Redes Sociais",
    short: "Redes Sociais",
    description:
      "Agende posts, acompanhe métricas e gerencie todas as suas redes em um só lugar.",
    icon: Share2,
    color: "var(--c-social)",
    usage: 6,
    tags: ["React", "Node.js", "MongoDB", "Chart.js"],
    lastAccess: "09/07 às 14:30",
  },

  // ===== projeto REAL =====
  {
    slug: "slider-craques-copa",
    name: "Craques da Copa 2026",
    short: "Copa 2026",
    description:
      "Slider interativo com os principais craques da Copa do Mundo 2026, com animações e design moderno.",
    icon: Star,
    color: "#f59e0b",
    usage: 0,
    tags: ["HTML", "CSS", "JavaScript"],
    lastAccess: "13/07 às 10:00",
    externalUrl: "https://slider-craques-copa.vercel.app",
  },

  // ===== projetos FAKE (só pra preencher o preview) — remover depois =====
  {
    slug: "loja-virtual",
    name: "Loja Virtual (E-commerce)",
    short: "E-commerce",
    description: "Loja completa com carrinho, pagamentos e gestão de pedidos.",
    icon: ShoppingCart,
    color: "#f97316",
    usage: 0,
    tags: ["Next.js", "Stripe", "Prisma", "Redis"],
    lastAccess: "08/07 às 09:12",
  },
  {
    slug: "analytics",
    name: "Painel de Analytics",
    short: "Analytics",
    description: "Dashboards em tempo real com métricas e relatórios visuais.",
    icon: BarChart3,
    color: "#06b6d4",
    usage: 0,
    tags: ["React", "D3.js", "Node.js", "ClickHouse"],
    lastAccess: "07/07 às 20:40",
  },
  {
    slug: "delivery",
    name: "App de Delivery",
    short: "Delivery",
    description: "Pedidos, rastreamento de entregas e rotas otimizadas.",
    icon: Truck,
    color: "#22c55e",
    usage: 0,
    tags: ["Flutter", "Firebase", "Go", "Maps API"],
    lastAccess: "06/07 às 13:05",
  },
  {
    slug: "cursos",
    name: "Portal de Cursos (EAD)",
    short: "Cursos",
    description: "Aulas, progresso do aluno, certificados e pagamentos.",
    icon: GraduationCap,
    color: "#a855f7",
    usage: 0,
    tags: ["Next.js", "PostgreSQL", "Mux", "Stripe"],
    lastAccess: "05/07 às 10:22",
  },
  {
    slug: "chatbot-ia",
    name: "Chatbot com IA",
    short: "Chatbot IA",
    description: "Atendimento automático com IA e base de conhecimento.",
    icon: Sparkles,
    color: "#eab308",
    usage: 0,
    tags: ["Python", "LangChain", "OpenAI", "FastAPI"],
    lastAccess: "04/07 às 17:48",
  },
  {
    slug: "estoque",
    name: "Gestão de Estoque",
    short: "Estoque",
    description: "Controle de entradas, saídas, alertas e inventário.",
    icon: Boxes,
    color: "#ec4899",
    usage: 0,
    tags: ["Laravel", "MySQL", "Vue.js", "Redis"],
    lastAccess: "03/07 às 08:30",
  },
  {
    slug: "sites",
    name: "Landing Pages & Sites",
    short: "Sites",
    description: "Sites institucionais rápidos, responsivos e otimizados.",
    icon: Globe,
    color: "#3b82f6",
    usage: 0,
    tags: ["Astro", "Tailwind", "TypeScript", "Vercel"],
    lastAccess: "02/07 às 15:00",
  },
  {
    slug: "financas-pessoais",
    name: "App de Finanças Pessoais",
    short: "Finanças",
    description: "Controle de gastos, metas e orçamento pessoal no bolso.",
    icon: PiggyBank,
    color: "#14b8a6",
    usage: 0,
    tags: ["React Native", "Firebase", "TypeScript", "Plaid"],
    lastAccess: "01/07 às 19:20",
  },
  {
    slug: "helpdesk",
    name: "Sistema de Helpdesk",
    short: "Helpdesk",
    description: "Chamados, SLA, base de conhecimento e chat de suporte.",
    icon: LifeBuoy,
    color: "#f43f5e",
    usage: 0,
    tags: ["Laravel", "MySQL", "Livewire", "Pusher"],
    lastAccess: "30/06 às 11:10",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
