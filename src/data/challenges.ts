import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most PHP developers wire Stripe by dropping in the SDK, handling the happy path, and calling it done — leaving webhooks as ad-hoc polling scripts, gateway config as undocumented tribal knowledge, and PCI compliance as an afterthought checklist.",
  differentApproach:
    "I build the integration around idempotency keys and signed webhook verification from day one, structure the audit trail for PCI DSS before writing a single PaymentIntent, and automate the gateway validation flow so misconfigured credentials surface before a charge ever fails in production.",
  accentWord: "idempotency keys",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Secure Payment Gateway Configuration",
    description:
      "Misconfigured API keys, missing TLS enforcement, and unvalidated webhook signatures are the most common cause of silent charge failures and security incidents at the integration layer — long before any business logic runs.",
    visualizationType: "flow",
    outcome:
      "Could reduce misconfigured gateway errors from manual setup to a validated, automated setup flow — eliminating the most common class of failed charges before they reach a real customer.",
  },
  {
    id: "challenge-2",
    title: "Webhook Reliability and Event Handling",
    description:
      "Without idempotency keys and a structured retry strategy, duplicate events silently corrupt order state and missed deliveries go undetected until a customer calls support. Ad-hoc polling makes this worse, not better.",
    visualizationType: "metrics",
    outcome:
      "Could increase webhook event delivery reliability from ad-hoc polling (typically 60-75%) to 99%+ delivery with idempotency keys and automatic retry logic — cutting duplicate-event errors to near zero.",
  },
  {
    id: "challenge-3",
    title: "Transaction Compliance and Audit Trail",
    description:
      "PCI DSS Level 1/2, SCA/3DS under PSD2, and AML monitoring each require specific data capture and retention — but most integrations treat compliance as a log file and a checkbox, leaving reconciliation as a weekly manual task.",
    visualizationType: "architecture",
    outcome:
      "Could establish a full PCI DSS compliance posture with structured transaction logging, settlement reconciliation, and searchable audit trail — reducing manual compliance review from ~4 hours per week to under 20 minutes.",
  },
];
