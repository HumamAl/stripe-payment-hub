"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Globe,
  Zap,
  Webhook,
  CheckCircle2,
  Lock,
  ArrowRight,
  TriangleAlert,
} from "lucide-react";

interface FlowStep {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  highlight?: boolean;
  security?: string;
}

const STEPS: FlowStep[] = [
  {
    id: "client",
    label: "Client App",
    sublabel: "Stripe.js tokenization",
    icon: Globe,
    security: "TLS 1.2+",
  },
  {
    id: "intent",
    label: "PaymentIntent",
    sublabel: "Idempotency key required",
    icon: Zap,
    highlight: true,
    security: "Server-side",
  },
  {
    id: "stripe",
    label: "Stripe API",
    sublabel: "Gateway validation",
    icon: ShieldCheck,
    highlight: true,
    security: "Signed",
  },
  {
    id: "webhook",
    label: "Webhook",
    sublabel: "HMAC-SHA256 verify",
    icon: Webhook,
    highlight: true,
    security: "sig_verified",
  },
  {
    id: "settle",
    label: "Settlement",
    sublabel: "Audit record written",
    icon: CheckCircle2,
    security: "PCI DSS",
  },
];

const SECURITY_CHECKS = [
  { label: "TLS enforced on all endpoints", ok: true },
  { label: "Publishable key via env variable only", ok: true },
  { label: "Webhook signature HMAC verification", ok: true },
  { label: "Idempotency key on every PaymentIntent", ok: true },
  { label: "Secret key exposed in client bundle", ok: false },
  { label: "Unvalidated webhook payload accepted", ok: false },
];

export function VizGatewayFlow() {
  const [showChecks, setShowChecks] = useState(false);

  return (
    <div className="space-y-4">
      {/* Flow row */}
      <div className="flex flex-wrap items-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className="flex flex-col gap-0.5 rounded-lg border px-3 py-2 min-w-[100px]"
              style={
                step.highlight
                  ? {
                      borderColor:
                        "color-mix(in oklch, var(--primary) 30%, transparent)",
                      backgroundColor:
                        "color-mix(in oklch, var(--primary) 8%, transparent)",
                    }
                  : {
                      borderColor:
                        "color-mix(in oklch, var(--border) 60%, transparent)",
                      backgroundColor: "var(--card)",
                    }
              }
            >
              <div className="flex items-center gap-1.5">
                <step.icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={
                    step.highlight
                      ? { color: "var(--primary)" }
                      : { color: "var(--muted-foreground)" }
                  }
                />
                <span className="text-xs font-medium">{step.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground pl-5">
                {step.sublabel}
              </span>
              {step.security && (
                <span
                  className="text-[9px] font-mono pl-5 mt-0.5"
                  style={{ color: "var(--success)" }}
                >
                  {step.security}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      {/* Toggle security checklist */}
      <div>
        <button
          onClick={() => setShowChecks((v) => !v)}
          className="text-xs font-medium transition-colors duration-100 flex items-center gap-1.5"
          style={{ color: "var(--primary)" }}
        >
          <Lock className="w-3 h-3" />
          {showChecks ? "Hide" : "Show"} security checkpoint validation
        </button>

        {showChecks && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SECURITY_CHECKS.map((check) => (
              <div key={check.label} className="flex items-start gap-2">
                {check.ok ? (
                  <CheckCircle2
                    className="w-3.5 h-3.5 mt-0.5 shrink-0"
                    style={{ color: "var(--success)" }}
                  />
                ) : (
                  <TriangleAlert className="w-3.5 h-3.5 mt-0.5 shrink-0 text-destructive" />
                )}
                <span
                  className="text-xs"
                  style={{
                    color: check.ok
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
