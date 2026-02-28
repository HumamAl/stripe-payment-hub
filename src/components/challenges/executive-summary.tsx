// NO "use client" — pure JSX, no hooks

interface ExecutiveSummaryProps {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export function ExecutiveSummary({
  commonApproach,
  differentApproach,
  accentWord,
}: ExecutiveSummaryProps) {
  const renderDifferentApproach = () => {
    if (!accentWord) return <span>{differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = differentApproach.split(new RegExp(`(${escaped})`, "i"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg p-6 md:p-8"
      style={{
        background: "oklch(0.10 0.02 var(--primary-h, 160))",
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.04), transparent 70%)",
      }}
    >
      <p className="text-sm md:text-base leading-relaxed text-white/50">
        {commonApproach}
      </p>
      <hr className="my-4 border-white/10" />
      <p className="text-base md:text-lg leading-relaxed font-medium text-white/90">
        {renderDifferentApproach()}
      </p>
      <p className="text-xs text-white/40 mt-3">
        &larr;{" "}
        <a
          href="/"
          className="hover:text-white/60 transition-colors duration-100 underline underline-offset-2"
        >
          Back to the live demo
        </a>
      </p>
    </div>
  );
}
