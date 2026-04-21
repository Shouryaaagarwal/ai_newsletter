// import { researchAgent } from "./researchAgent";
// import { writerAgent } from "./writerAgent";
// import { editorAgent } from "./editorAgent";
// import { NewsletterState } from "./types";

// const TOPICS = [
//   "ai_research",
//   "energy",
//   "geopolitics",
//   "india_ai",
//   "india_impact_synthesis",
// ]; 
// const processed = new Set()

// export async function runMultiAgentNewsletter(): Promise<{
//   newsletter: string;
//   evaluation: {
//     score: number;
//     label: string;
//     flaggedClaims: string[];
//   };
// }> {
//   console.log("[Orchestrator] Starting multi-agent pipeline...");

//   const agentResults = await Promise.all(
//     TOPICS.map(async (topic) => {  
//         if (processed.has(topic)) return null;
//     processed.add(topic);
//       let state: NewsletterState = {
//         topic,
//         docs: [],
//         draft: "",
//         hallucinationScore: 0,
//         approved: false,
//       };

//       state = { ...state, ...(await researchAgent(state)) };
//       state = { ...state, ...(await writerAgent(state)) };

//       console.log(`[Orchestrator] Topic "${topic}" completed`);
//       return state;
//     })
//   );

//   const validResults = agentResults.filter((r): r is NewsletterState => r !== null);
//   const drafts = validResults.map(r => r.draft).filter(Boolean) as string[];
//   const allDocs = validResults.flatMap(r => r.docs);

//   const result = await editorAgent(drafts, allDocs);

//   console.log(`[Orchestrator] Grounded score: ${result.score}`);

//   return {
//     newsletter: result.newsletter,
//     evaluation: {
//       score: result.score,
//       label: result.label,
//       flaggedClaims: result.flaggedClaims,
//     },
//   };
// }  


// import { researchAgent } from "./researchAgent";
// import { writerAgent } from "./writerAgent";
// import { editorAgent } from "./editorAgent";
// import { NewsletterState } from "./types";

// const TOPICS = [
//   "ai_research",
//   "energy",
//   "geopolitics",
//   "india_ai",
//   "india_impact_synthesis",
// ];

// const processed = new Set<string>();

// export async function runMultiAgentNewsletter(): Promise<{
//   newsletter: string;
//   evaluation: {
//     score: number;
//     label: string;
//     flaggedClaims: string[];
//   };
// }> {
//   console.log("[Orchestrator] Starting multi-agent pipeline...");

//   const agentResults = await Promise.all(
//     TOPICS.map(async (topic) => {
//       if (processed.has(topic)) return null;
//       processed.add(topic);

//       let state: NewsletterState = {
//         topic,
//         docs: [],
//         draft: "",
//         hallucinationScore: 0,
//         approved: false,
//       };

//       state = { ...state, ...(await researchAgent(state)) };
//       state = { ...state, ...(await writerAgent(state)) };

//       console.log(`[Orchestrator] Topic "${topic}" completed`);
//       return state;
//     })
//   );

//   const validResults = agentResults.filter(
//     (r): r is NewsletterState => r !== null
//   );

//   const drafts = validResults.map((r) => r.draft).filter(Boolean) as string[];

//   // 🔥 QUALITY FILTER (ADDED HERE)
//   const highQualityDrafts = drafts.filter((d) => {
//     return (
//       d.length > 120 &&
//       !/could|might|may|generally|often|typically/i.test(d) &&
//       d.split(".").length >= 2
//     );
//   });

//   console.log(
//     `[Orchestrator] Filtered ${highQualityDrafts.length} high-quality drafts from ${drafts.length}`
//   );

//   const allDocs = validResults.flatMap((r) => r.docs);

//   const result = await editorAgent(highQualityDrafts, allDocs);

//   console.log(`[Orchestrator] Grounded score: ${result.score}`);

//   return {
//     newsletter: result.newsletter,
//     evaluation: {
//       score: result.score,
//       label: result.label,
//       flaggedClaims: result.flaggedClaims,
//     },
//   };
// }  



import { researchAgent } from "./researchAgent";
import { writerAgent } from "./writerAgent";
import { editorAgent } from "./editorAgent";
import { NewsletterState } from "./types";

const TOPICS = [
  "ai_research",
  "energy",
  "geopolitics",
  "india_ai",
  "india_impact_synthesis",
];

export async function runMultiAgentNewsletter(forceRefresh = false): Promise<{
  newsletter: string;
  evaluation: {
    score: number;
    label: string;
    flaggedClaims: string[];
    confidence: number; // 🔥 added
  };
}> {
  console.log("[Orchestrator] Starting multi-agent pipeline...");

  // ✅ FIX: scoped per request
  const processed = new Set<string>();

  const agentResults = await Promise.all(
    TOPICS.map(async (topic) => {
      if (processed.has(topic)) return null;
      processed.add(topic);

      let state: NewsletterState = {
        topic,
        docs: [],
        draft: "",
        hallucinationScore: 0,
        approved: false,
      };

      state = { ...state, ...(await researchAgent(state)) };
      state = { ...state, ...(await writerAgent(state)) };

      console.log(`[Orchestrator] Topic "${topic}" completed`);
      return state;
    })
  );

  const validResults = agentResults.filter(
    (r): r is NewsletterState => r !== null
  );

  const drafts = validResults.map((r) => r.draft).filter(Boolean) as string[];

  // ✅ BALANCED FILTER (not too aggressive)
  const highQualityDrafts = drafts.filter((d) => {
    return (
      d.length > 100 &&
      d.split(".").length >= 2 &&
      !/no information|there is no|context does not/i.test(d)
    );
  });

  // ✅ FALLBACK (critical for stability)
  const finalDrafts =
    highQualityDrafts.length > 0 ? highQualityDrafts : drafts;

  console.log(
    `[Orchestrator] Using ${finalDrafts.length} drafts (filtered from ${drafts.length})`
  );

  const allDocs = validResults.flatMap((r) => r.docs);

  const result = await editorAgent(finalDrafts, allDocs);

  // 🔥 CONFIDENCE CALCULATION (NEW)
  const topicCoverage = finalDrafts.length / TOPICS.length; // how many topics survived
  const avgDraftLength =
    finalDrafts.reduce((sum, d) => sum + d.length, 0) /
    (finalDrafts.length || 1);

  let confidence = result.score;

  // Boost if good coverage
  if (topicCoverage >= 0.8) confidence += 0.03;
  else if (topicCoverage < 0.5) confidence -= 0.05;

  // Boost if rich content
  if (avgDraftLength > 400) confidence += 0.02;
  else if (avgDraftLength < 200) confidence -= 0.03;

  // Clamp between 0 and 1
  confidence = Math.max(0, Math.min(1, confidence));

  console.log(
    `[Orchestrator] Score: ${result.score} | Confidence: ${confidence.toFixed(
      2
    )} | Coverage: ${(topicCoverage * 100).toFixed(0)}%`
  );

  return {
    newsletter: result.newsletter,
    evaluation: {
      score: result.score,
      label: result.label,
      flaggedClaims: result.flaggedClaims,
      confidence: Number(confidence.toFixed(2)),
    },
  };
}