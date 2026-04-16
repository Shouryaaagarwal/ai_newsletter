// "use client";

// import { useState , useEffect} from "react";

// export default function Home() {
//   const [newsletter, setNewsletter] = useState("");

//   const generate = async () => {
//     const res = await fetch("/api/generate");
//     const data = await res.json();
//     setNewsletter(data.newsletter);
//   };

//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-bold">AI Newsletter</h1>

//       <button
//         onClick={generate}
//         className="bg-blue-600 text-white px-4 py-2 mt-4"
//       >
//         Generate Newsletter
//       </button>

//       <pre className="mt-6 whitespace-pre-wrap">
//         {newsletter}
//       </pre>
//     </div>
//   );
// }   

  
"use client";

import { useState } from "react";

type EvaluationResult = {
  hallucinationScore: number;
  label: string;
  reasoning: string;
  flaggedClaims: string[];
};

export default function Home() {
  const [newsletter, setNewsletter] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const generate = async () => {
    setLoading(true);
    setNewsletter("");
    setEvaluation(null);
    try {
      const res = await fetch("/api/generate");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNewsletter(data.newsletter);
      setEvaluation(data.evaluation);
      showToast("Newsletter generated successfully", "success");
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
      showToast(`Ingested ${data.totalChunks} chunks successfully`, "success");
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
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showToast("Subscribed successfully!", "success");
      setEmail("");
    } catch (err: any) {
      showToast(err.message || "Subscribe failed", "error");
    } finally {
      setSubscribing(false);
    }
  };

  // ✅ KEY CHANGE: sends the already-generated newsletter, no new LLM call
  const sendToSubscribers = async () => {
    if (!newsletter) {
      showToast("Generate a newsletter first before sending", "error");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletter }), // ← pass existing content
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
    if (score >= 0.9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 0.75) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const formatNewsletter = (text: string) => {
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("AI Newsletter")) {
        return (
          <div key={i} className="mb-6">
            <p className="text-xs font-medium text-indigo-500 tracking-widest uppercase mb-1">Nexus Brief</p>
            <h1 className="text-2xl font-semibold text-gray-900">{block}</h1>
          </div>
        );
      }
      if (block.startsWith("Sources:")) {
        const links = block.replace("Sources:", "").trim().split("\n").filter(Boolean);
        return (
          <div key={i} className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Sources</p>
            {links.map((link, j) => (
              <a key={j} href={link.trim()} target="_blank" rel="noreferrer"
                className="block text-xs text-indigo-400 hover:text-indigo-600 mb-1 truncate">
                {link.trim()}
              </a>
            ))}
          </div>
        );
      }
      if (block.length < 60 && !block.includes(".")) {
        return <h2 key={i} className="text-base font-semibold text-gray-800 mt-6 mb-2">{block}</h2>;
      }
      return <p key={i} className="text-sm text-gray-600 leading-relaxed mb-4">{block}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg border
          ${toast.type === "success"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-700 border-red-200"}`}>
          {toast.message}
        </div>
      )}

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="font-semibold text-gray-900 text-sm">Nexus Brief</span>
            <span className="text-xs text-gray-400 ml-1">AI · Energy · Geopolitics · India</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={ingest} disabled={ingesting}
              className="text-xs px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              {ingesting ? "Ingesting..." : "Refresh Sources"}
            </button>
            {/* Send button disabled until newsletter is generated */}
            <button
              onClick={sendToSubscribers}
              disabled={sending || !newsletter}
              title={!newsletter ? "Generate a newsletter first" : "Send to all subscribers"}
              className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {sending ? "Sending..." : "Send to Subscribers"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">

          {/* Generate card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-1">Generate Newsletter</h2>
            <p className="text-xs text-gray-400 mb-4">
              Runs 4 topic agents in parallel, merges and evaluates output.
              {newsletter && (
                <span className="block mt-1 text-indigo-400 font-medium">
                  ✓ Ready to send — no regeneration needed
                </span>
              )}
            </p>
            <button onClick={generate} disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating...
                </span>
              ) : newsletter ? "Regenerate Newsletter" : "Generate Newsletter"}
            </button>
          </div>

          {/* Evaluation card */}
          {/* {evaluation && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Quality Report</h2>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border mb-3 ${scoreColor(evaluation.hallucinationScore)}`}>
                <span>{evaluation.hallucinationScore >= 0.9 ? "✓" : evaluation.hallucinationScore >= 0.75 ? "~" : "✗"}</span>
                Score: {Math.round(evaluation.hallucinationScore * 100)}% · {evaluation.label}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{evaluation.reasoning}</p>
              {evaluation.flaggedClaims.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Flagged claims:</p>
                  {evaluation.flaggedClaims.map((claim, i) => (
                    <p key={i} className="text-xs text-red-500 bg-red-50 rounded p-2 mb-1">"{claim}"</p>
                  ))}
                </div>
              )}
            </div>
          )} */}

          {/* Subscribe card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-1">Subscribe</h2>
            <p className="text-xs text-gray-400 mb-3">Get the newsletter delivered to your inbox.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && subscribe()}
              placeholder="you@gmail.com"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 outline-none focus:border-indigo-400"
            />
            <button onClick={subscribe} disabled={subscribing}
              className="w-full py-2 rounded-lg border border-indigo-200 text-indigo-600 text-sm hover:bg-indigo-50 disabled:opacity-50 transition-colors">
              {subscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {/* Pipeline status */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Pipeline</h2>
            {["AI Research Agent", "Energy Agent", "Geopolitics Agent", "India AI Agent"].map((agent) => (
              <div key={agent} className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  loading ? "bg-amber-400 animate-pulse"
                  : newsletter ? "bg-emerald-400"
                  : "bg-gray-200"}`} />
                <span className="text-xs text-gray-500">{agent}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main newsletter display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 min-h-[600px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i}
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-sm text-gray-400">Running 4 agents in parallel...</p>
              </div>
            ) : newsletter ? (
              <div className="p-8">
                {/* Send reminder banner */}
                <div className="mb-6 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                  <p className="text-xs text-indigo-600">
                    Newsletter ready · click "Send to Subscribers" to deliver this exact content
                  </p>
                  <button
                    onClick={sendToSubscribers}
                    disabled={sending}
                    className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                    {sending ? "Sending..." : "Send Now"}
                  </button>
                </div>
                {formatNewsletter(newsletter)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">✦</div>
                <p className="text-sm font-medium text-gray-700">Ready to generate</p>
                <p className="text-xs text-gray-400">Click "Generate Newsletter" to run the multi-agent pipeline</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}