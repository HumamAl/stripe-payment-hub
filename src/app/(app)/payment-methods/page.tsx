"use client";

import { useState, useMemo } from "react";
import { paymentMethods, customers } from "@/data/mock-data";
import type { PaymentMethod, PaymentMethodStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Search, CreditCard, Building2, Star, AlertTriangle } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatExpiry(month?: number, year?: number): string {
  if (!month || !year) return "—";
  return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
}

function isExpired(month?: number, year?: number): boolean {
  if (!month || !year) return false;
  const now = new Date();
  const expiry = new Date(year, month - 1, 1);
  return expiry < new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Brand icon ──────────────────────────────────────────────────────────────

function BrandIcon({ type, brand }: { type: string; brand?: string }) {
  const brandColors: Record<string, string> = {
    visa:       "bg-blue-600 text-white",
    mastercard: "bg-orange-600 text-white",
    amex:       "bg-sky-700 text-white",
    discover:   "bg-amber-600 text-white",
    diners:     "bg-gray-700 text-white",
    unionpay:   "bg-red-700 text-white",
  };

  const label =
    brand === "visa" ? "VISA" :
    brand === "mastercard" ? "MC" :
    brand === "amex" ? "AMEX" :
    brand === "discover" ? "DISC" :
    type === "sepa_debit" ? "SEPA" :
    type === "us_bank_account" ? "ACH" :
    "CARD";

  const colorClass =
    brand && brandColors[brand] ? brandColors[brand] : "bg-muted text-muted-foreground";

  return (
    <div
      className={cn(
        "w-10 h-7 rounded flex items-center justify-center text-[10px] font-bold tracking-widest shrink-0",
        colorClass
      )}
    >
      {label}
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PaymentMethodStatus }) {
  const config: Record<PaymentMethodStatus, { label: string; colorClass: string }> = {
    active:   { label: "Active",    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10" },
    expired:  { label: "Expired",   colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10" },
    detached: { label: "Detached",  colorClass: "text-muted-foreground bg-muted" },
  };

  const c = config[status];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border-0 rounded-full", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── PaymentMethodCard ────────────────────────────────────────────────────────

function PaymentMethodCard({ pm }: { pm: PaymentMethod }) {
  const customer = customers.find((c) => c.id === pm.customerId);
  const expired = isExpired(pm.expiryMonth, pm.expiryYear);
  const isCard = pm.type === "card";

  return (
    <Card
      className={cn(
        "linear-card transition-all duration-100",
        expired ? "border-[color:var(--warning)]/40 bg-[color:var(--warning)]/4" : "hover:border-primary/30"
      )}
    >
      <CardHeader className="pb-3" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <BrandIcon type={pm.type} brand={pm.brand} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold">
                  {pm.brand ? pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1) : pm.type === "sepa_debit" ? "SEPA Debit" : "Bank Account"}
                  {" "}···· {pm.last4}
                </span>
                {pm.isDefault && (
                  <Star className="w-3 h-3 text-primary fill-primary" />
                )}
              </div>
              {isCard && (
                <p className={cn(
                  "text-xs font-mono mt-0.5",
                  expired ? "text-[color:var(--warning)]" : "text-muted-foreground"
                )}>
                  {expired && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                  Exp {formatExpiry(pm.expiryMonth, pm.expiryYear)}
                  {expired && " — Expired"}
                </p>
              )}
            </div>
          </div>
          <StatusBadge status={expired ? "expired" : pm.status} />
        </div>
      </CardHeader>
      <CardContent style={{ paddingTop: 0, paddingLeft: "var(--card-padding)", paddingRight: "var(--card-padding)", paddingBottom: "var(--card-padding)" }}>
        <div className="border-t border-border/40 pt-3 space-y-2">
          {/* Customer */}
          <div className="flex items-center gap-2">
            {pm.type === "card" ? (
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            ) : (
              <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{customer?.name ?? "Unknown"}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{customer?.email ?? "—"}</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {pm.billingZip ? (
              <span>ZIP {pm.billingZip}</span>
            ) : (
              <span className="italic">No billing ZIP</span>
            )}
            <span className="font-mono">Added {formatDate(pm.createdAt)}</span>
          </div>

          {/* Stripe PM ID */}
          <p className="text-[10px] font-mono text-muted-foreground/60 truncate">
            {pm.stripePaymentMethodId}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

type FilterType = "all" | "card" | "bank";

export default function PaymentMethodsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentMethodStatus>("all");

  const customerMap = useMemo(
    () => Object.fromEntries(customers.map((c) => [c.id, c])),
    []
  );

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    return paymentMethods.filter((pm) => {
      const customer = customerMap[pm.customerId];
      const expired = isExpired(pm.expiryMonth, pm.expiryYear);
      const effectiveStatus: PaymentMethodStatus = expired ? "expired" : pm.status;

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "card" && pm.type === "card") ||
        (typeFilter === "bank" && (pm.type === "sepa_debit" || pm.type === "us_bank_account"));

      const matchesStatus = statusFilter === "all" || effectiveStatus === statusFilter;

      const matchesSearch =
        q === "" ||
        (pm.brand ?? "").toLowerCase().includes(q) ||
        pm.last4.includes(q) ||
        customer?.name.toLowerCase().includes(q) ||
        customer?.email.toLowerCase().includes(q);

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [search, typeFilter, statusFilter, customerMap]);

  const expiredCount = paymentMethods.filter((pm) =>
    isExpired(pm.expiryMonth, pm.expiryYear)
  ).length;

  return (
    <div className="page-container space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Saved cards, bank accounts, and SEPA mandates
          </p>
        </div>
        <div className="flex items-center gap-2">
          {expiredCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[color:var(--warning)] bg-[color:var(--warning)]/10 rounded-md px-2.5 py-1.5 border border-[color:var(--warning)]/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              {expiredCount} expired
            </div>
          )}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Instruments", value: paymentMethods.length },
          { label: "Cards on File",     value: paymentMethods.filter((p) => p.type === "card").length },
          { label: "Bank Accounts",     value: paymentMethods.filter((p) => p.type !== "card").length },
          { label: "Expired",           value: expiredCount },
        ].map((s) => (
          <div
            key={s.label}
            className="linear-card"
            style={{ padding: "var(--card-padding)" }}
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold font-mono tabular-nums mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, brand, or last 4..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as FilterType)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="card">Cards</SelectItem>
            <SelectItem value="bank">Bank Accounts</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | PaymentMethodStatus)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="detached">Detached</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "instrument" : "instruments"}
        </span>
      </div>

      {/* Card grid */}
      {displayed.length === 0 ? (
        <div className="linear-card flex items-center justify-center h-40 text-sm text-muted-foreground">
          No payment instruments match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((pm) => (
            <PaymentMethodCard key={pm.id} pm={pm} />
          ))}
        </div>
      )}
    </div>
  );
}
