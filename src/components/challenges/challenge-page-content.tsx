"use client";

import type { ReactNode } from "react";
import { ChallengeList } from "./challenge-list";
import { VizGatewayFlow } from "./viz-gateway-flow";
import { VizWebhookMetrics } from "./viz-webhook-metrics";
import { VizComplianceArch } from "./viz-compliance-arch";

interface Challenge {
  id: string;
  title: string;
  description: string;
  outcome?: string;
}

interface ChallengePageContentProps {
  challenges: Challenge[];
}

export function ChallengePageContent({ challenges }: ChallengePageContentProps) {
  const visualizations: Record<string, ReactNode> = {
    "challenge-1": <VizGatewayFlow />,
    "challenge-2": <VizWebhookMetrics />,
    "challenge-3": <VizComplianceArch />,
  };

  return <ChallengeList challenges={challenges} visualizations={visualizations} />;
}
