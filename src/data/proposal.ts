import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "Full-stack developer with fintech experience — transaction monitoring, Stripe integrations, and compliance dashboards.",
  bio: "I've integrated Stripe from PaymentIntents to Stripe Connect payouts. I've built the compliance layer that keeps transactions clean and the webhook infrastructure that keeps them reliable. The demo in Tab 1 is a working example of exactly that.",
  approach: [
    {
      title: "Audit Your Stack",
      description:
        "Start by mapping your existing PHP/JS payment flow — where money moves, how errors surface, and where idempotency is missing. One session clarifies the full integration scope.",
    },
    {
      title: "Integrate & Secure",
      description:
        "Implement Stripe PaymentIntents with proper tokenization, SCA/3DS handling, and webhook signature verification. No raw card data touches your server.",
    },
    {
      title: "Test & Validate",
      description:
        "Stripe test mode coverage for success, decline, and SCA flows. Edge cases: duplicate charges, partial refunds, disputed payments. PCI compliance verification before go-live.",
    },
    {
      title: "Monitor & Iterate",
      description:
        "Structured webhook logging, alert routing for failed payments and disputes, and a clear escalation path. Short feedback cycles — no 2-week wait for a small change.",
    },
  ],
  skillCategories: [
    {
      name: "Payment & APIs",
      skills: [
        "Stripe API",
        "PaymentIntents",
        "Stripe Webhooks",
        "Stripe Connect",
        "Stripe Radar",
      ],
    },
    {
      name: "Backend",
      skills: ["PHP", "JavaScript", "TypeScript", "Node.js", "REST APIs"],
    },
    {
      name: "Security & Compliance",
      skills: ["PCI DSS", "SCA / 3DS", "Tokenization", "Idempotency Keys"],
    },
    {
      name: "Tooling",
      skills: ["Stripe Dashboard", "Stripe CLI", "Next.js", "Vercel"],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "payguard",
    title: "PayGuard — Transaction Monitor",
    description:
      "Compliance monitoring dashboard with real-time transaction flagging, linked account tracking, prohibited merchant detection, and alert delivery tracking.",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
    outcome:
      "Compliance monitoring dashboard with transaction flagging, multi-account linking, and alert delivery tracking",
    liveUrl: "https://payment-monitor.vercel.app",
    relevance:
      "Directly matches the compliance and transaction monitoring work you need.",
  },
  {
    id: "creator-economy",
    title: "Creator Economy App",
    description:
      "Creator economy livestreaming platform with end-to-end Stripe Connect payment flow — viewer tips split and routed to creator payouts automatically.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Stripe Connect"],
    outcome:
      "End-to-end payment flow from viewer tip to creator payout via Stripe Connect split payments",
    // URL is null in developer-profile.md — omit liveUrl
    relevance:
      "Built the same Stripe Connect integration pattern your marketplace payout flow requires.",
  },
  {
    id: "ebay-pokemon",
    title: "eBay Pokemon Monitor",
    description:
      "Real-time eBay Browse API monitoring tool with webhook-based Discord alert delivery and price trend tracking — the same event-driven architecture pattern as Stripe webhooks.",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    outcome:
      "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
    liveUrl: "https://ebay-pokemon-monitor.vercel.app",
    relevance:
      "Event-driven webhook architecture — the same pattern that drives reliable Stripe event handling.",
  },
  {
    id: "finadvise-ag",
    title: "FinAdvise AG",
    description:
      "Financial advisor platform for agricultural succession planning with estate planning tools, portfolio analysis, and secure client data management.",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
    outcome:
      "Specialized advisory platform with succession planning tools, portfolio modeling, and client management in one place",
    liveUrl: "https://finadvise-ag.vercel.app",
    relevance:
      "Financial domain experience — secure data handling and audit-ready data structures.",
  },
];
