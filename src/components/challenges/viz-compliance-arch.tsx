// NO "use client" — pure JSX, no hooks

import {
  ShieldCheck,
  Database,
  FileSearch,
  ScanLine,
  FileLock2,
  Scale,
} from "lucide-react";

interface ArchLayer {
  label: string;
  category: string;
  description: string;
  icon: React.ElementType;
  type: "pci" | "regulatory" | "audit" | "infra";
}

const LAYERS: ArchLayer[] = [
  {
    label: "PCI DSS Scope Control",
    category: "PCI DSS",
    description: "Stripe.js card tokenization — card data never touches your server",
    icon: FileLock2,
    type: "pci",
  },
  {
    label: "SCA / 3DS Authentication",
    category: "PSD2 / SCA",
    description: "PaymentIntent confirmations with 3D Secure challenge flow",
    icon: ShieldCheck,
    type: "regulatory",
  },
  {
    label: "Transaction Audit Log",
    category: "Audit Trail",
    description: "Immutable log: amount, currency, PI ID, customer, timestamps",
    icon: Database,
    type: "audit",
  },
  {
    label: "AML Monitoring Hooks",
    category: "AML",
    description: "Velocity rules: flag transactions >$10k or >5 per hour per customer",
    icon: ScanLine,
    type: "regulatory",
  },
  {
    label: "Settlement Reconciliation",
    category: "Finance",
    description: "Auto-match Stripe payouts against captured charges daily",
    icon: Scale,
    type: "infra",
  },
  {
    label: "Compliance Reporting",
    category: "Reporting",
    description: "Exportable audit trail for SAR filings and external review",
    icon: FileSearch,
    type: "audit",
  },
];

const typeStyle: Record<
  ArchLayer["type"],
  { bg: string; border: string; label: string }
> = {
  pci: {
    bg: "color-mix(in oklch, var(--primary) 8%, transparent)",
    border: "color-mix(in oklch, var(--primary) 25%, transparent)",
    label: "color-mix(in oklch, var(--primary) 80%, var(--foreground))",
  },
  regulatory: {
    bg: "color-mix(in oklch, var(--warning) 8%, transparent)",
    border: "color-mix(in oklch, var(--warning) 25%, transparent)",
    label: "color-mix(in oklch, var(--warning) 70%, var(--foreground))",
  },
  audit: {
    bg: "color-mix(in oklch, var(--success) 8%, transparent)",
    border: "color-mix(in oklch, var(--success) 20%, transparent)",
    label: "color-mix(in oklch, var(--success) 70%, var(--foreground))",
  },
  infra: {
    bg: "color-mix(in oklch, var(--border) 30%, transparent)",
    border: "color-mix(in oklch, var(--border) 60%, transparent)",
    label: "var(--muted-foreground)",
  },
};

export function VizComplianceArch() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {LAYERS.map((layer) => {
        const style = typeStyle[layer.type];
        return (
          <div
            key={layer.label}
            className="rounded-lg border p-3 space-y-1"
            style={{
              backgroundColor: style.bg,
              borderColor: style.border,
            }}
          >
            <div className="flex items-center gap-2">
              <layer.icon
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: style.label }}
              />
              <span className="text-xs font-medium">{layer.label}</span>
            </div>
            <span
              className="text-[10px] font-mono font-medium tracking-wide uppercase"
              style={{ color: style.label }}
            >
              {layer.category}
            </span>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {layer.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
