"use client";

import { useState, useMemo } from "react";
import { complianceChecks } from "@/data/mock-data";
import type { ComplianceCheck, ComplianceStatus, ComplianceCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ComplianceStatus }) {
  const config: Record<ComplianceStatus, { label: string; colorClass: string }> = {
    passed:         { label: "Passed",         colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10" },
    warning:        { label: "Warning",        colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10" },
    failed:         { label: "Failed",         colorClass: "text-destructive bg-destructive/10" },
    pending:        { label: "Pending",        colorClass: "text-muted-foreground bg-muted" },
    not_applicable: { label: "N/A",            colorClass: "text-muted-foreground bg-muted" },
  };

  const c = config[status];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border-0 rounded-full whitespace-nowrap", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── StatusIcon ───────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: ComplianceStatus }) {
  if (status === "passed") return <ShieldCheck className="w-5 h-5 text-[color:var(--success)] shrink-0" />;
  if (status === "warning") return <ShieldAlert className="w-5 h-5 text-[color:var(--warning)] shrink-0" />;
  if (status === "failed") return <ShieldX className="w-5 h-5 text-destructive shrink-0" />;
  return <Clock className="w-5 h-5 text-muted-foreground shrink-0" />;
}

// ─── Score overview ───────────────────────────────────────────────────────────

function ComplianceScoreBar({ checks }: { checks: ComplianceCheck[] }) {
  const passed  = checks.filter((c) => c.status === "passed").length;
  const warning = checks.filter((c) => c.status === "warning").length;
  const failed  = checks.filter((c) => c.status === "failed").length;
  const pending = checks.filter((c) => c.status === "pending").length;
  const total   = checks.length;

  const passPct    = total > 0 ? (passed  / total) * 100 : 0;
  const warnPct    = total > 0 ? (warning / total) * 100 : 0;
  const failPct    = total > 0 ? (failed  / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;

  const overallScore = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Compliance Score</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {passed} of {total} checks passing
          </p>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-3xl font-bold font-mono tabular-nums",
            overallScore >= 80 ? "text-[color:var(--success)]" :
            overallScore >= 60 ? "text-[color:var(--warning)]" :
            "text-destructive"
          )}>
            {overallScore}%
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">overall</p>
        </div>
      </div>

      {/* Stacked progress bar */}
      <div className="h-2.5 rounded-full overflow-hidden flex bg-muted">
        {passPct > 0 && (
          <div
            className="h-full bg-[color:var(--success)] transition-all duration-150"
            style={{ width: `${passPct}%` }}
          />
        )}
        {warnPct > 0 && (
          <div
            className="h-full bg-[color:var(--warning)] transition-all duration-150"
            style={{ width: `${warnPct}%` }}
          />
        )}
        {failPct > 0 && (
          <div
            className="h-full bg-destructive transition-all duration-150"
            style={{ width: `${failPct}%` }}
          />
        )}
        {pendingPct > 0 && (
          <div
            className="h-full bg-muted-foreground/30 transition-all duration-150"
            style={{ width: `${pendingPct}%` }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {[
          { label: "Passed",  count: passed,  color: "bg-[color:var(--success)]" },
          { label: "Warning", count: warning, color: "bg-[color:var(--warning)]" },
          { label: "Failed",  count: failed,  color: "bg-destructive" },
          { label: "Pending", count: pending, color: "bg-muted-foreground/30" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={cn("w-2 h-2 rounded-full", item.color)} />
            <span>{item.label}: {item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Check card ───────────────────────────────────────────────────────────────

function CheckCard({
  check,
  expanded,
  onToggle,
}: {
  check: ComplianceCheck;
  expanded: boolean;
  onToggle: () => void;
}) {
  const reviewDays = check.nextReviewAt ? daysUntil(check.nextReviewAt) : null;
  const reviewUrgent = reviewDays !== null && reviewDays <= 14;

  return (
    <div
      className={cn(
        "linear-card overflow-hidden transition-all duration-100",
        check.status === "failed"  && "border-destructive/30 bg-destructive/4",
        check.status === "warning" && "border-[color:var(--warning)]/30 bg-[color:var(--warning)]/4"
      )}
    >
      {/* Header row */}
      <button
        className="w-full flex items-start gap-3 text-left hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
        style={{ padding: "var(--card-padding)" }}
        onClick={onToggle}
      >
        <StatusIcon status={check.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{check.checkName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{check.category}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={check.status} />
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">
              Last assessed: {formatDate(check.lastChecked)}
            </span>
            {check.nextReviewAt && (
              <span className={cn(
                "text-xs font-mono",
                reviewUrgent ? "text-[color:var(--warning)]" : "text-muted-foreground"
              )}>
                {reviewUrgent && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                Review due: {formatDate(check.nextReviewAt)}
                {reviewDays !== null && reviewDays <= 30 && (
                  <span className="ml-1">({reviewDays}d)</span>
                )}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="border-t border-border/40 bg-muted/20"
          style={{ padding: "var(--card-padding)" }}
        >
          <p className="text-sm text-foreground/80 leading-relaxed">{check.details}</p>

          {/* Action hints for non-passed checks */}
          {check.status !== "passed" && (
            <div className="mt-3 flex items-start gap-2">
              {check.status === "failed" ? (
                <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              ) : check.status === "warning" ? (
                <AlertTriangle className="w-4 h-4 text-[color:var(--warning)] mt-0.5 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <p className="text-xs text-muted-foreground">
                {check.status === "failed"
                  ? "Remediation required before next audit. Assign to engineering team."
                  : check.status === "warning"
                  ? "Monitor closely. Remediation recommended within 14 days."
                  : "Pending configuration — no action required yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Category group ───────────────────────────────────────────────────────────

function CategoryGroup({
  category,
  checks,
  expandedId,
  onToggle,
}: {
  category: ComplianceCategory;
  checks: ComplianceCheck[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  const passed = checks.filter((c) => c.status === "passed").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {category}
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {passed}/{checks.length} passing
        </span>
      </div>
      <div className="space-y-2">
        {checks.map((check) => (
          <CheckCard
            key={check.id}
            check={check}
            expanded={expandedId === check.id}
            onToggle={() => onToggle(check.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const CATEGORY_ORDER: ComplianceCategory[] = [
  "PCI DSS",
  "Data Security",
  "SCA / 3DS",
  "Fraud Prevention",
  "Regulatory",
  "AML",
];

export default function CompliancePage() {
  const [statusFilter, setStatusFilter] = useState<"all" | ComplianceStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ComplianceCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const filtered = useMemo(() => {
    return complianceChecks.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
      return matchesStatus && matchesCategory;
    });
  }, [statusFilter, categoryFilter]);

  // Group by category in order
  const grouped = useMemo(() => {
    const map: Partial<Record<ComplianceCategory, ComplianceCheck[]>> = {};
    for (const check of filtered) {
      if (!map[check.category]) map[check.category] = [];
      map[check.category]!.push(check);
    }
    return CATEGORY_ORDER.filter((cat) => map[cat] && map[cat]!.length > 0).map(
      (cat) => ({ category: cat, checks: map[cat]! })
    );
  }, [filtered]);

  const categories = useMemo(
    () => [...new Set(complianceChecks.map((c) => c.category))],
    []
  );

  // Critical alerts count
  const failedCount = complianceChecks.filter((c) => c.status === "failed").length;
  const warningCount = complianceChecks.filter((c) => c.status === "warning").length;

  return (
    <div className="page-container space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            PCI DSS, SCA, fraud prevention, and regulatory status
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-3.5 h-3.5" />
          Export Report
        </Button>
      </div>

      {/* Score bar */}
      <ComplianceScoreBar checks={complianceChecks} />

      {/* Critical alert banners */}
      {failedCount > 0 && (
        <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">
            <span className="font-semibold">{failedCount} check{failedCount > 1 ? "s" : ""} failed.</span>{" "}
            Immediate remediation required to maintain compliance posture. Assign to engineering.
          </p>
        </div>
      )}
      {warningCount > 0 && (
        <div className="flex items-start gap-3 rounded-md border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/5 px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-[color:var(--warning)] mt-0.5 shrink-0" />
          <p className="text-sm text-[color:var(--warning)]">
            <span className="font-semibold">{warningCount} check{warningCount > 1 ? "s" : ""} require attention.</span>{" "}
            Review within 14 days to prevent escalation.
          </p>
        </div>
      )}
      {failedCount === 0 && warningCount === 0 && (
        <div className="flex items-start gap-3 rounded-md border border-[color:var(--success)]/30 bg-[color:var(--success)]/5 px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-[color:var(--success)] mt-0.5 shrink-0" />
          <p className="text-sm text-[color:var(--success)]">
            All critical checks passing. Compliance posture is healthy.
          </p>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | ComplianceStatus)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as "all" | ComplianceCategory)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "check" : "checks"}
        </span>
      </div>

      {/* Grouped checks */}
      {grouped.length === 0 ? (
        <div className="linear-card flex items-center justify-center h-40 text-sm text-muted-foreground">
          No compliance checks match this filter.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ category, checks }) => (
            <CategoryGroup
              key={category}
              category={category}
              checks={checks}
              expandedId={expandedId}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
