"use client";

import type { ReactNode } from "react";
import { OutcomeStatement } from "./outcome-statement";

interface Challenge {
  id: string;
  title: string;
  description: string;
  outcome?: string;
}

interface ChallengeListProps {
  challenges: Challenge[];
  visualizations?: Record<string, ReactNode>;
}

export function ChallengeList({
  challenges,
  visualizations = {},
}: ChallengeListProps) {
  return (
    <div className="flex flex-col gap-4">
      {challenges.map((challenge, index) => {
        const stepNumber = String(index + 1).padStart(2, "0");
        return (
          <div
            key={challenge.id}
            className="linear-card border-primary/10 bg-card p-6 space-y-4"
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-medium text-primary/70 w-6 shrink-0 tabular-nums">
                  {stepNumber}
                </span>
                <h3 className="text-base font-semibold">{challenge.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-[calc(1.5rem+0.75rem)]">
                {challenge.description}
              </p>
            </div>

            {visualizations[challenge.id] && (
              <div className="pl-[calc(1.5rem+0.75rem)]">
                {visualizations[challenge.id]}
              </div>
            )}

            {challenge.outcome && (
              <div className="pl-[calc(1.5rem+0.75rem)]">
                <OutcomeStatement outcome={challenge.outcome} index={index} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
