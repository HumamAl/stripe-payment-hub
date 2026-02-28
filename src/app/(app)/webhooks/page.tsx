"use client";

import { useState, useMemo } from "react";
import { webhookEvents } from "@/data/mock-data";
import type { WebhookEvent, WebhookEventStatus } from "@/lib/types";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Search, RefreshCw, ChevronRight, AlertCircle } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateEndpoint(url: string, maxLen = 42): string {
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > maxLen ? clean.slice(0, maxLen) + "…" : clean;
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: WebhookEventStatus }) {
  const config: Record<WebhookEventStatus, { label: string; color: "success" | "warning" | "destructive" | "muted" }> = {
    delivered: { label: "Delivered", color: "success" },
    retrying:  { label: "Retrying",  color: "warning" },
    pending:   { label: "Pending",   color: "muted" },
    failed:    { label: "Failed",    color: "destructive" },
  };

  const c = config[status];
  const colorClass = {
    success:     "text-[color:var(--success)] bg-[color:var(--success)]/10",
    warning:     "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    destructive: "text-destructive bg-destructive/10",
    muted:       "text-muted-foreground bg-muted",
  }[c.color];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border-0 rounded-full whitespace-nowrap", colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── RetryBar ────────────────────────────────────────────────────────────────

function RetryBar({ attempts, maxRetries, status }: { attempts: number; maxRetries: number; status: WebhookEventStatus }) {
  const pct = maxRetries > 0 ? Math.round((attempts / maxRetries) * 100) : 0;
  const barColor =
    status === "failed" ? "bg-destructive" :
    status === "retrying" ? "bg-[color:var(--warning)]" :
    "bg-[color:var(--success)]";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-150", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {attempts}/{maxRetries}
      </span>
    </div>
  );
}

// ─── ExpandedRow ─────────────────────────────────────────────────────────────

function ExpandedRow({ event }: { event: WebhookEvent }) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="bg-muted/30 px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Stripe Event ID</p>
            <p className="font-mono text-xs text-foreground truncate">{event.stripeEventId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Full Endpoint URL</p>
            <p className="font-mono text-xs text-foreground break-all">{event.endpoint}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Payload Size</p>
            <p className="font-mono text-xs text-foreground">
              {event.payloadBytes ? `${event.payloadBytes.toLocaleString()} bytes` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Last Attempt</p>
            <p className="font-mono text-xs text-foreground">{formatDate(event.lastAttemptAt)}</p>
          </div>
          {event.nextRetryAt && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Next Retry</p>
              <p className="font-mono text-xs text-[color:var(--warning)]">{formatDate(event.nextRetryAt)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-1">HTTP Response</p>
            <p className={cn(
              "font-mono text-xs",
              event.responseCode === 200 || event.responseCode === 201
                ? "text-[color:var(--success)]"
                : event.responseCode
                ? "text-destructive"
                : "text-muted-foreground"
            )}>
              {event.responseCode ?? "No response"}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Stat summary bar ────────────────────────────────────────────────────────

function SummaryBar({ events }: { events: WebhookEvent[] }) {
  const delivered = events.filter((e) => e.status === "delivered").length;
  const failed = events.filter((e) => e.status === "failed").length;
  const retrying = events.filter((e) => e.status === "retrying").length;
  const pending = events.filter((e) => e.status === "pending").length;
  const total = events.length;
  const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Delivery Rate", value: `${deliveryRate}%`, accent: "success" },
        { label: "Delivered",     value: delivered,           accent: "success" },
        { label: "Failed",        value: failed,              accent: "destructive" },
        { label: "Retrying / Pending", value: retrying + pending, accent: "warning" },
      ].map((stat) => (
        <div
          key={stat.label}
          className="linear-card"
          style={{ padding: "var(--card-padding)" }}
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className={cn(
            "text-xl font-bold font-mono tabular-nums mt-0.5",
            stat.accent === "success" ? "text-[color:var(--success)]" :
            stat.accent === "destructive" ? "text-destructive" :
            stat.accent === "warning" ? "text-[color:var(--warning)]" :
            "text-foreground"
          )}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: WebhookEventStatus; label: string }[] = [
  { value: "delivered", label: "Delivered" },
  { value: "failed",    label: "Failed" },
  { value: "retrying",  label: "Retrying" },
  { value: "pending",   label: "Pending" },
];

export default function WebhooksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WebhookEventStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [retried, setRetried] = useState<Set<string>>(new Set());

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    return webhookEvents.filter((ev) => {
      const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
      const matchesSearch =
        q === "" ||
        ev.type.toLowerCase().includes(q) ||
        ev.endpoint.toLowerCase().includes(q) ||
        ev.stripeEventId.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  function handleRetry(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRetried((prev) => new Set(prev).add(id));
  }

  return (
    <div className="page-container space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webhook Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Event delivery logs, retry attempts, and endpoint health
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Summary stats */}
      <SummaryBar events={webhookEvents} />

      {/* Failed/retrying alert */}
      {webhookEvents.some((e) => e.status === "failed" || e.status === "retrying") && (
        <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">
            {webhookEvents.filter((e) => e.status === "failed").length} webhook deliveries have failed after max retries.
            {" "}Check endpoint availability and Stripe-Signature validation.
          </p>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by event type or endpoint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | WebhookEventStatus)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "event" : "events"}
        </span>
      </div>

      {/* Table */}
      <div className="linear-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Event Type
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground hidden md:table-cell">
                  Endpoint
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Attempts
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground hidden sm:table-cell">
                  Response
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Timestamp
                </TableHead>
                <TableHead className="bg-muted/50 w-24 text-xs font-medium text-muted-foreground" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No webhook events match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((event) => {
                  const isExpanded = expandedId === event.id;
                  const isProblematic = event.status === "failed" || event.status === "retrying";
                  const hasRetried = retried.has(event.id);

                  return (
                    <>
                      <TableRow
                        key={event.id}
                        className={cn(
                          "cursor-pointer transition-colors duration-100",
                          isProblematic && !hasRetried
                            ? "bg-destructive/4 hover:bg-destructive/8"
                            : "hover:bg-[color:var(--surface-hover)]"
                        )}
                        onClick={() => setExpandedId(isExpanded ? null : event.id)}
                      >
                        <TableCell className="font-mono text-xs text-foreground">
                          {event.type}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={hasRetried ? "retrying" : event.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                          {truncateEndpoint(event.endpoint)}
                        </TableCell>
                        <TableCell>
                          <RetryBar
                            attempts={hasRetried ? Math.min(event.attempts + 1, event.maxRetries) : event.attempts}
                            maxRetries={event.maxRetries}
                            status={hasRetried ? "retrying" : event.status}
                          />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className={cn(
                            "font-mono text-xs",
                            event.responseCode === 200 || event.responseCode === 201
                              ? "text-[color:var(--success)]"
                              : event.responseCode
                              ? "text-destructive"
                              : "text-muted-foreground"
                          )}>
                            {event.responseCode ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {formatDate(event.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isProblematic && !hasRetried && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => handleRetry(event.id, e)}
                              >
                                Retry
                              </Button>
                            )}
                            {hasRetried && (
                              <span className="text-xs text-[color:var(--warning)]">Queued</span>
                            )}
                            <ChevronRight
                              className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform duration-100",
                                isExpanded && "rotate-90"
                              )}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && <ExpandedRow event={event} />}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
