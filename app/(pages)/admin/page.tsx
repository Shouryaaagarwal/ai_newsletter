
  "use client";

  import { useState, useEffect, useRef } from "react";

  type EvaluationResult = {
    hallucinationScore: number;
    label: string;
    reasoning: string;
    flaggedClaims: string[];
  };

  const TOPICS = [
    { id: "ai_research", label: "AI Research", icon: "⬡" },
    { id: "ai_industry", label: "AI Industry", icon: "◈" },
    { id: "enterprise_software", label: "Enterprise", icon: "▦" },
    { id: "cybersecurity", label: "Cybersecurity", icon: "◉" },
    { id: "semiconductors", label: "Semiconductors", icon: "◫" },
    { id: "energy", label: "Energy", icon: "◬" },
    { id: "geopolitics", label: "Geopolitics", icon: "◍" },
    { id: "india_ai", label: "India AI", icon: "◐" },
  ];

  const AGENT_LABELS: Record<string, string> = {
    ai_research: "AI Research Agent",
    energy: "Energy Agent",
    geopolitics: "Geopolitics Agent",
    india_ai: "India AI Agent",
  };

  export default function Home() {
    const [newsletter, setNewsletter] = useState("");
    const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [subscribing, setSubscribing] = useState(false);
    const [ingesting, setIngesting] = useState(false);
    const [fromCache, setFromCache] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [activeAgents, setActiveAgents] = useState<string[]>([]);
    const [completedAgents, setCompletedAgents] = useState<string[]>([]);
    const [tick, setTick] = useState(0);
    const newsletterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!loading) return;
      const interval = setInterval(() => setTick((t) => t + 1), 1200);
      return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
      if (loading) {
        const agents = Object.keys(AGENT_LABELS);
        setActiveAgents([]);
        setCompletedAgents([]);
        let i = 0;
        const interval = setInterval(() => {
          if (i < agents.length) {
            setActiveAgents((prev) => [...prev, agents[i]]);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 800);
        return () => clearInterval(interval);
      } else if (newsletter) {
        setCompletedAgents(Object.keys(AGENT_LABELS));
        setActiveAgents([]);
      }
    }, [loading]);

    const showToast = (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
    };

    const toggleTopic = (id: string) => {
      if (selectedTopics.includes(id)) {
        setSelectedTopics(selectedTopics.filter((t) => t !== id));
      } else {
        if (selectedTopics.length >= 5) {
          showToast("Max 5 topics allowed", "error");
          return;
        }
        setSelectedTopics([...selectedTopics, id]);
      }
    };

    const generate = async (forceRefresh = false) => {
      setLoading(true);
      setNewsletter("");
      setEvaluation(null);
      setCompletedAgents([]);
      try {
        const url = forceRefresh ? "/api/generate?refresh=true" : "/api/generate";
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setNewsletter(data.newsletter);
        setEvaluation(data.evaluation ?? null);
        setFromCache(data.fromCache ?? false);
        showToast(data.fromCache ? "Loaded from cache · 0 tokens used" : "Newsletter generated", "success");
        setTimeout(() => newsletterRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } catch (err: any) {
        showToast(err.message || "Generation failed", "error");
      } finally {
        setLoading(false);
      }
    };

    const ingest = async () => {
      setIngesting(true);
      try {
        const res = await fetch("/api/ingest");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        showToast(`${data.totalChunks} chunks ingested`, "success");
      } catch (err: any) {
        showToast(err.message || "Ingest failed", "error");
      } finally {
        setIngesting(false);
      }
    };

    const subscribe = async () => {
      if (!email.includes("@")) return showToast("Enter a valid email", "error");
      setSubscribing(true);
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, topics: selectedTopics }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        showToast("Subscribed to Nexus Brief", "success");
        setEmail("");
        setSelectedTopics([]);
      } catch (err: any) {
        showToast(err.message || "Subscribe failed", "error");
      } finally {
        setSubscribing(false);
      }
    };

    const sendToSubscribers = async () => {
      if (!newsletter) return showToast("Generate a newsletter first", "error");
      setSending(true);
      try {
        const res = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newsletter }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        showToast(data.message, "success");
      } catch (err: any) {
        showToast(err.message || "Send failed", "error");
      } finally {
        setSending(false);
      }
    };

    const scoreColor = (score: number) => {
      if (score >= 0.9) return { bar: "#22c55e", text: "#16a34a", bg: "rgba(34,197,94,0.08)" };
      if (score >= 0.75) return { bar: "#f59e0b", text: "#d97706", bg: "rgba(245,158,11,0.08)" };
      return { bar: "#ef4444", text: "#dc2626", bg: "rgba(239,68,68,0.08)" };
    };

    const formatNewsletter = (text: string) => {
      return text.split("\n\n").filter(Boolean).map((block, i) => {
        if (block.startsWith("AI Newsletter")) {
          return (
            <div key={i} style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#c9a84c", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase" }}>
                Nexus Brief · Daily Edition
              </div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f5f0e8", lineHeight: 1.3, fontFamily: "'Playfair Display', Georgia, serif" }}>
                {block}
              </h1>
            </div>
          );
        }
        if (block.startsWith("Sources:")) {
          const links = block.replace("Sources:", "").trim().split("\n").filter(Boolean);
          return (
            <div key={i} style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
                Sources
              </div>
              {links.map((link, j) => (
                <a key={j} href={link.trim()} target="_blank" rel="noreferrer"
                  style={{ display: "block", fontSize: "0.72rem", color: "#c9a84c", marginBottom: "0.25rem", textDecoration: "none", opacity: 0.7 }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}>
                  {link.trim()}
                </a>
              ))}
            </div>
          );
        }
        if (block.length < 60 && !block.includes(".")) {
          return (
            <h2 key={i} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "1.75rem", marginBottom: "0.75rem" }}>
              {block}
            </h2>
          );
        }
        return (
          <p key={i} style={{ fontSize: "0.875rem", color: "rgba(245,240,232,0.75)", lineHeight: 1.85, marginBottom: "1rem" }}>
            {block}
          </p>
        );
      });
    };

    const dots = ["⠋","⠙","⠸","⠴","⠦","⠇"];
    const dotFrame = dots[tick % dots.length];

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            background: #0d0d0f;
            color: #f5f0e8;
            font-family: 'DM Sans', sans-serif;
            -webkit-font-smoothing: antialiased;
          }

          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0d0d0f; }
          ::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 2px; }

          .nb-input {
            width: 100%;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 0.6rem 0.875rem;
            font-size: 0.8rem;
            color: #f5f0e8;
            font-family: 'DM Sans', sans-serif;
            outline: none;
            transition: border-color 0.2s;
          }
          .nb-input::placeholder { color: rgba(255,255,255,0.25); }
          .nb-input:focus { border-color: #c9a84c; }

          .nb-btn-primary {
            width: 100%;
            padding: 0.65rem 1rem;
            background: #c9a84c;
            color: #0d0d0f;
            border: none;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            letter-spacing: 0.03em;
            transition: all 0.2s;
          }
          .nb-btn-primary:hover:not(:disabled) { background: #e0bc5e; }
          .nb-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

          .nb-btn-ghost {
            width: 100%;
            padding: 0.6rem 1rem;
            background: transparent;
            color: rgba(255,255,255,0.4);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            font-size: 0.75rem;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: all 0.2s;
          }
          .nb-btn-ghost:hover:not(:disabled) { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.7); }
          .nb-btn-ghost:disabled { opacity: 0.3; cursor: not-allowed; }

          .nb-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 10px;
            padding: 1.25rem;
          }

          .nb-label {
            font-size: 0.6rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.3);
            font-weight: 500;
            margin-bottom: 0.75rem;
            display: block;
          }

          .topic-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.3rem 0.65rem;
            border-radius: 4px;
            border: 1px solid rgba(255,255,255,0.1);
            font-size: 0.7rem;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            background: transparent;
            color: rgba(255,255,255,0.4);
            transition: all 0.15s;
            white-space: nowrap;
          }
          .topic-chip:hover { border-color: rgba(201,168,76,0.4); color: rgba(255,255,255,0.7); }
          .topic-chip.active {
            background: rgba(201,168,76,0.12);
            border-color: rgba(201,168,76,0.5);
            color: #c9a84c;
          }

          .agent-row {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.4rem 0;
          }

          .agent-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
            transition: background 0.3s;
          }

          .pulse {
            animation: pulse 1s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.7); }
          }

          .fade-in {
            animation: fadeIn 0.4s ease forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .score-bar-track {
            width: 100%;
            height: 3px;
            background: rgba(255,255,255,0.07);
            border-radius: 2px;
            overflow: hidden;
          }

          .score-bar-fill {
            height: 100%;
            border-radius: 2px;
            transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
          }

          .nav-divider {
            width: 1px;
            height: 14px;
            background: rgba(255,255,255,0.1);
          }

          .newsletter-content {
            animation: fadeIn 0.5s ease forwards;
          }

          .loading-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .loading-line {
            height: 10px;
            border-radius: 3px;
            background: rgba(255,255,255,0.04);
            animation: shimmer 1.5s ease-in-out infinite;
          }

          .loading-line.wide { grid-column: span 2; }
          .loading-line.h16 { height: 16px; }

          @keyframes shimmer {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }

          @media (max-width: 1024px) {
            .layout-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 100,
            padding: "0.75rem 1rem",
            background: toast.type === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
            borderRadius: "8px",
            fontSize: "0.78rem",
            color: toast.type === "success" ? "#4ade80" : "#f87171",
            fontFamily: "'DM Mono', monospace",
            backdropFilter: "blur(12px)",
            animation: "fadeIn 0.25s ease",
            maxWidth: "320px",
          }}>
            {toast.type === "success" ? "✓ " : "✗ "}{toast.message}
          </div>
        )}

        {/* Header */}
        <header style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 2rem",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(13,13,15,0.92)",
          backdropFilter: "blur(16px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "20px", height: "20px", background: "#c9a84c", borderRadius: "4px", display: "grid", placeItems: "center", fontSize: "10px", color: "#0d0d0f", fontWeight: 700 }}>
                N
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f5f0e8", letterSpacing: "0.02em" }}>
                Nexus Brief
              </span>
            </div>
            <div className="nav-divider" />
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
              AI · Energy · Geopolitics · India
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button onClick={ingest} disabled={ingesting}
              style={{
                padding: "0.35rem 0.875rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "5px",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.45)",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
              {ingesting ? "Refreshing..." : "↻ Refresh Sources"}
            </button>
            {newsletter && (
              <button onClick={sendToSubscribers} disabled={sending}
                style={{
                  padding: "0.35rem 0.875rem",
                  background: "rgba(201,168,76,0.15)",
                  border: "1px solid rgba(201,168,76,0.35)",
                  borderRadius: "5px",
                  fontSize: "0.72rem",
                  color: "#c9a84c",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}>
                {sending ? "Sending..." : "↗ Send to Subscribers"}
              </button>
            )}
          </div>
        </header>

        {/* Main layout */}
        <div className="layout-grid" style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          minHeight: "calc(100vh - 52px)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}>

          {/* Sidebar */}
          <aside style={{
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "1.5rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}>

            {/* Generate card */}
            <div className="nb-card">
              <span className="nb-label">Generate</span>
              <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.3)", marginBottom: "1rem", lineHeight: 1.6 }}>
                Runs 4 topic agents, merges and evaluates output. Cached for 12 hours.
              </p>
              <button className="nb-btn-primary" onClick={() => generate(false)} disabled={loading}>
                {loading ? `${dotFrame} Generating...` : newsletter ? "↻ Reload Newsletter" : "Generate Newsletter"}
              </button>
              {newsletter && (
                <button className="nb-btn-ghost" onClick={() => generate(true)} disabled={loading}
                  style={{ marginTop: "0.5rem" }}>
                  Force Refresh · Uses Tokens
                </button>
              )}
            </div>

            {/* Agent pipeline */}
            <div className="nb-card">
              <span className="nb-label">Pipeline Status</span>
              {Object.entries(AGENT_LABELS).map(([id, label]) => {
                const isActive = activeAgents.includes(id);
                const isDone = completedAgents.includes(id);
                const isIdle = !isActive && !isDone;
                return (
                  <div key={id} className="agent-row">
                    <div className={`agent-dot ${isActive ? "pulse" : ""}`} style={{
                      background: isDone ? "#22c55e" : isActive ? "#c9a84c" : "rgba(255,255,255,0.12)"
                    }} />
                    <span style={{
                      fontSize: "0.72rem",
                      fontFamily: "'DM Mono', monospace",
                      color: isDone ? "rgba(255,255,255,0.6)" : isActive ? "#c9a84c" : "rgba(255,255,255,0.25)",
                      transition: "color 0.3s",
                    }}>
                      {label}
                    </span>
                    {isDone && <span style={{ fontSize: "0.6rem", color: "#22c55e", marginLeft: "auto" }}>✓</span>}
                    {isActive && <span style={{ fontSize: "0.6rem", color: "#c9a84c", marginLeft: "auto", fontFamily: "'DM Mono', monospace" }}>{dotFrame}</span>}
                  </div>
                );
              })}
            </div>

            {/* Quality report */}
            {evaluation && (
              <div className="nb-card fade-in">
                <span className="nb-label">Quality Report</span>
                {(() => {
                  const c = scoreColor(evaluation.hallucinationScore);
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.72rem", color: c.text, fontFamily: "'DM Mono', monospace" }}>
                          {evaluation.label}
                        </span>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: c.text, fontFamily: "'DM Mono', monospace" }}>
                          {Math.round(evaluation.hallucinationScore * 100)}
                          <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>%</span>
                        </span>
                      </div>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{ width: `${evaluation.hallucinationScore * 100}%`, background: c.bar }} />
                      </div>
                      {evaluation.reasoning && (
                        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.6rem", lineHeight: 1.6 }}>
                          {evaluation.reasoning}
                        </p>
                      )}
                      {evaluation.flaggedClaims.length > 0 && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <div style={{ fontSize: "0.6rem", color: "rgba(239,68,68,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                            Flagged
                          </div>
                          {evaluation.flaggedClaims.map((c2, i) => (
                            <div key={i} style={{
                              fontSize: "0.65rem", color: "#f87171",
                              background: "rgba(239,68,68,0.06)",
                              border: "1px solid rgba(239,68,68,0.15)",
                              borderRadius: "4px", padding: "0.4rem 0.5rem",
                              marginBottom: "0.3rem", lineHeight: 1.5,
                            }}>
                              "{c2}"
                            </div>
                          ))}
                        </div>
                      )}
                      {fromCache && (
                        <div style={{ marginTop: "0.6rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>
                          ◈ Served from cache · 0 tokens
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Subscribe */}
            <div className="nb-card">
              <span className="nb-label">Subscribe</span>
              <input
                className="nb-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                placeholder="your@email.com"
                style={{ marginBottom: "0.75rem" }}
              />
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                  Topics — select up to 5
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {TOPICS.map((t) => (
                    <button key={t.id} className={`topic-chip ${selectedTopics.includes(t.id) ? "active" : ""}`}
                      onClick={() => toggleTopic(t.id)}>
                      <span style={{ fontSize: "0.65rem" }}>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <button className="nb-btn-primary" onClick={subscribe} disabled={subscribing}>
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main style={{ padding: "2rem", overflow: "auto" }}>
            {loading ? (
              <div style={{ maxWidth: "640px" }}>
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#c9a84c", marginBottom: "0.75rem", fontFamily: "'DM Mono', monospace" }}>
                    {dotFrame} GENERATING NEWSLETTER
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
                    Running multi-agent pipeline...
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[1, 0.7, 0.9, 0.5, 0.8, 0.6, 0.85, 0.4, 0.75, 0.55].map((w, i) => (
                    <div key={i} className="loading-line"
                      style={{ width: `${w * 100}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            ) : newsletter ? (
              <div ref={newsletterRef} className="newsletter-content" style={{ maxWidth: "680px" }}>
                {/* Send banner */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.65rem 0.875rem",
                  background: "rgba(201,168,76,0.06)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  borderRadius: "6px",
                  marginBottom: "2rem",
                }}>
                  <span style={{ fontSize: "0.72rem", color: "rgba(201,168,76,0.7)" }}>
                    Ready to deliver · {fromCache ? "cached edition" : "freshly generated"}
                  </span>
                  <button onClick={sendToSubscribers} disabled={sending}
                    style={{
                      padding: "0.3rem 0.75rem",
                      background: "#c9a84c",
                      color: "#0d0d0f",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                    {sending ? "Sending..." : "Send Now ↗"}
                  </button>
                </div>

                {/* Newsletter body */}
                <div style={{ lineHeight: 1 }}>
                  {formatNewsletter(newsletter)}
                </div>
              </div>
            ) : (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                height: "60vh", gap: "1rem",
              }}>
                <div style={{
                  width: "48px", height: "48px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  display: "grid", placeItems: "center",
                  fontSize: "1.25rem",
                  color: "rgba(255,255,255,0.15)",
                }}>
                  ✦
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>
                    No edition generated yet
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
                    Click "Generate Newsletter" to run the pipeline
                  </p>
                </div>
                <button className="nb-btn-primary" onClick={() => generate(false)}
                  style={{ width: "auto", padding: "0.6rem 1.5rem", marginTop: "0.5rem" }}>
                  Generate Newsletter
                </button>

                {/* Edition info strip */}
                <div style={{
                  marginTop: "2rem",
                  display: "flex", gap: "2rem",
                  padding: "1rem 1.5rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                }}>
                  {[
                    { label: "Topics", value: "8" },
                    { label: "Agents", value: "4" },
                    { label: "Cache TTL", value: "12h" },
                    { label: "Evaluator", value: "On" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#c9a84c", fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
                      <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </>
    ); 
  }   

  