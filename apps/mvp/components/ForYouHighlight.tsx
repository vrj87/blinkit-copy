"use client";

import type { NudgeRow } from "@/components/DemoUserClient";
import { LlmBadge } from "@/components/LlmBadge";

export function ForYouHighlight({
  nudge,
  onView,
}: {
  nudge: NudgeRow | null | undefined;
  onView: () => void;
  onGenerate?: () => void;
  generating?: boolean;
}) {
  return (
    <button type="button" className="foryou-home-highlight" onClick={onView}>
      <div className="foryou-home-highlight-body">
        <div className="foryou-home-highlight-top">
          <span className="foryou-home-highlight-eyebrow">✨ For you · AI powered</span>
          {nudge ? (
            <LlmBadge meta={nudge.generationMeta} compact />
          ) : (
            <span className="foryou-home-highlight-pill">Groq LLM</span>
          )}
        </div>
        {nudge ? (
          <>
            <p className="foryou-home-highlight-title">Try {nudge.suggestedCategory}</p>
            <p className="foryou-home-highlight-copy">{nudge.copy}</p>
            <span className="foryou-home-highlight-cta">View starter pack →</span>
          </>
        ) : (
          <>
            <p className="foryou-home-highlight-title">Discover your next category</p>
            <p className="foryou-home-highlight-copy">
              Tap to open your personalised AI category pick
            </p>
            <span className="foryou-home-highlight-cta">Open For you →</span>
          </>
        )}
      </div>
    </button>
  );
}
