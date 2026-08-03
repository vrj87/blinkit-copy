"use client";

import { DemoUserSwitcher, type DemoUserData } from "@/components/DemoUserSwitcher";

const WORKFLOW_STEPS = [
  {
    step: "1",
    title: "Order placed",
    desc: "User reorders weekly groceries (P1 segment)",
  },
  {
    step: "2",
    title: "Delivery complete",
    desc: "Post-delivery trigger — not at checkout (validated in research)",
  },
  {
    step: "3",
    title: "AI category pick",
    desc: "Groq suggests any expansion category — open to all demo users",
  },
  {
    step: "4",
    title: "LLM + discovery RAG",
    desc: "Groq generates explained pick with theme context & risk reducers",
  },
  {
    step: "5",
    title: "For you tab",
    desc: "Starter pack, reviews, accept / snooze / dismiss tracked",
  },
];

export function Part4MvpShowcase({
  users,
  embedded = false,
}: {
  users: DemoUserData[];
  embedded?: boolean;
}) {
  const demoSection = (
    <section className="part4-demo-section">
      <h2>Live Blinkit prototype</h2>
      <p className="part1-section-lead part4-demo-lead">
        Switch users, shop on Home, track delivery on Orders, then open{" "}
        <strong>For you</strong> for the Groq AI category pick.
      </p>
      <DemoUserSwitcher users={users} />
    </section>
  );

  const heroSection = (
    <section className="part1-hero card part4-hero">
      <h1>Smart Category Explorer</h1>
      <p className="part1-lead">
        Blinkit-style MVP with post-delivery AI — weekly restockers discover a new category
        without breaking their refill habit.
      </p>
      <div className="part4-pill-row">
        <span className="part4-pill">For you · Groq AI</span>
        <span className="part4-pill">Post-delivery trigger</span>
        <span className="part4-pill">Discovery RAG</span>
        <span className="part4-pill">n8n workflow</span>
      </div>
      <p className="part4-desktop-hint">
        <a href="/playground">← Back to project overview</a>
      </p>
    </section>
  );

  const workflowSection = (
    <section className="part4-workflow card">
      <h2>How it works</h2>
      <div className="part4-workflow-steps">
        {WORKFLOW_STEPS.map((s) => (
          <div key={s.step} className="part4-workflow-step">
            <span className="part4-workflow-num">{s.step}</span>
            <div>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (embedded) {
    return (
      <div className="part4-embedded">
        {workflowSection}
        {demoSection}
      </div>
    );
  }

  return (
    <div className="part4-page">
      {demoSection}
      {heroSection}
      {workflowSection}
    </div>
  );
}
