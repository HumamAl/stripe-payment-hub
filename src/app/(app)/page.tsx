"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  CreditCard,
  AlertCircle,
  Webhook,
  Activity,
  DollarSign,
  XCircle,
  UserPlus,
  BanknoteIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  dashboardStats,
  monthlyVolumeData,
  volumeByMethod,
  recentActivity,
} from "@/data/mock-data";
import type { ActivityEventType } from "@/lib/types";

// ── Dynamic chart imports (SSR-safe) ──────────────────────────────────────────
const VolumeChart = dynamic(
  () => import("@/components/dashboard/volume-chart").then((m) => ({ default: m.VolumeChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] bg-muted/30 rounded-md animate-pulse" />
    ),
  }
);

const MethodChart = dynamic(
  () => import("@/components/dashboard/method-chart").then((m) => ({ default: m.MethodChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 rounded-md animate-pulse" />
    ),
  }
);

// ── useCountUp hook ───────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ── Stat card data ────────────────────────────────────────────────────────────
type PeriodKey = "7d" | "30d" | "90d";

const periodMultiplier: Record<PeriodKey, number> = {
  "7d": 0.23,
  "30d": 1,
  "90d": 3.1,
};

// ── Activity icon/color map ───────────────────────────────────────────────────
function getActivityMeta(type: ActivityEventType) {
  switch (type) {
    case "payment_succeeded":
      return {
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        color: "text-[color:var(--success)]",
        bg: "bg-[color:var(--success)]/10",
      };
    case "payment_failed":
      return {
        icon: <XCircle className="h-3.5 w-3.5" />,
        color: "text-destructive",
        bg: "bg-destructive/10",
      };
    case "dispute_opened":
      return {
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        color: "text-[color:var(--warning)]",
        bg: "bg-[color:var(--warning)]/10",
      };
    case "refund_issued":
      return {
        icon: <TrendingDown className="h-3.5 w-3.5" />,
        color: "text-muted-foreground",
        bg: "bg-muted/50",
      };
    case "webhook_failed":
      return {
        icon: <Webhook className="h-3.5 w-3.5" />,
        color: "text-[color:var(--warning)]",
        bg: "bg-[color:var(--warning)]/10",
      };
    case "new_customer":
      return {
        icon: <UserPlus className="h-3.5 w-3.5" />,
        color: "text-primary",
        bg: "bg-primary/10",
      };
    case "payout_completed":
      return {
        icon: <BanknoteIcon className="h-3.5 w-3.5" />,
        color: "text-[color:var(--success)]",
        bg: "bg-[color:var(--success)]/10",
      };
    case "card_expired":
      return {
        icon: <CreditCard className="h-3.5 w-3.5" />,
        color: "text-muted-foreground",
        bg: "bg-muted/50",
      };
  }
}

function formatRelativeTime(isoDate: string): string {
  const now = new Date("2026-02-27T12:00:00Z");
  const then = new Date(isoDate);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ── Animated KPI card ─────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  rawValue: number;
  displayValue: string;
  change: number;
  description: string;
  icon: React.ReactNode;
  index: number;
  invertChange?: boolean;
}

function StatCard({
  title,
  rawValue,
  displayValue,
  change,
  description,
  icon,
  index,
  invertChange = false,
}: StatCardProps) {
  const { count, ref } = useCountUp(rawValue, 1000 + index * 80);
  const isPositive = invertChange ? change < 0 : change > 0;
  const absChange = Math.abs(change);

  // Format count same way as displayValue
  const formattedCount = useMemo(() => {
    if (displayValue.startsWith("$")) {
      if (count >= 1000) return `$${(count / 1000).toFixed(1)}k`;
      return `$${count.toFixed(2)}`;
    }
    if (displayValue.endsWith("%")) return `${(count / 100).toFixed(1)}%`;
    return count.toLocaleString();
  }, [count, displayValue]);

  // Once countUp finishes, show the real displayValue
  const isFinished = count === rawValue;

  return (
    <div
      ref={ref}
      className="linear-card animate-fade-up-in"
      style={{
        padding: "var(--card-padding)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </p>
        <span className="text-muted-foreground/60">{icon}</span>
      </div>
      <p className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {isFinished ? displayValue : formattedCount}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-[color:var(--success)]" />
        ) : (
          <TrendingDown className="h-3 w-3 text-destructive" />
        )}
        <span
          className={cn(
            "text-xs font-mono font-medium",
            isPositive ? "text-[color:var(--success)]" : "text-destructive"
          )}
        >
          {isPositive ? "+" : "-"}{absChange}%
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

// ── Main dashboard page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodKey>("30d");

  const chartData = useMemo(() => {
    if (period === "7d") return monthlyVolumeData.slice(-2);
    if (period === "30d") return monthlyVolumeData.slice(-6);
    return monthlyVolumeData;
  }, [period]);

  const mult = periodMultiplier[period];
  const stats = useMemo(
    () => [
      {
        title: "Payment Volume",
        rawValue: Math.round(dashboardStats.totalPaymentVolume * mult),
        displayValue: `$${(dashboardStats.totalPaymentVolume * mult / 1000).toFixed(1)}k`,
        change: dashboardStats.paymentVolumeChange,
        description: `· gross processed`,
        icon: <DollarSign className="h-4 w-4" />,
        invertChange: false,
      },
      {
        title: "Success Rate",
        rawValue: Math.round(dashboardStats.successRate * 10),
        displayValue: `${dashboardStats.successRate}%`,
        change: dashboardStats.successRateChange,
        description: `· ${Math.round(dashboardStats.successRate * 13.88)} captured today`,
        icon: <CheckCircle className="h-4 w-4" />,
        invertChange: false,
      },
      {
        title: "Open Disputes",
        rawValue: dashboardStats.openDisputes,
        displayValue: `${dashboardStats.openDisputes}`,
        change: dashboardStats.disputesChange,
        description: `· 0.62% dispute rate`,
        icon: <AlertTriangle className="h-4 w-4" />,
        invertChange: true,
      },
      {
        title: "Webhook Delivery",
        rawValue: Math.round(dashboardStats.webhookDeliveryRate * 10),
        displayValue: `${dashboardStats.webhookDeliveryRate}%`,
        change: dashboardStats.webhookDeliveryRateChange,
        description: `· 3 endpoints failing`,
        icon: <Zap className="h-4 w-4" />,
        invertChange: false,
      },
      {
        title: "Avg Transaction",
        rawValue: Math.round(dashboardStats.avgTransactionValue * 100),
        displayValue: `$${dashboardStats.avgTransactionValue.toFixed(2)}`,
        change: dashboardStats.avgTransactionValueChange,
        description: `· per payment intent`,
        icon: <Activity className="h-4 w-4" />,
        invertChange: false,
      },
      {
        title: "Failed Transactions",
        rawValue: Math.round(dashboardStats.failedTransactions * mult),
        displayValue: `${Math.round(dashboardStats.failedTransactions * mult)}`,
        change: dashboardStats.failedTransactionsChange,
        description: `· 3 decline codes`,
        icon: <XCircle className="h-4 w-4" />,
        invertChange: true,
      },
    ],
    [mult]
  );

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live transaction health, volume trends, and webhook delivery status
          </p>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                "duration-100",
                period === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            index={index}
            title={stat.title}
            rawValue={stat.rawValue}
            displayValue={stat.displayValue}
            change={stat.change}
            description={stat.description}
            icon={stat.icon}
            invertChange={stat.invertChange}
          />
        ))}
      </div>

      {/* ── Charts Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Primary: Gross + Net Volume trend */}
        <div className="linear-card lg:col-span-2" style={{ padding: "var(--card-padding)" }}>
          <div className="mb-4">
            <h2 className="text-base font-semibold">Payment Volume Trend</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gross vs. net volume after processing fees · {period === "7d" ? "Last 7 days" : period === "30d" ? "Last 6 months" : "Last 12 months"}
            </p>
          </div>
          <VolumeChart data={chartData} />
        </div>

        {/* Secondary: Volume by payment method */}
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <div className="mb-4">
            <h2 className="text-base font-semibold">Volume by Method</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gross volume per payment instrument
            </p>
          </div>
          <MethodChart data={volumeByMethod} />
          {/* Method share legend */}
          <div className="mt-3 space-y-1.5">
            {volumeByMethod.slice(0, 3).map((m) => (
              <div key={m.method} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{m.method}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${m.share * 0.8}px`,
                      backgroundColor: "var(--chart-1)",
                      opacity: 0.4 + m.share / 100,
                    }}
                  />
                  <span className="text-xs font-mono font-medium text-foreground">
                    {m.share}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity Feed ─────────────────────────────── */}
      <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold">Recent Activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest payment events across all integrations
            </p>
          </div>
          <a
            href="/transactions"
            className="text-xs text-primary hover:text-primary/80 transition-colors duration-100 font-medium"
          >
            View all →
          </a>
        </div>

        <div className="space-y-0.5">
          {recentActivity.map((event, i) => {
            const meta = getActivityMeta(event.type);
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 px-2 py-2.5 rounded-md transition-colors duration-100 hover:bg-muted/40 animate-fade-up-in"
                style={{
                  animationDelay: `${i * 40 + 300}ms`,
                  animationDuration: "150ms",
                }}
              >
                {/* Icon */}
                <span
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full shrink-0",
                    meta.bg,
                    meta.color
                  )}
                >
                  {meta.icon}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {event.subtitle}
                  </p>
                </div>

                {/* Amount + timestamp */}
                <div className="text-right shrink-0">
                  {event.amount !== undefined && (
                    <p className="text-sm font-mono font-medium text-foreground">
                      {event.currency === "usd" ? "$" : event.currency?.toUpperCase() + " "}
                      {event.amount.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(event.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Compliance Snapshot ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="linear-card flex items-center gap-3" style={{ padding: "var(--card-padding-sm, 1rem)" }}>
          <span className="flex items-center justify-center w-9 h-9 rounded-md bg-[color:var(--success)]/10 shrink-0">
            <CheckCircle className="h-4 w-4 text-[color:var(--success)]" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">PCI DSS</p>
            <p className="text-sm font-semibold">SAQ-D Passed</p>
            <p className="text-xs text-muted-foreground">Next review Nov 2026</p>
          </div>
        </div>
        <div className="linear-card flex items-center gap-3" style={{ padding: "var(--card-padding-sm, 1rem)" }}>
          <span className="flex items-center justify-center w-9 h-9 rounded-md bg-[color:var(--warning)]/10 shrink-0">
            <AlertTriangle className="h-4 w-4 text-[color:var(--warning)]" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Webhook Signatures</p>
            <p className="text-sm font-semibold">3 of 7 Unverified</p>
            <p className="text-xs text-muted-foreground">Remediation in progress</p>
          </div>
        </div>
        <div className="linear-card flex items-center gap-3" style={{ padding: "var(--card-padding-sm, 1rem)" }}>
          <span className="flex items-center justify-center w-9 h-9 rounded-md bg-destructive/10 shrink-0">
            <XCircle className="h-4 w-4 text-destructive" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Idempotency Keys</p>
            <p className="text-sm font-semibold">11% Missing</p>
            <p className="text-xs text-muted-foreground">ENG-4421 open</p>
          </div>
        </div>
      </div>

      {/* ── Proposal Banner ──────────────────────────────────── */}
      <div className="linear-card p-4 border-primary/15 bg-gradient-to-r from-primary/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">
            This is a live demo built for{" "}
            <span className="text-primary font-semibold">
              {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-100"
          >
            My approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors duration-100"
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
