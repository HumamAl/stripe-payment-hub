"use client";

import { useState } from "react";

interface MetricRow {
  label: string;
  before: number;
  after: number;
  unit: string;
  higherIsBetter: boolean;
}

const METRICS: MetricRow[] = [
  {
    label: "Event delivery rate",
    before: 68,
    after: 99.4,
    unit: "%",
    higherIsBetter: true,
  },
  {
    label: "Duplicate events processed",
    before: 12,
    after: 0.2,
    unit: "%",
    higherIsBetter: false,
  },
  {
    label: "Failed deliveries detected",
    before: 18,
    after: 100,
    unit: "%",
    higherIsBetter: true,
  },
  {
    label: "Avg retry lag",
    before: 900,
    after: 30,
    unit: "s",
    higherIsBetter: false,
  },
];

export function VizWebhookMetrics() {
  const [view, setView] = useState<"polling" | "webhooks">("polling");

  const isWebhooks = view === "webhooks";

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div
        className="inline-flex rounded-lg p-0.5 gap-0.5"
        style={{
          backgroundColor:
            "color-mix(in oklch, var(--border) 40%, transparent)",
        }}
      >
        {(["polling", "webhooks"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-100"
            style={
              view === v
                ? {
                    backgroundColor: "var(--card)",
                    color: "var(--foreground)",
                    boxShadow: "0 1px 2px oklch(0 0 0 / 0.08)",
                  }
                : { color: "var(--muted-foreground)" }
            }
          >
            {v === "polling" ? "Ad-hoc Polling" : "Webhook + Idempotency"}
          </button>
        ))}
      </div>

      {/* Metric bars */}
      <div className="space-y-3">
        {METRICS.map((m) => {
          const current = isWebhooks ? m.after : m.before;
          const max =
            m.unit === "s"
              ? 900
              : m.unit === "%"
                ? 100
                : Math.max(m.before, m.after);
          const pct = Math.min((current / max) * 100, 100);

          const isGood = m.higherIsBetter ? current >= m.after : current <= m.after;
          const barColor = isGood
            ? "var(--success)"
            : "var(--destructive)";

          return (
            <div key={m.label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{m.label}</span>
                <span
                  className="font-mono font-medium tabular-nums"
                  style={{ color: isGood ? "var(--success)" : "var(--destructive)" }}
                >
                  {current}
                  {m.unit}
                </span>
              </div>
              <div
                className="h-2 rounded-full"
                style={{
                  backgroundColor:
                    "color-mix(in oklch, var(--border) 50%, transparent)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground">
        {isWebhooks
          ? "Stripe-signed webhooks with idempotency keys + exponential backoff retry queue"
          : "Status polling every 60s — misses failed retries, no duplicate protection"}
      </p>
    </div>
  );
}
