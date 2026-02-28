import { APP_CONFIG } from "@/lib/config";
import { profile, portfolioProjects } from "@/data/proposal";
import { ProjectCard } from "@/components/proposal/project-card";
import { SkillsGrid } from "@/components/proposal/skills-grid";
import { TrendingUp } from "lucide-react";

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">

        {/* ── Section 1: Hero — Project Brief ── */}
        <section
          className="relative rounded-2xl overflow-hidden"
          style={{ background: "oklch(0.10 0.02 var(--primary-h, 160))" }}
        >
          {/* Subtle radial highlight */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, oklch(0.52 0.15 160 / 0.12), transparent 70%)",
            }}
          />

          <div className="relative z-10 p-8 md:p-12">
            {/* "Built this demo for your project" badge — mandatory */}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/10 text-white/80 px-3 py-1 rounded-full mb-6">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Built this demo for your project
            </span>

            {/* Role prefix */}
            <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-4">
              Full-Stack Developer · Stripe Integration Specialist
            </p>

            {/* Weight-contrast headline */}
            <h1 className="text-5xl md:text-6xl tracking-tight leading-none mb-4">
              <span className="font-light text-white/70">Hi, I&apos;m</span>{" "}
              <span className="font-black text-white">{profile.name}</span>
            </h1>

            {/* Tailored value prop — specific to this Stripe payment integration job */}
            <p className="text-lg md:text-xl text-white/65 max-w-2xl leading-relaxed mb-6">
              {profile.tagline}{" "}
              The demo in Tab 1 shows exactly what I&apos;d build for your{" "}
              {APP_CONFIG.projectName.toLowerCase()} — PaymentIntents, webhook
              event handling, compliance monitoring, and clean error paths.
            </p>
          </div>

          {/* Stats shelf */}
          <div className="relative z-10 border-t border-white/10 bg-white/5 px-8 md:px-12 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">24+</div>
                <div className="text-xs text-white/50 mt-0.5">Projects Shipped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">&lt; 48hr</div>
                <div className="text-xs text-white/50 mt-0.5">Demo Turnaround</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-xs text-white/50 mt-0.5">Industries Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Proof of Work ── */}
        <section className="space-y-4">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Proof of Work
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Relevant Projects</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {portfolioProjects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border/60 rounded-lg p-5 space-y-3 hover:border-primary/30 transition-colors duration-150"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold leading-snug">
                    {project.title}
                  </h3>
                  {/* ProjectCard handles liveUrl null-check internally */}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Outcome badge — always present */}
                {project.outcome && (
                  <div className="flex items-start gap-2 text-sm text-[color:var(--success)]">
                    <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="leading-snug">{project.outcome}</span>
                  </div>
                )}

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-primary/10 text-xs font-mono text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Relevance note + live link row */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {project.relevance && (
                    <p className="text-xs text-primary/70 italic leading-snug">
                      {project.relevance}
                    </p>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-100 shrink-0 ml-auto"
                    >
                      View &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: How I Work — payment-integration specific steps ── */}
        <section className="space-y-4">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Process
          </p>
          <h2 className="text-2xl font-bold tracking-tight">How I Work</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {profile.approach.map((step, i) => (
              <div
                key={step.title}
                className="bg-card border border-border/60 rounded-lg p-5 space-y-2 hover:border-primary/30 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  {i === 0 && (
                    <span className="font-mono text-xs text-muted-foreground/60">
                      Day 1
                    </span>
                  )}
                  {i === 1 && (
                    <span className="font-mono text-xs text-muted-foreground/60">
                      Week 1–2
                    </span>
                  )}
                  {i === 2 && (
                    <span className="font-mono text-xs text-muted-foreground/60">
                      Week 2–3
                    </span>
                  )}
                  {i === 3 && (
                    <span className="font-mono text-xs text-muted-foreground/60">
                      Ongoing
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Skills Grid — payment-relevant tech only ── */}
        <section className="space-y-4">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Tech Stack
          </p>
          <h2 className="text-2xl font-bold tracking-tight">What I Build With</h2>
          <SkillsGrid categories={profile.skillCategories} />
        </section>

        {/* ── Section 5: CTA — dark panel close ── */}
        <section
          className="relative rounded-2xl overflow-hidden text-center"
          style={{ background: "oklch(0.10 0.02 var(--primary-h, 160))" }}
        >
          <div className="relative z-10 p-8 md:p-12 space-y-4">
            {/* Pulsing availability indicator */}
            <div className="flex items-center justify-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[color:var(--success)]" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
              </span>
              <span
                className="text-sm"
                style={{ color: "color-mix(in oklch, var(--success) 80%, white)" }}
              >
                Currently available for new projects
              </span>
            </div>

            {/* Tailored CTA headline */}
            <h2 className="text-2xl font-bold text-white">
              Ready to clean up your payment integration.
            </h2>

            {/* Specific body — references the demo */}
            <p className="text-white/65 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
              I built the Stripe Payment Hub demo to show you what a
              production-ready integration looks like — proper idempotency,
              webhook signature validation, SCA flows, and a compliance layer that
              won&apos;t embarrass you during an audit. The real thing ships the
              same way.
            </p>

            {/* Binary CTA */}
            <p className="text-base font-semibold text-white pt-2">
              Reply on Upwork to start
            </p>
            <p className="text-sm text-white/50">
              10-minute call or I can send a 2-slide plan — your pick.
            </p>

            {/* Back to demo link */}
            <a
              href="/"
              className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors duration-100"
            >
              &larr; Back to the demo
            </a>

            {/* Signature */}
            <p className="pt-4 text-sm text-white/35 border-t border-white/10">
              — Humam
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
