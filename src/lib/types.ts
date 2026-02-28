import type { LucideIcon } from "lucide-react";

// ─── Sidebar navigation ───────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ─── Challenge visualization types ───────────────────────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// ─── Proposal types ───────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ─── Screen definition for frame-based demo formats ──────────────────────────

export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

// ─── Conversion element variant types ────────────────────────────────────────

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// ─── Payment Processing Domain Types ─────────────────────────────────────────

/** Stripe-aligned payment intent lifecycle statuses */
export type TransactionStatus =
  | "succeeded"
  | "processing"
  | "requires_capture"
  | "requires_action"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "disputed"
  | "canceled";

export type PaymentMethodType = "card" | "bank_account" | "sepa_debit" | "us_bank_account" | "link";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "diners" | "unionpay";

export type Currency = "usd" | "eur" | "gbp" | "cad" | "aud";

export interface PaymentMethodDetails {
  type: PaymentMethodType;
  brand?: CardBrand;
  /** Last 4 digits of card or bank account */
  last4: string;
  /** Card expiry month (1-12) */
  expiryMonth?: number;
  /** Card expiry year (4-digit) */
  expiryYear?: number;
  /** Bank name for bank_account type */
  bankName?: string;
  /** Whether 3DS authentication was performed */
  threeDSecure?: boolean;
}

export interface Transaction {
  id: string;
  /** Stripe payment intent ID format: pi_xxxxxxxxxxxxxxxxxxxxxxxx */
  paymentIntentId: string;
  /** Amount in cents (e.g. 4999 = $49.99) */
  amountCents: number;
  currency: Currency;
  status: TransactionStatus;
  customerId: string;
  paymentMethod: PaymentMethodDetails;
  description: string;
  /** Stripe decline code when status === "failed" */
  declineCode?: string | null;
  /** Whether this transaction required SCA / 3DS */
  requiresSCA?: boolean;
  /** Idempotency key used when creating the payment intent */
  idempotencyKey?: string;
  /** Net amount after processing fees, in cents */
  netAmountCents?: number;
  /** Refunded amount in cents (non-zero when partially_refunded) */
  refundedAmountCents?: number;
  /** ISO date of dispute creation when status === "disputed" */
  disputedAt?: string | null;
  createdAt: string;
  /** ISO date when capture was completed */
  capturedAt?: string | null;
}

export type CustomerStatus = "active" | "delinquent" | "blocked";

export interface Customer {
  id: string;
  name: string;
  email: string;
  /** References a PaymentMethod.id */
  defaultPaymentMethodId?: string | null;
  /** Total lifetime spend in cents */
  totalSpendCents: number;
  transactionCount: number;
  /** Currency for totalSpend display */
  currency: Currency;
  status: CustomerStatus;
  /** Stripe customer ID format: cus_xxxxxxxxxxxxxxxx */
  stripeCustomerId: string;
  createdAt: string;
}

export type WebhookEventStatus = "delivered" | "failed" | "pending" | "retrying";

/** Stripe webhook event type strings */
export type WebhookEventType =
  | "payment_intent.succeeded"
  | "payment_intent.payment_failed"
  | "payment_intent.created"
  | "payment_intent.requires_action"
  | "charge.dispute.created"
  | "charge.dispute.closed"
  | "charge.refunded"
  | "customer.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed"
  | "payout.paid"
  | "payout.failed";

export interface WebhookEvent {
  id: string;
  /** Stripe event ID format: evt_xxxxxxxxxxxxxxxxxxxxxxxx */
  stripeEventId: string;
  type: WebhookEventType;
  status: WebhookEventStatus;
  endpoint: string;
  /** HTTP response code from webhook endpoint (200, 404, 500, etc.) */
  responseCode?: number | null;
  attempts: number;
  /** Maximum number of retries configured */
  maxRetries: number;
  /** ISO date of next retry attempt */
  nextRetryAt?: string | null;
  createdAt: string;
  /** ISO date of last delivery attempt */
  lastAttemptAt?: string | null;
  /** Payload size in bytes */
  payloadBytes?: number;
}

export type PaymentMethodStatus = "active" | "expired" | "detached";

export interface PaymentMethod {
  id: string;
  /** Stripe payment method ID format: pm_xxxxxxxxxxxxxxxxxxxxxxxx */
  stripePaymentMethodId: string;
  type: PaymentMethodType;
  brand?: CardBrand;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  /** References a Customer.id */
  customerId: string;
  isDefault: boolean;
  status: PaymentMethodStatus;
  /** Billing postal code */
  billingZip?: string;
  createdAt: string;
}

export type ComplianceStatus = "passed" | "failed" | "warning" | "pending" | "not_applicable";

export type ComplianceCategory =
  | "PCI DSS"
  | "Data Security"
  | "Fraud Prevention"
  | "Regulatory"
  | "SCA / 3DS"
  | "AML";

export interface ComplianceCheck {
  id: string;
  checkName: string;
  status: ComplianceStatus;
  /** ISO date of last assessment */
  lastChecked: string;
  details: string;
  category: ComplianceCategory;
  /** Next scheduled review date */
  nextReviewAt?: string;
}

// ─── Chart / Analytics types ──────────────────────────────────────────────────

export interface MonthlyVolumePoint {
  month: string;
  /** Gross payment volume in dollars (not cents) */
  grossVolume: number;
  /** Net volume after fees and refunds */
  netVolume: number;
  transactionCount: number;
  /** Percentage 0-100 */
  successRate: number;
  /** Percentage 0-100 */
  disputeRate: number;
}

export interface VolumeByMethodPoint {
  method: string;
  volume: number;
  count: number;
  share: number;
}

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export interface DashboardStats {
  /** Total payment volume processed (in dollars) */
  totalPaymentVolume: number;
  paymentVolumeChange: number;
  /** Percentage 0-100 */
  successRate: number;
  successRateChange: number;
  /** Count of open disputes */
  openDisputes: number;
  disputesChange: number;
  /** Percentage 0-100 */
  webhookDeliveryRate: number;
  webhookDeliveryRateChange: number;
  /** Average transaction value in dollars */
  avgTransactionValue: number;
  avgTransactionValueChange: number;
  /** Count of failed transactions in current period */
  failedTransactions: number;
  failedTransactionsChange: number;
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export type ActivityEventType =
  | "payment_succeeded"
  | "payment_failed"
  | "dispute_opened"
  | "refund_issued"
  | "webhook_failed"
  | "new_customer"
  | "payout_completed"
  | "card_expired";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  subtitle: string;
  /** Amount in dollars when applicable */
  amount?: number;
  currency?: Currency;
  createdAt: string;
}
