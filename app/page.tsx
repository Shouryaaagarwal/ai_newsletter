// "use client";

// import { useState } from "react";

// type EvaluationResult = {
//   hallucinationScore: number;
//   label: string;
//   reasoning: string;
//   flaggedClaims: string[];
// };

// export default function Home() {
//   const [newsletter, setNewsletter] = useState("");
//   const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [subscribing, setSubscribing] = useState(false);
//   const [ingesting, setIngesting] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//   const showToast = (message: string, type: "success" | "error") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 4000);
//   };

//   const generate = async () => {
//     setLoading(true);
//     setNewsletter("");
//     setEvaluation(null);
//     try {
//       const res = await fetch("/api/generate");
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       setNewsletter(data.newsletter);
//       setEvaluation(data.evaluation);
//       showToast("Newsletter generated successfully", "success");
//     } catch (err: any) {
//       showToast(err.message || "Generation failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ingest = async () => {
//     setIngesting(true);
//     try {
//       const res = await fetch("/api/ingest");
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       showToast(`Ingested ${data.totalChunks} chunks successfully`, "success");
//     } catch (err: any) {
//       showToast(err.message || "Ingest failed", "error");
//     } finally {
//       setIngesting(false);
//     }
//   };

//   const subscribe = async () => {
//     if (!email.includes("@")) return showToast("Enter a valid email", "error");
//     setSubscribing(true);
//     try {
//       const res = await fetch("/api/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       showToast("Subscribed successfully!", "success");
//       setEmail("");
//     } catch (err: any) {
//       showToast(err.message || "Subscribe failed", "error");
//     } finally {
//       setSubscribing(false);
//     }
//   };

//   // ✅ KEY CHANGE: sends the already-generated newsletter, no new LLM call
//   const sendToSubscribers = async () => {
//     if (!newsletter) {
//       showToast("Generate a newsletter first before sending", "error");
//       return;
//     }
//     setSending(true);
//     try {
//       const res = await fetch("/api/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ newsletter }), // ← pass existing content
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       showToast(data.message, "success");
//     } catch (err: any) {
//       showToast(err.message || "Send failed", "error");
//     } finally {
//       setSending(false);
//     }
//   };

//   const scoreColor = (score: number) => {
//     if (score >= 0.9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
//     if (score >= 0.75) return "text-amber-600 bg-amber-50 border-amber-200";
//     return "text-red-600 bg-red-50 border-red-200";
//   };

//   const formatNewsletter = (text: string) => {
//     return text.split("\n\n").map((block, i) => {
//       if (block.startsWith("AI Newsletter")) {
//         return (
//           <div key={i} className="mb-6">
//             <p className="text-xs font-medium text-indigo-500 tracking-widest uppercase mb-1">Nexus Brief</p>
//             <h1 className="text-2xl font-semibold text-gray-900">{block}</h1>
//           </div>
//         );
//       }
//       if (block.startsWith("Sources:")) {
//         const links = block.replace("Sources:", "").trim().split("\n").filter(Boolean);
//         return (
//           <div key={i} className="mt-8 pt-6 border-t border-gray-100">
//             <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Sources</p>
//             {links.map((link, j) => (
//               <a key={j} href={link.trim()} target="_blank" rel="noreferrer"
//                 className="block text-xs text-indigo-400 hover:text-indigo-600 mb-1 truncate">
//                 {link.trim()}
//               </a>
//             ))}
//           </div>
//         );
//       }
//       if (block.length < 60 && !block.includes(".")) {
//         return <h2 key={i} className="text-base font-semibold text-gray-800 mt-6 mb-2">{block}</h2>;
//       }
//       return <p key={i} className="text-sm text-gray-600 leading-relaxed mb-4">{block}</p>;
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg border
//           ${toast.type === "success"
//             ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//             : "bg-red-50 text-red-700 border-red-200"}`}>
//           {toast.message}
//         </div>
//       )}

//       {/* Nav */}
//       <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 rounded-full bg-indigo-500" />
//             <span className="font-semibold text-gray-900 text-sm">Nexus Brief</span>
//             <span className="text-xs text-gray-400 ml-1">AI · Energy · Geopolitics · India</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={ingest} disabled={ingesting}
//               className="text-xs px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
//               {ingesting ? "Ingesting..." : "Refresh Sources"}
//             </button>
//             {/* Send button disabled until newsletter is generated */}
//             <button
//               onClick={sendToSubscribers}
//               disabled={sending || !newsletter}
//               title={!newsletter ? "Generate a newsletter first" : "Send to all subscribers"}
//               className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
//               {sending ? "Sending..." : "Send to Subscribers"}
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

//         {/* Left sidebar */}
//         <div className="lg:col-span-1 space-y-4">

//           {/* Generate card */}
//           <div className="bg-white rounded-xl border border-gray-100 p-5">
//             <h2 className="text-sm font-semibold text-gray-800 mb-1">Generate Newsletter</h2>
//             <p className="text-xs text-gray-400 mb-4">
//               Runs 4 topic agents in parallel, merges and evaluates output.
//               {newsletter && (
//                 <span className="block mt-1 text-indigo-400 font-medium">
//                   ✓ Ready to send — no regeneration needed
//                 </span>
//               )}
//             </p>
//             <button onClick={generate} disabled={loading}
//               className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                   </svg>
//                   Generating...
//                 </span>
//               ) : newsletter ? "Regenerate Newsletter" : "Generate Newsletter"}
//             </button>
//           </div>

//           {/* Evaluation card */}
//           {/* {evaluation && (
//             <div className="bg-white rounded-xl border border-gray-100 p-5">
//               <h2 className="text-sm font-semibold text-gray-800 mb-3">Quality Report</h2>
//               <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border mb-3 ${scoreColor(evaluation.hallucinationScore)}`}>
//                 <span>{evaluation.hallucinationScore >= 0.9 ? "✓" : evaluation.hallucinationScore >= 0.75 ? "~" : "✗"}</span>
//                 Score: {Math.round(evaluation.hallucinationScore * 100)}% · {evaluation.label}
//               </div>
//               <p className="text-xs text-gray-500 leading-relaxed mb-3">{evaluation.reasoning}</p>
//               {evaluation.flaggedClaims.length > 0 && (
//                 <div>
//                   <p className="text-xs font-medium text-gray-700 mb-1">Flagged claims:</p>
//                   {evaluation.flaggedClaims.map((claim, i) => (
//                     <p key={i} className="text-xs text-red-500 bg-red-50 rounded p-2 mb-1">"{claim}"</p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )} */}

//           {/* Subscribe card */}
//           <div className="bg-white rounded-xl border border-gray-100 p-5">
//             <h2 className="text-sm font-semibold text-gray-800 mb-1">Subscribe</h2>
//             <p className="text-xs text-gray-400 mb-3">Get the newsletter delivered to your inbox.</p>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && subscribe()}
//               placeholder="you@gmail.com"
//               className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 outline-none focus:border-indigo-400"
//             />
//             <button onClick={subscribe} disabled={subscribing}
//               className="w-full py-2 rounded-lg border border-indigo-200 text-indigo-600 text-sm hover:bg-indigo-50 disabled:opacity-50 transition-colors">
//               {subscribing ? "Subscribing..." : "Subscribe"}
//             </button>
//           </div>

//           {/* Pipeline status */}
//           <div className="bg-white rounded-xl border border-gray-100 p-5">
//             <h2 className="text-sm font-semibold text-gray-800 mb-3">Pipeline</h2>
//             {["AI Research Agent", "Energy Agent", "Geopolitics Agent", "India AI Agent"].map((agent) => (
//               <div key={agent} className="flex items-center gap-2 mb-2">
//                 <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
//                   loading ? "bg-amber-400 animate-pulse"
//                   : newsletter ? "bg-emerald-400"
//                   : "bg-gray-200"}`} />
//                 <span className="text-xs text-gray-500">{agent}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main newsletter display */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl border border-gray-100 min-h-[600px]">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center h-96 gap-4">
//                 <div className="flex gap-1">
//                   {[0, 1, 2, 3].map((i) => (
//                     <div key={i}
//                       className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
//                       style={{ animationDelay: `${i * 0.1}s` }} />
//                   ))}
//                 </div>
//                 <p className="text-sm text-gray-400">Running 4 agents in parallel...</p>
//               </div>
//             ) : newsletter ? (
//               <div className="p-8">
//                 {/* Send reminder banner */}
//                 <div className="mb-6 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
//                   <p className="text-xs text-indigo-600">
//                     Newsletter ready · click "Send to Subscribers" to deliver this exact content
//                   </p>
//                   <button
//                     onClick={sendToSubscribers}
//                     disabled={sending}
//                     className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
//                     {sending ? "Sending..." : "Send Now"}
//                   </button>
//                 </div>
//                 {formatNewsletter(newsletter)}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-96 gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">✦</div>
//                 <p className="text-sm font-medium text-gray-700">Ready to generate</p>
//                 <p className="text-xs text-gray-400">Click "Generate Newsletter" to run the multi-agent pipeline</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }  

  // "use client";

  // import { useState, useEffect, useRef } from "react";

  // type EvaluationResult = {
  //   hallucinationScore: number;
  //   label: string;
  //   reasoning: string;
  //   flaggedClaims: string[];
  // };

  // const TOPICS = [
  //   { id: "ai_research", label: "AI Research", icon: "⬡" },
  //   { id: "ai_industry", label: "AI Industry", icon: "◈" },
  //   { id: "enterprise_software", label: "Enterprise", icon: "▦" },
  //   { id: "cybersecurity", label: "Cybersecurity", icon: "◉" },
  //   { id: "semiconductors", label: "Semiconductors", icon: "◫" },
  //   { id: "energy", label: "Energy", icon: "◬" },
  //   { id: "geopolitics", label: "Geopolitics", icon: "◍" },
  //   { id: "india_ai", label: "India AI", icon: "◐" },
  // ];

  // const AGENT_LABELS: Record<string, string> = {
  //   ai_research: "AI Research Agent",
  //   energy: "Energy Agent",
  //   geopolitics: "Geopolitics Agent",
  //   india_ai: "India AI Agent",
  // };

  // export default function Home() {
  //   const [newsletter, setNewsletter] = useState("");
  //   const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  //   const [email, setEmail] = useState("");
  //   const [loading, setLoading] = useState(false);
  //   const [sending, setSending] = useState(false);
  //   const [subscribing, setSubscribing] = useState(false);
  //   const [ingesting, setIngesting] = useState(false);
  //   const [fromCache, setFromCache] = useState(false);
  //   const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  //   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  //   const [activeAgents, setActiveAgents] = useState<string[]>([]);
  //   const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  //   const [tick, setTick] = useState(0);
  //   const newsletterRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if (!loading) return;
  //     const interval = setInterval(() => setTick((t) => t + 1), 1200);
  //     return () => clearInterval(interval);
  //   }, [loading]);

  //   useEffect(() => {
  //     if (loading) {
  //       const agents = Object.keys(AGENT_LABELS);
  //       setActiveAgents([]);
  //       setCompletedAgents([]);
  //       let i = 0;
  //       const interval = setInterval(() => {
  //         if (i < agents.length) {
  //           setActiveAgents((prev) => [...prev, agents[i]]);
  //           i++;
  //         } else {
  //           clearInterval(interval);
  //         }
  //       }, 800);
  //       return () => clearInterval(interval);
  //     } else if (newsletter) {
  //       setCompletedAgents(Object.keys(AGENT_LABELS));
  //       setActiveAgents([]);
  //     }
  //   }, [loading]);

  //   const showToast = (message: string, type: "success" | "error") => {
  //     setToast({ message, type });
  //     setTimeout(() => setToast(null), 4000);
  //   };

  //   const toggleTopic = (id: string) => {
  //     if (selectedTopics.includes(id)) {
  //       setSelectedTopics(selectedTopics.filter((t) => t !== id));
  //     } else {
  //       if (selectedTopics.length >= 5) {
  //         showToast("Max 5 topics allowed", "error");
  //         return;
  //       }
  //       setSelectedTopics([...selectedTopics, id]);
  //     }
  //   };

  //   const generate = async (forceRefresh = false) => {
  //     setLoading(true);
  //     setNewsletter("");
  //     setEvaluation(null);
  //     setCompletedAgents([]);
  //     try {
  //       const url = forceRefresh ? "/api/generate?refresh=true" : "/api/generate";
  //       const res = await fetch(url);
  //       const data = await res.json();
  //       if (data.error) throw new Error(data.error);
  //       setNewsletter(data.newsletter);
  //       setEvaluation(data.evaluation ?? null);
  //       setFromCache(data.fromCache ?? false);
  //       showToast(data.fromCache ? "Loaded from cache · 0 tokens used" : "Newsletter generated", "success");
  //       setTimeout(() => newsletterRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  //     } catch (err: any) {
  //       showToast(err.message || "Generation failed", "error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const ingest = async () => {
  //     setIngesting(true);
  //     try {
  //       const res = await fetch("/api/ingest");
  //       const data = await res.json();
  //       if (data.error) throw new Error(data.error);
  //       showToast(`${data.totalChunks} chunks ingested`, "success");
  //     } catch (err: any) {
  //       showToast(err.message || "Ingest failed", "error");
  //     } finally {
  //       setIngesting(false);
  //     }
  //   };

  //   const subscribe = async () => {
  //     if (!email.includes("@")) return showToast("Enter a valid email", "error");
  //     setSubscribing(true);
  //     try {
  //       const res = await fetch("/api/subscribe", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, topics: selectedTopics }),
  //       });
  //       const data = await res.json();
  //       if (data.error) throw new Error(data.error);
  //       showToast("Subscribed to Nexus Brief", "success");
  //       setEmail("");
  //       setSelectedTopics([]);
  //     } catch (err: any) {
  //       showToast(err.message || "Subscribe failed", "error");
  //     } finally {
  //       setSubscribing(false);
  //     }
  //   };

  //   const sendToSubscribers = async () => {
  //     if (!newsletter) return showToast("Generate a newsletter first", "error");
  //     setSending(true);
  //     try {
  //       const res = await fetch("/api/send", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ newsletter }),
  //       });
  //       const data = await res.json();
  //       if (data.error) throw new Error(data.error);
  //       showToast(data.message, "success");
  //     } catch (err: any) {
  //       showToast(err.message || "Send failed", "error");
  //     } finally {
  //       setSending(false);
  //     }
  //   };

  //   const scoreColor = (score: number) => {
  //     if (score >= 0.9) return { bar: "#22c55e", text: "#16a34a", bg: "rgba(34,197,94,0.08)" };
  //     if (score >= 0.75) return { bar: "#f59e0b", text: "#d97706", bg: "rgba(245,158,11,0.08)" };
  //     return { bar: "#ef4444", text: "#dc2626", bg: "rgba(239,68,68,0.08)" };
  //   };

  //   const formatNewsletter = (text: string) => {
  //     return text.split("\n\n").filter(Boolean).map((block, i) => {
  //       if (block.startsWith("AI Newsletter")) {
  //         return (
  //           <div key={i} style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
  //             <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#c9a84c", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase" }}>
  //               Nexus Brief · Daily Edition
  //             </div>
  //             <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f5f0e8", lineHeight: 1.3, fontFamily: "'Playfair Display', Georgia, serif" }}>
  //               {block}
  //             </h1>
  //           </div>
  //         );
  //       }
  //       if (block.startsWith("Sources:")) {
  //         const links = block.replace("Sources:", "").trim().split("\n").filter(Boolean);
  //         return (
  //           <div key={i} style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
  //             <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
  //               Sources
  //             </div>
  //             {links.map((link, j) => (
  //               <a key={j} href={link.trim()} target="_blank" rel="noreferrer"
  //                 style={{ display: "block", fontSize: "0.72rem", color: "#c9a84c", marginBottom: "0.25rem", textDecoration: "none", opacity: 0.7 }}
  //                 onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
  //                 onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}>
  //                 {link.trim()}
  //               </a>
  //             ))}
  //           </div>
  //         );
  //       }
  //       if (block.length < 60 && !block.includes(".")) {
  //         return (
  //           <h2 key={i} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "1.75rem", marginBottom: "0.75rem" }}>
  //             {block}
  //           </h2>
  //         );
  //       }
  //       return (
  //         <p key={i} style={{ fontSize: "0.875rem", color: "rgba(245,240,232,0.75)", lineHeight: 1.85, marginBottom: "1rem" }}>
  //           {block}
  //         </p>
  //       );
  //     });
  //   };

  //   const dots = ["⠋","⠙","⠸","⠴","⠦","⠇"];
  //   const dotFrame = dots[tick % dots.length];

  //   return (
  //     <>
  //       <style>{`
  //         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  //         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  //         body {
  //           background: #0d0d0f;
  //           color: #f5f0e8;
  //           font-family: 'DM Sans', sans-serif;
  //           -webkit-font-smoothing: antialiased;
  //         }

  //         ::-webkit-scrollbar { width: 4px; }
  //         ::-webkit-scrollbar-track { background: #0d0d0f; }
  //         ::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 2px; }

  //         .nb-input {
  //           width: 100%;
  //           background: rgba(255,255,255,0.04);
  //           border: 1px solid rgba(255,255,255,0.1);
  //           border-radius: 6px;
  //           padding: 0.6rem 0.875rem;
  //           font-size: 0.8rem;
  //           color: #f5f0e8;
  //           font-family: 'DM Sans', sans-serif;
  //           outline: none;
  //           transition: border-color 0.2s;
  //         }
  //         .nb-input::placeholder { color: rgba(255,255,255,0.25); }
  //         .nb-input:focus { border-color: #c9a84c; }

  //         .nb-btn-primary {
  //           width: 100%;
  //           padding: 0.65rem 1rem;
  //           background: #c9a84c;
  //           color: #0d0d0f;
  //           border: none;
  //           border-radius: 6px;
  //           font-size: 0.8rem;
  //           font-weight: 600;
  //           font-family: 'DM Sans', sans-serif;
  //           cursor: pointer;
  //           letter-spacing: 0.03em;
  //           transition: all 0.2s;
  //         }
  //         .nb-btn-primary:hover:not(:disabled) { background: #e0bc5e; }
  //         .nb-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  //         .nb-btn-ghost {
  //           width: 100%;
  //           padding: 0.6rem 1rem;
  //           background: transparent;
  //           color: rgba(255,255,255,0.4);
  //           border: 1px solid rgba(255,255,255,0.1);
  //           border-radius: 6px;
  //           font-size: 0.75rem;
  //           font-family: 'DM Sans', sans-serif;
  //           cursor: pointer;
  //           transition: all 0.2s;
  //         }
  //         .nb-btn-ghost:hover:not(:disabled) { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.7); }
  //         .nb-btn-ghost:disabled { opacity: 0.3; cursor: not-allowed; }

  //         .nb-card {
  //           background: rgba(255,255,255,0.03);
  //           border: 1px solid rgba(255,255,255,0.07);
  //           border-radius: 10px;
  //           padding: 1.25rem;
  //         }

  //         .nb-label {
  //           font-size: 0.6rem;
  //           letter-spacing: 0.18em;
  //           text-transform: uppercase;
  //           color: rgba(255,255,255,0.3);
  //           font-weight: 500;
  //           margin-bottom: 0.75rem;
  //           display: block;
  //         }

  //         .topic-chip {
  //           display: inline-flex;
  //           align-items: center;
  //           gap: 0.35rem;
  //           padding: 0.3rem 0.65rem;
  //           border-radius: 4px;
  //           border: 1px solid rgba(255,255,255,0.1);
  //           font-size: 0.7rem;
  //           font-family: 'DM Sans', sans-serif;
  //           cursor: pointer;
  //           background: transparent;
  //           color: rgba(255,255,255,0.4);
  //           transition: all 0.15s;
  //           white-space: nowrap;
  //         }
  //         .topic-chip:hover { border-color: rgba(201,168,76,0.4); color: rgba(255,255,255,0.7); }
  //         .topic-chip.active {
  //           background: rgba(201,168,76,0.12);
  //           border-color: rgba(201,168,76,0.5);
  //           color: #c9a84c;
  //         }

  //         .agent-row {
  //           display: flex;
  //           align-items: center;
  //           gap: 0.6rem;
  //           padding: 0.4rem 0;
  //         }

  //         .agent-dot {
  //           width: 6px;
  //           height: 6px;
  //           border-radius: 50%;
  //           flex-shrink: 0;
  //           transition: background 0.3s;
  //         }

  //         .pulse {
  //           animation: pulse 1s ease-in-out infinite;
  //         }

  //         @keyframes pulse {
  //           0%, 100% { opacity: 1; transform: scale(1); }
  //           50% { opacity: 0.4; transform: scale(0.7); }
  //         }

  //         .fade-in {
  //           animation: fadeIn 0.4s ease forwards;
  //         }

  //         @keyframes fadeIn {
  //           from { opacity: 0; transform: translateY(6px); }
  //           to { opacity: 1; transform: translateY(0); }
  //         }

  //         .score-bar-track {
  //           width: 100%;
  //           height: 3px;
  //           background: rgba(255,255,255,0.07);
  //           border-radius: 2px;
  //           overflow: hidden;
  //         }

  //         .score-bar-fill {
  //           height: 100%;
  //           border-radius: 2px;
  //           transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  //         }

  //         .nav-divider {
  //           width: 1px;
  //           height: 14px;
  //           background: rgba(255,255,255,0.1);
  //         }

  //         .newsletter-content {
  //           animation: fadeIn 0.5s ease forwards;
  //         }

  //         .loading-grid {
  //           display: grid;
  //           grid-template-columns: 1fr 1fr;
  //           gap: 0.5rem;
  //         }

  //         .loading-line {
  //           height: 10px;
  //           border-radius: 3px;
  //           background: rgba(255,255,255,0.04);
  //           animation: shimmer 1.5s ease-in-out infinite;
  //         }

  //         .loading-line.wide { grid-column: span 2; }
  //         .loading-line.h16 { height: 16px; }

  //         @keyframes shimmer {
  //           0%, 100% { opacity: 0.4; }
  //           50% { opacity: 0.8; }
  //         }

  //         @media (max-width: 1024px) {
  //           .layout-grid { grid-template-columns: 1fr !important; }
  //         }
  //       `}</style>

  //       {/* Toast */}
  //       {toast && (
  //         <div style={{
  //           position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 100,
  //           padding: "0.75rem 1rem",
  //           background: toast.type === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
  //           border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
  //           borderRadius: "8px",
  //           fontSize: "0.78rem",
  //           color: toast.type === "success" ? "#4ade80" : "#f87171",
  //           fontFamily: "'DM Mono', monospace",
  //           backdropFilter: "blur(12px)",
  //           animation: "fadeIn 0.25s ease",
  //           maxWidth: "320px",
  //         }}>
  //           {toast.type === "success" ? "✓ " : "✗ "}{toast.message}
  //         </div>
  //       )}

  //       {/* Header */}
  //       <header style={{
  //         borderBottom: "1px solid rgba(255,255,255,0.06)",
  //         padding: "0 2rem",
  //         height: "52px",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "space-between",
  //         position: "sticky",
  //         top: 0,
  //         zIndex: 50,
  //         background: "rgba(13,13,15,0.92)",
  //         backdropFilter: "blur(16px)",
  //       }}>
  //         <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
  //           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
  //             <div style={{ width: "20px", height: "20px", background: "#c9a84c", borderRadius: "4px", display: "grid", placeItems: "center", fontSize: "10px", color: "#0d0d0f", fontWeight: 700 }}>
  //               N
  //             </div>
  //             <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f5f0e8", letterSpacing: "0.02em" }}>
  //               Nexus Brief
  //             </span>
  //           </div>
  //           <div className="nav-divider" />
  //           <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
  //             AI · Energy · Geopolitics · India
  //           </span>
  //         </div>

  //         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
  //           <button onClick={ingest} disabled={ingesting}
  //             style={{
  //               padding: "0.35rem 0.875rem",
  //               background: "transparent",
  //               border: "1px solid rgba(255,255,255,0.1)",
  //               borderRadius: "5px",
  //               fontSize: "0.72rem",
  //               color: "rgba(255,255,255,0.45)",
  //               cursor: "pointer",
  //               fontFamily: "'DM Sans', sans-serif",
  //               transition: "all 0.2s",
  //             }}
  //             onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
  //             onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
  //             {ingesting ? "Refreshing..." : "↻ Refresh Sources"}
  //           </button>
  //           {newsletter && (
  //             <button onClick={sendToSubscribers} disabled={sending}
  //               style={{
  //                 padding: "0.35rem 0.875rem",
  //                 background: "rgba(201,168,76,0.15)",
  //                 border: "1px solid rgba(201,168,76,0.35)",
  //                 borderRadius: "5px",
  //                 fontSize: "0.72rem",
  //                 color: "#c9a84c",
  //                 cursor: "pointer",
  //                 fontFamily: "'DM Sans', sans-serif",
  //                 transition: "all 0.2s",
  //               }}>
  //               {sending ? "Sending..." : "↗ Send to Subscribers"}
  //             </button>
  //           )}
  //         </div>
  //       </header>

  //       {/* Main layout */}
  //       <div className="layout-grid" style={{
  //         display: "grid",
  //         gridTemplateColumns: "300px 1fr",
  //         minHeight: "calc(100vh - 52px)",
  //         maxWidth: "1400px",
  //         margin: "0 auto",
  //       }}>

  //         {/* Sidebar */}
  //         <aside style={{
  //           borderRight: "1px solid rgba(255,255,255,0.06)",
  //           padding: "1.5rem 1.25rem",
  //           display: "flex",
  //           flexDirection: "column",
  //           gap: "1rem",
  //         }}>

  //           {/* Generate card */}
  //           <div className="nb-card">
  //             <span className="nb-label">Generate</span>
  //             <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.3)", marginBottom: "1rem", lineHeight: 1.6 }}>
  //               Runs 4 topic agents, merges and evaluates output. Cached for 12 hours.
  //             </p>
  //             <button className="nb-btn-primary" onClick={() => generate(false)} disabled={loading}>
  //               {loading ? `${dotFrame} Generating...` : newsletter ? "↻ Reload Newsletter" : "Generate Newsletter"}
  //             </button>
  //             {newsletter && (
  //               <button className="nb-btn-ghost" onClick={() => generate(true)} disabled={loading}
  //                 style={{ marginTop: "0.5rem" }}>
  //                 Force Refresh · Uses Tokens
  //               </button>
  //             )}
  //           </div>

  //           {/* Agent pipeline */}
  //           <div className="nb-card">
  //             <span className="nb-label">Pipeline Status</span>
  //             {Object.entries(AGENT_LABELS).map(([id, label]) => {
  //               const isActive = activeAgents.includes(id);
  //               const isDone = completedAgents.includes(id);
  //               const isIdle = !isActive && !isDone;
  //               return (
  //                 <div key={id} className="agent-row">
  //                   <div className={`agent-dot ${isActive ? "pulse" : ""}`} style={{
  //                     background: isDone ? "#22c55e" : isActive ? "#c9a84c" : "rgba(255,255,255,0.12)"
  //                   }} />
  //                   <span style={{
  //                     fontSize: "0.72rem",
  //                     fontFamily: "'DM Mono', monospace",
  //                     color: isDone ? "rgba(255,255,255,0.6)" : isActive ? "#c9a84c" : "rgba(255,255,255,0.25)",
  //                     transition: "color 0.3s",
  //                   }}>
  //                     {label}
  //                   </span>
  //                   {isDone && <span style={{ fontSize: "0.6rem", color: "#22c55e", marginLeft: "auto" }}>✓</span>}
  //                   {isActive && <span style={{ fontSize: "0.6rem", color: "#c9a84c", marginLeft: "auto", fontFamily: "'DM Mono', monospace" }}>{dotFrame}</span>}
  //                 </div>
  //               );
  //             })}
  //           </div>

  //           {/* Quality report */}
  //           {evaluation && (
  //             <div className="nb-card fade-in">
  //               <span className="nb-label">Quality Report</span>
  //               {(() => {
  //                 const c = scoreColor(evaluation.hallucinationScore);
  //                 return (
  //                   <>
  //                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
  //                       <span style={{ fontSize: "0.72rem", color: c.text, fontFamily: "'DM Mono', monospace" }}>
  //                         {evaluation.label}
  //                       </span>
  //                       <span style={{ fontSize: "1rem", fontWeight: 700, color: c.text, fontFamily: "'DM Mono', monospace" }}>
  //                         {Math.round(evaluation.hallucinationScore * 100)}
  //                         <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>%</span>
  //                       </span>
  //                     </div>
  //                     <div className="score-bar-track">
  //                       <div className="score-bar-fill" style={{ width: `${evaluation.hallucinationScore * 100}%`, background: c.bar }} />
  //                     </div>
  //                     {evaluation.reasoning && (
  //                       <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "0.6rem", lineHeight: 1.6 }}>
  //                         {evaluation.reasoning}
  //                       </p>
  //                     )}
  //                     {evaluation.flaggedClaims.length > 0 && (
  //                       <div style={{ marginTop: "0.75rem" }}>
  //                         <div style={{ fontSize: "0.6rem", color: "rgba(239,68,68,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
  //                           Flagged
  //                         </div>
  //                         {evaluation.flaggedClaims.map((c2, i) => (
  //                           <div key={i} style={{
  //                             fontSize: "0.65rem", color: "#f87171",
  //                             background: "rgba(239,68,68,0.06)",
  //                             border: "1px solid rgba(239,68,68,0.15)",
  //                             borderRadius: "4px", padding: "0.4rem 0.5rem",
  //                             marginBottom: "0.3rem", lineHeight: 1.5,
  //                           }}>
  //                             "{c2}"
  //                           </div>
  //                         ))}
  //                       </div>
  //                     )}
  //                     {fromCache && (
  //                       <div style={{ marginTop: "0.6rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>
  //                         ◈ Served from cache · 0 tokens
  //                       </div>
  //                     )}
  //                   </>
  //                 );
  //               })()}
  //             </div>
  //           )}

  //           {/* Subscribe */}
  //           <div className="nb-card">
  //             <span className="nb-label">Subscribe</span>
  //             <input
  //               className="nb-input"
  //               type="email"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //               onKeyDown={(e) => e.key === "Enter" && subscribe()}
  //               placeholder="your@email.com"
  //               style={{ marginBottom: "0.75rem" }}
  //             />
  //             <div style={{ marginBottom: "0.75rem" }}>
  //               <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
  //                 Topics — select up to 5
  //               </div>
  //               <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
  //                 {TOPICS.map((t) => (
  //                   <button key={t.id} className={`topic-chip ${selectedTopics.includes(t.id) ? "active" : ""}`}
  //                     onClick={() => toggleTopic(t.id)}>
  //                     <span style={{ fontSize: "0.65rem" }}>{t.icon}</span>
  //                     {t.label}
  //                   </button>
  //                 ))}
  //               </div>
  //             </div>
  //             <button className="nb-btn-primary" onClick={subscribe} disabled={subscribing}>
  //               {subscribing ? "Subscribing..." : "Subscribe"}
  //             </button>
  //           </div>
  //         </aside>

  //         {/* Main content */}
  //         <main style={{ padding: "2rem", overflow: "auto" }}>
  //           {loading ? (
  //             <div style={{ maxWidth: "640px" }}>
  //               <div style={{ marginBottom: "2rem" }}>
  //                 <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#c9a84c", marginBottom: "0.75rem", fontFamily: "'DM Mono', monospace" }}>
  //                   {dotFrame} GENERATING NEWSLETTER
  //                 </div>
  //                 <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
  //                   Running multi-agent pipeline...
  //                 </div>
  //               </div>
  //               <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
  //                 {[1, 0.7, 0.9, 0.5, 0.8, 0.6, 0.85, 0.4, 0.75, 0.55].map((w, i) => (
  //                   <div key={i} className="loading-line"
  //                     style={{ width: `${w * 100}%`, animationDelay: `${i * 0.1}s` }} />
  //                 ))}
  //               </div>
  //             </div>
  //           ) : newsletter ? (
  //             <div ref={newsletterRef} className="newsletter-content" style={{ maxWidth: "680px" }}>
  //               {/* Send banner */}
  //               <div style={{
  //                 display: "flex", alignItems: "center", justifyContent: "space-between",
  //                 padding: "0.65rem 0.875rem",
  //                 background: "rgba(201,168,76,0.06)",
  //                 border: "1px solid rgba(201,168,76,0.15)",
  //                 borderRadius: "6px",
  //                 marginBottom: "2rem",
  //               }}>
  //                 <span style={{ fontSize: "0.72rem", color: "rgba(201,168,76,0.7)" }}>
  //                   Ready to deliver · {fromCache ? "cached edition" : "freshly generated"}
  //                 </span>
  //                 <button onClick={sendToSubscribers} disabled={sending}
  //                   style={{
  //                     padding: "0.3rem 0.75rem",
  //                     background: "#c9a84c",
  //                     color: "#0d0d0f",
  //                     border: "none",
  //                     borderRadius: "4px",
  //                     fontSize: "0.7rem",
  //                     fontWeight: 600,
  //                     cursor: "pointer",
  //                     fontFamily: "'DM Sans', sans-serif",
  //                   }}>
  //                   {sending ? "Sending..." : "Send Now ↗"}
  //                 </button>
  //               </div>

  //               {/* Newsletter body */}
  //               <div style={{ lineHeight: 1 }}>
  //                 {formatNewsletter(newsletter)}
  //               </div>
  //             </div>
  //           ) : (
  //             <div style={{
  //               display: "flex", flexDirection: "column",
  //               alignItems: "center", justifyContent: "center",
  //               height: "60vh", gap: "1rem",
  //             }}>
  //               <div style={{
  //                 width: "48px", height: "48px",
  //                 border: "1px solid rgba(255,255,255,0.08)",
  //                 borderRadius: "10px",
  //                 display: "grid", placeItems: "center",
  //                 fontSize: "1.25rem",
  //                 color: "rgba(255,255,255,0.15)",
  //               }}>
  //                 ✦
  //               </div>
  //               <div style={{ textAlign: "center" }}>
  //                 <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>
  //                   No edition generated yet
  //                 </p>
  //                 <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
  //                   Click "Generate Newsletter" to run the pipeline
  //                 </p>
  //               </div>
  //               <button className="nb-btn-primary" onClick={() => generate(false)}
  //                 style={{ width: "auto", padding: "0.6rem 1.5rem", marginTop: "0.5rem" }}>
  //                 Generate Newsletter
  //               </button>

  //               {/* Edition info strip */}
  //               <div style={{
  //                 marginTop: "2rem",
  //                 display: "flex", gap: "2rem",
  //                 padding: "1rem 1.5rem",
  //                 background: "rgba(255,255,255,0.02)",
  //                 border: "1px solid rgba(255,255,255,0.05)",
  //                 borderRadius: "8px",
  //               }}>
  //                 {[
  //                   { label: "Topics", value: "8" },
  //                   { label: "Agents", value: "4" },
  //                   { label: "Cache TTL", value: "12h" },
  //                   { label: "Evaluator", value: "On" },
  //                 ].map((s) => (
  //                   <div key={s.label} style={{ textAlign: "center" }}>
  //                     <div style={{ fontSize: "1rem", fontWeight: 700, color: "#c9a84c", fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
  //                     <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           )}
  //         </main>
  //       </div>
  //     </>
  //   );
  // }   



// "use client";

// import { useState } from "react";

// export default function SubscribePage() {
//   const [email, setEmail] = useState("");
//   const [subscribing, setSubscribing] = useState(false);
//   const [subscribed, setSubscribed] = useState(false);
//   const [error, setError] = useState("");

//   const subscribe = async () => {
//     setError("");
//     if (!email.includes("@") || !email.includes(".")) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     setSubscribing(true);
//     try {
//       const res = await fetch("/api/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       setSubscribed(true);
//     } catch {
//       // Graceful fallback for preview / no-backend
//       setSubscribed(true);
//     } finally {
//       setSubscribing(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
//         .font-cormorant { font-family: 'Cormorant', Georgia, serif; }
//         .font-dm { font-family: 'DM Sans', sans-serif; }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes shimmer {
//           0%,100% { opacity: 0.15; }
//           50%      { opacity: 0.35; }
//         }
//         .animate-fade-up { animation: fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards; }
//         .animate-shimmer { animation: shimmer 2.4s ease-in-out infinite; }
//         ::placeholder { color: rgba(216,180,254,0.25); }
//         ::-webkit-scrollbar { width: 3px; }
//         ::-webkit-scrollbar-thumb { background: rgba(147,51,234,0.25); border-radius: 2px; }
//       `}</style>

//       {/* ── Root ── */}
//       <div className="font-dm min-h-screen bg-[#09080f] text-white flex flex-col lg:flex-row">

//         {/* ── Left — Image + Branding ── */}
//         <div className="relative lg:w-[52%] h-[52vw] max-h-[420px] lg:h-auto lg:max-h-none overflow-hidden">

//           {/* Photo */}
//           <img
//             src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80"
//             alt="Globe — Meridian daily intelligence"
//             className="absolute inset-0 w-full h-full object-cover object-center"
//             style={{ filter: "brightness(0.28) saturate(0.5) hue-rotate(230deg)" }}
//           />

//           {/* Noise overlay */}
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
//               opacity: 0.6,
//             }}
//           />

//           {/* Purple gradient wash */}
//           <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 via-transparent to-violet-950/40 pointer-events-none" />

//           {/* Content */}
//           <div className="relative z-10 h-full flex flex-col justify-between p-9 lg:p-14">

//             {/* Logo */}
//             <div className="flex items-center gap-3">
//               <div className="w-[22px] h-[22px] rounded-[4px] border border-purple-400/50 grid place-items-center flex-shrink-0">
//                 <svg viewBox="0 0 12 12" className="w-[11px] h-[11px]" fill="none">
//                   <circle cx="6" cy="6" r="5" stroke="#a855f7" strokeWidth="0.75"/>
//                   <line x1="6" y1="1" x2="6" y2="11" stroke="#a855f7" strokeWidth="0.75"/>
//                   <line x1="1" y1="6" x2="11" y2="6" stroke="#a855f7" strokeWidth="0.75"/>
//                   <ellipse cx="6" cy="6" rx="2.6" ry="5" stroke="#a855f7" strokeWidth="0.75"/>
//                 </svg>
//               </div>
//               <span
//                 className="font-cormorant text-white/90 tracking-[0.22em] uppercase text-[0.8rem] font-light"
//               >
//                 Meridian
//               </span>
//             </div>

//             {/* Headline */}
//             <div className="max-w-sm">
//               <h1 className="font-cormorant text-white font-light leading-[1.1] mb-4"
//                 style={{ fontSize: "clamp(2rem, 3.8vw, 3.4rem)" }}>
//                 The world,{" "}
//                 <em className="text-purple-300 not-italic font-light">clearly</em>{" "}
//                 rendered.
//               </h1>
//               <p className="text-white/35 font-light text-[0.78rem] leading-[1.75] tracking-wide max-w-[280px]">
//                 AI breakthroughs, geopolitical shifts, energy markets and emerging tech —
//                 distilled into one precise daily read.
//               </p>
//             </div>

//             {/* Stats strip */}
//             <div className="flex gap-7 pt-5 border-t border-white/[0.07]">
//               {[
//                 { val: "8",     label: "Topics" },
//                 { val: "4",     label: "Agents"  },
//                 { val: "Daily", label: "Cadence" },
//                 { val: "Free",  label: "Always"  },
//               ].map((s) => (
//                 <div key={s.label} className="flex flex-col gap-[3px]">
//                   <span className="font-cormorant text-purple-300 font-normal leading-none text-[1.2rem]">
//                     {s.val}
//                   </span>
//                   <span className="text-white/25 font-light text-[0.55rem] tracking-[0.18em] uppercase">
//                     {s.label}
//                   </span>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>

//         {/* ── Right — Form Panel ── */}
//         <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-0 border-t border-white/[0.06] lg:border-t-0 lg:border-l lg:border-white/[0.06]">
//           <div className="w-full max-w-[360px] mx-auto lg:mx-0">

//             {!subscribed ? (

//               /* ── Subscribe form ── */
//               <div className="animate-fade-up">

//                 {/* Header */}
//                 <div className="mb-9">
//                   <p className="text-purple-400/70 font-light text-[0.58rem] tracking-[0.22em] uppercase mb-3">
//                     Free · No credit card
//                   </p>
//                   <h2 className="font-cormorant text-white font-light leading-[1.15] mb-3 text-[1.75rem]">
//                     Subscribe to the briefing.
//                   </h2>
//                   <p className="text-white/30 font-light text-[0.76rem] leading-[1.72]">
//                     Curated by AI agents, written for humans who value
//                     precision over volume. No noise. No filler.
//                   </p>
//                 </div>

//                 {/* Email input */}
//                 <div className="mb-4">
//                   <label
//                     htmlFor="email"
//                     className="block text-white/30 font-light text-[0.57rem] tracking-[0.18em] uppercase mb-2"
//                   >
//                     Email address
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     autoComplete="email"
//                     onChange={(e) => { setEmail(e.target.value); setError(""); }}
//                     onKeyDown={(e) => e.key === "Enter" && subscribe()}
//                     placeholder="you@example.com"
//                     className="w-full bg-white/[0.035] border border-white/[0.09] rounded-[5px] px-4 py-[0.7rem] text-[0.79rem] font-light text-white/90 outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/[0.055]"
//                     style={{ caretColor: "#a855f7" }}
//                   />
//                   {error && (
//                     <p className="mt-2 text-[0.65rem] text-red-400/80 font-light">{error}</p>
//                   )}
//                 </div>

//                 {/* Subscribe button */}
//                 <button
//                   onClick={subscribe}
//                   disabled={subscribing}
//                   className="w-full flex items-center justify-center gap-2 py-[0.78rem] rounded-[5px] text-[0.75rem] font-medium tracking-[0.06em] uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
//                   style={{
//                     background: subscribing
//                       ? "rgba(147,51,234,0.5)"
//                       : "linear-gradient(135deg, #7c3aed 0%, #9333ea 60%, #a855f7 100%)",
//                     color: "#fff",
//                     boxShadow: subscribing ? "none" : "0 0 28px rgba(139,92,246,0.22)",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!subscribing) e.currentTarget.style.boxShadow = "0 0 38px rgba(139,92,246,0.38)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.boxShadow = "0 0 28px rgba(139,92,246,0.22)";
//                   }}
//                 >
//                   {subscribing ? (
//                     <>
//                       <svg className="w-[13px] h-[13px] animate-spin" viewBox="0 0 16 16" fill="none">
//                         <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" strokeDasharray="22 10"/>
//                       </svg>
//                       Subscribing…
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-[13px] h-[13px]" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
//                         <path d="M2 7h10M8 3l4 4-4 4"/>
//                       </svg>
//                       Subscribe to Meridian
//                     </>
//                   )}
//                 </button>

//                 {/* Fine print */}
//                 <p className="mt-5 text-white/18 font-light text-[0.62rem] text-center leading-[1.65] tracking-wide">
//                   No spam, ever. One click to unsubscribe.
//                   <br />
//                   Your data is never sold or shared.
//                 </p>

//                 {/* Shimmer divider */}
//                 <div className="mt-9 flex items-center gap-4">
//                   <div className="flex-1 h-px bg-white/[0.06]" />
//                   <span className="text-white/15 font-light text-[0.58rem] tracking-[0.15em] uppercase">
//                     AI · Energy · Geopolitics · India
//                   </span>
//                   <div className="flex-1 h-px bg-white/[0.06]" />
//                 </div>

//                 {/* Social proof dots */}
//                 <div className="mt-5 flex items-center gap-3">
//                   <div className="flex -space-x-[7px]">
//                     {["#7c3aed","#9333ea","#6d28d9","#8b5cf6"].map((c, i) => (
//                       <div
//                         key={i}
//                         className="w-[22px] h-[22px] rounded-full border border-[#09080f] flex items-center justify-center text-[9px] font-medium text-white/70"
//                         style={{ background: c }}
//                       >
//                         {["A","R","S","K"][i]}
//                       </div>
//                     ))}
//                   </div>
//                   <p className="text-white/25 font-light text-[0.65rem]">
//                     Join <span className="text-purple-400/70">4,200+</span> readers
//                   </p>
//                 </div>

//               </div>

//             ) : (

//               /* ── Thank you state ── */
//               <div className="animate-fade-up text-center">

//                 {/* Checkmark ring */}
//                 <div className="w-[52px] h-[52px] rounded-full border border-purple-500/30 flex items-center justify-center mx-auto mb-7"
//                   style={{ boxShadow: "0 0 32px rgba(139,92,246,0.15)" }}>
//                   <svg className="w-5 h-5 text-purple-400" viewBox="0 0 20 20" fill="none"
//                     stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                     <polyline points="4 10 8.5 14.5 16 6"/>
//                   </svg>
//                 </div>

//                 <h2 className="font-cormorant text-white font-light text-[1.9rem] leading-[1.15] mb-3">
//                   You&apos;re on the list.
//                 </h2>
//                 <p className="text-white/35 font-light text-[0.78rem] leading-[1.75] max-w-[260px] mx-auto">
//                   Meridian will arrive at{" "}
//                   <span className="text-purple-300/80">{email}</span>
//                   {" "}starting tomorrow.
//                   <br />
//                   Check your inbox to confirm.
//                 </p>

//                 {/* Pulse rings decoration */}
//                 <div className="relative flex justify-center mt-9">
//                   <div className="w-[6px] h-[6px] rounded-full bg-purple-500/60" />
//                   <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] rounded-full border border-purple-500/20 animate-shimmer" />
//                   <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[26px] h-[26px] rounded-full border border-purple-500/10 animate-shimmer" style={{ animationDelay: "0.3s" }}/>
//                 </div>

//               </div>

//             )}
//           </div>
//         </div>

//       </div>
//     </>
//   );
// }   



"use client";

import { useState } from "react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const subscribe = async () => {
    setError("");
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter a valid email address.");
      return;
    }
    setSubscribing(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100;0,200;0,300;0,400;1,100;1,200;1,300&family=DM+Sans:wght@200;300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ff  { font-family: 'Libre Franklin', 'Franklin Gothic Medium', Arial Narrow, sans-serif; }
        .fds { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ripple {
          0%   { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(2.4);  opacity: 0; }
        }

        .afu { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .afi { animation: fadeIn 0.5s ease both; }
        .d1  { animation-delay: 0.05s; }
        .d2  { animation-delay: 0.14s; }
        .d3  { animation-delay: 0.23s; }
        .d4  { animation-delay: 0.32s; }
        .d5  { animation-delay: 0.40s; }

        .ripple-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1px solid rgba(168,85,247,0.35);
          animation: ripple 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        .ripple-ring-2 { animation-delay: 1.2s; }

        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0c0a16 inset !important;
          -webkit-text-fill-color: rgba(255,255,255,0.88) !important;
          caret-color: #a855f7;
        }

        ::placeholder { color: rgba(216,180,254,0.18); }
        ::-webkit-scrollbar { display: none; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 0.72rem 1rem;
          color: rgba(255,255,255,0.88);
          font-size: 0.8rem;
          font-weight: 300;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          caret-color: #a855f7;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          margin-bottom: 0.75rem;
        }
        .input-field:focus {
          border-color: rgba(168,85,247,0.42);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.07);
        }

        .btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 6px;
          padding: 0.78rem 1rem;
          font-family: 'Libre Franklin', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%);
          box-shadow: 0 4px 24px rgba(124,58,237,0.3), 0 1px 4px rgba(0,0,0,0.5);
          transition: box-shadow 0.2s, transform 0.15s, opacity 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 6px 36px rgba(124,58,237,0.48), 0 1px 6px rgba(0,0,0,0.5);
          transform: translateY(-1px);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 16px rgba(124,58,237,0.3);
        }
        .btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>

      {/* ─── Root ─── */}
      <div
        className="ff min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "#09080f" }}
      >

        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=75"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          style={{ filter: "brightness(0.11) saturate(0.35) hue-rotate(235deg)", transform: "scale(1.05)" }}
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 65% 52% at 50% 50%, rgba(109,40,217,0.15) 0%, transparent 68%)",
          }}
        />

        {/* Top fade */}
        <div
          className="absolute inset-x-0 top-0 h-36 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(9,8,15,0.95), transparent)" }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(9,8,15,0.95), transparent)" }}
        />

        {/* ─── Content card ─── */}
        <div className="relative z-10 w-full px-6" style={{ maxWidth: 400 }}>

          {/* Logo mark */}
          <div className="afu flex items-center justify-center gap-[10px] mb-12">
            <div
              style={{
                width: 20, height: 20,
                border: "1px solid rgba(168,85,247,0.4)",
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 12 12" style={{ width: 10, height: 10 }} fill="none">
                <circle cx="6" cy="6" r="5"           stroke="#a855f7" strokeWidth="0.8"/>
                <line x1="6" y1="1" x2="6" y2="11"   stroke="#a855f7" strokeWidth="0.8"/>
                <line x1="1" y1="6" x2="11" y2="6"   stroke="#a855f7" strokeWidth="0.8"/>
                <ellipse cx="6" cy="6" rx="2.5" ry="5" stroke="#a855f7" strokeWidth="0.8"/>
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontWeight: 200,
                fontSize: "0.7rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Meridian
            </span>
          </div>

          {!subscribed ? (

            /* ─── Subscribe form ─── */
            <>
              {/* Eyebrow */}
              <p
                className="afu d1 fds text-center"
                style={{
                  fontSize: "0.54rem",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(192,132,252,0.55)",
                  marginBottom: "1rem",
                }}
              >
                Daily Intelligence · Free
              </p>

              {/* Headline */}
              <h1
                className="afu d2 text-center text-white"
                style={{
                  fontSize: "clamp(2rem, 6vw, 2.85rem)",
                  fontWeight: 100,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.08,
                  marginBottom: "1rem",
                }}
              >
                The world,{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 200,
                    color: "#c084fc",
                  }}
                >
                  clearly
                </em>{" "}
                rendered.
              </h1>

              {/* Sub */}
              <p
                className="afu d3 fds text-center"
                style={{
                  fontSize: "0.77rem",
                  fontWeight: 300,
                  lineHeight: 1.72,
                  color: "rgba(255,255,255,0.28)",
                  maxWidth: 300,
                  margin: "0 auto 2.75rem",
                }}
              >
                AI breakthroughs, geopolitical shifts, and emerging tech —
                distilled into one precise daily read.
              </p>

              {/* Form */}
              <div className="afu d4">
                <label
                  htmlFor="email"
                  className="fds"
                  style={{
                    display: "block",
                    fontSize: "0.54rem",
                    fontWeight: 300,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.26)",
                    marginBottom: "0.55rem",
                  }}
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && subscribe()}
                  placeholder="you@example.com"
                  className="input-field"
                />

                {error && (
                  <p
                    className="fds"
                    style={{
                      fontSize: "0.63rem",
                      fontWeight: 300,
                      color: "rgba(248,113,113,0.8)",
                      marginTop: "-0.4rem",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  onClick={subscribe}
                  disabled={subscribing}
                  className="btn-primary"
                >
                  {subscribing ? (
                    <>
                      <svg
                        style={{ width: 13, height: 13, animation: "spin 0.8s linear infinite" }}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" strokeDasharray="22 10"/>
                      </svg>
                      Subscribing…
                    </>
                  ) : (
                    <>
                      Subscribe
                      <svg style={{ width: 12, height: 12 }} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 6h8M7 3l3 3-3 3"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Fine print */}
              <p
                className="afu d5 fds text-center"
                style={{
                  marginTop: "1.1rem",
                  fontSize: "0.58rem",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.15)",
                }}
              >
                No spam, ever. Unsubscribe in one click.
                <br />
                Your data is never sold or shared.
              </p>

              {/* Social proof */}
              <div
                className="afu d5 flex items-center justify-center gap-3"
                style={{ marginTop: "2rem" }}
              >
                <div style={{ display: "flex" }}>
                  {(["#7c3aed","#9333ea","#6d28d9","#8b5cf6"] as const).map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 20, height: 20,
                        borderRadius: "50%",
                        background: c,
                        border: "1.5px solid #09080f",
                        marginLeft: i === 0 ? 0 : -6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: "'Libre Franklin', sans-serif",
                      }}
                    >
                      {["A","R","S","K"][i]}
                    </div>
                  ))}
                </div>
                <span
                  className="fds"
                  style={{ fontSize: "0.62rem", fontWeight: 300, color: "rgba(255,255,255,0.2)" }}
                >
                  Join{" "}
                  <span style={{ color: "rgba(192,132,252,0.6)" }}>4,200+</span>{" "}
                  readers
                </span>
              </div>
            </>

          ) : (

            /* ─── Thank you ─── */
            <div className="afi" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* Ripple checkmark */}
              <div style={{ position: "relative", width: 54, height: 54, marginBottom: "2rem" }}>
                <div className="ripple-ring" />
                <div className="ripple-ring ripple-ring-2" />
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "rgba(109,40,217,0.1)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    boxShadow: "0 0 32px rgba(139,92,246,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{ width: 20, height: 20, color: "#c084fc" }}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 10 8.5 14.5 16 6"/>
                  </svg>
                </div>
              </div>

              <h2
                style={{
                  fontSize: "clamp(1.9rem, 5vw, 2.5rem)",
                  fontWeight: 100,
                  color: "#fff",
                  lineHeight: 1.08,
                  marginBottom: "0.9rem",
                }}
              >
                You&apos;re on the list.
              </h2>

              <p
                className="fds"
                style={{
                  fontSize: "0.77rem",
                  fontWeight: 300,
                  lineHeight: 1.72,
                  color: "rgba(255,255,255,0.28)",
                  maxWidth: 240,
                  marginBottom: "0.35rem",
                }}
              >
                Meridian will land in
              </p>

              <p
                className="fds"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 300,
                  color: "rgba(192,132,252,0.72)",
                  marginBottom: "1.25rem",
                }}
              >
                {email}
              </p>

              <p
                className="fds"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 300,
                  lineHeight: 1.72,
                  color: "rgba(255,255,255,0.18)",
                  maxWidth: 230,
                }}
              >
                Starting tomorrow. Check your inbox to confirm your subscription.
              </p>

            </div>

          )}
        </div>

        {/* Footer */}
        <div
          className="fds absolute bottom-5 left-0 right-0 flex justify-center z-10"
          style={{
            fontSize: "0.5rem",
            fontWeight: 300,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.09)",
          }}
        >
          AI · Energy · Geopolitics · India
        </div>

        {/* Spin keyframe */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}