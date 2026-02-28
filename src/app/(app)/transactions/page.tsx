"use client";

import { useState, useMemo } from "react";
import { transactions, customers } from "@/data/mock-data";
import type { Transaction, TransactionStatus } from "@/lib/types";
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
import {
  Search,
  ChevronUp,
  ChevronDown,
  Download,
  ChevronRight,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(cents: number, currency: string): string {
  const symbol = currency === "eur" ? "€" : currency === "gbp" ? "£" : currency === "cad" ? "CA$" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config: Record<TransactionStatus, { label: string; color: "success" | "warning" | "destructive" | "muted" }> = {
    succeeded:          { label: "Succeeded",        color: "success" },
    processing:         { label: "Processing",       color: "warning" },
    requires_capture:   { label: "Requires Capture", color: "warning" },
    requires_action:    { label: "Requires Action",  color: "warning" },
    failed:             { label: "Failed",           color: "destructive" },
    refunded:           { label: "Refunded",         color: "muted" },
    partially_refunded: { label: "Partial Refund",   color: "warning" },
    disputed:           { label: "Disputed",         color: "destructive" },
    canceled:           { label: "Canceled",         color: "muted" },
  };

  const c = config[status] ?? { label: status, color: "muted" as const };

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

// ─── PaymentMethodLabel ───────────────────────────────────────────────────────

function PaymentMethodLabel({ txn }: { txn: Transaction }) {
  const pm = txn.paymentMethod;
  const brandLabel = pm.brand ? capitalizeFirst(pm.brand) : pm.type === "sepa_debit" ? "SEPA" : "Bank";
  return (
    <span className="font-mono text-xs">
      {brandLabel} ···{pm.last4}
    </span>
  );
}

// ─── ExpandedRow ─────────────────────────────────────────────────────────────

function ExpandedRow({ txn }: { txn: Transaction }) {
  const customer = customers.find((c) => c.id === txn.customerId);
  return (
    <TableRow>
      <TableCell colSpan={7} className="bg-muted/30 px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Payment Intent ID</p>
            <p className="font-mono text-xs text-foreground truncate">{txn.paymentIntentId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Customer Email</p>
            <p className="font-mono text-xs text-foreground truncate">{customer?.email ?? "—"}</p>
          </div>
          {txn.netAmountCents !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Net After Fees</p>
              <p className="font-mono text-xs text-foreground">
                {formatAmount(txn.netAmountCents, txn.currency)}
              </p>
            </div>
          )}
          {txn.declineCode && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Decline Code</p>
              <p className="font-mono text-xs text-destructive">{txn.declineCode}</p>
            </div>
          )}
          {txn.refundedAmountCents !== undefined && txn.refundedAmountCents > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Refunded Amount</p>
              <p className="font-mono text-xs text-foreground">
                {formatAmount(txn.refundedAmountCents, txn.currency)}
              </p>
            </div>
          )}
          {txn.requiresSCA && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">SCA / 3DS</p>
              <p className="font-mono text-xs text-[color:var(--success)]">3DS2 authenticated</p>
            </div>
          )}
          {txn.idempotencyKey && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Idempotency Key</p>
              <p className="font-mono text-xs text-foreground truncate">{txn.idempotencyKey}</p>
            </div>
          )}
          {txn.capturedAt && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Captured At</p>
              <p className="font-mono text-xs text-foreground">{formatDate(txn.capturedAt)}</p>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "createdAt" | "amountCents" | "status";

function sortTransactions(
  list: Transaction[],
  key: SortKey,
  dir: "asc" | "desc"
): Transaction[] {
  return [...list].sort((a, b) => {
    let av: string | number = a[key] as string | number;
    let bv: string | number = b[key] as string | number;
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: "succeeded", label: "Succeeded" },
  { value: "failed", label: "Failed" },
  { value: "disputed", label: "Disputed" },
  { value: "refunded", label: "Refunded" },
  { value: "partially_refunded", label: "Partial Refund" },
  { value: "requires_capture", label: "Requires Capture" },
  { value: "requires_action", label: "Requires Action" },
  { value: "canceled", label: "Canceled" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TransactionStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const customerMap = useMemo(
    () => Object.fromEntries(customers.map((c) => [c.id, c])),
    []
  );

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = transactions.filter((txn) => {
      const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
      const customer = customerMap[txn.customerId];
      const matchesSearch =
        q === "" ||
        txn.id.toLowerCase().includes(q) ||
        txn.description.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q) ||
        customer?.email.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
    return sortTransactions(filtered, sortKey, sortDir);
  }, [search, statusFilter, sortKey, sortDir, customerMap]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  return (
    <div className="page-container space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Payment intent history, capture status, and dispute tracking
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, description, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | TransactionStatus)}
        >
          <SelectTrigger className="w-44">
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
          {displayed.length} {displayed.length === 1 ? "transaction" : "transactions"}
        </span>
      </div>

      {/* Table */}
      <div className="linear-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                  onClick={() => handleSort("amountCents")}
                >
                  <div className="flex items-center gap-1">
                    Amount <SortIcon col="amountCents" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Customer
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Payment Method
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                  Description
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date <SortIcon col="createdAt" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No transactions match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((txn) => {
                  const customer = customerMap[txn.customerId];
                  const isExpanded = expandedId === txn.id;
                  return (
                    <>
                      <TableRow
                        key={txn.id}
                        className="cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : txn.id)
                        }
                      >
                        <TableCell>
                          <StatusBadge status={txn.status} />
                        </TableCell>
                        <TableCell className="font-mono text-sm tabular-nums font-medium">
                          {formatAmount(txn.amountCents, txn.currency)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium leading-tight">
                              {customer?.name ?? txn.customerId}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">
                              {txn.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <PaymentMethodLabel txn={txn} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[220px]">
                          <span className="line-clamp-1">{txn.description}</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {formatDate(txn.createdAt)}
                        </TableCell>
                        <TableCell>
                          <ChevronRight
                            className={cn(
                              "w-4 h-4 text-muted-foreground transition-transform duration-100",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      {isExpanded && <ExpandedRow txn={txn} />}
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
