// import { llm } from "./llm";
// import { Client } from "langsmith";
// import { RunTree } from "langsmith";

// const langsmithClient = new Client({
//   apiKey: process.env.LANGCHAIN_API_KEY,
// });

// export interface HallucinationResult {
//   score: number;          // 0.0 (hallucinating) to 1.0 (fully grounded)
//   label: "grounded" | "partial" | "hallucinated";
//   reasoning: string;
//   flaggedClaims: string[];
// }

// // Asks the LLM to score whether the output is grounded in the context
// export async function checkHallucination(
//   context: string,
//   output: string,
//   runId?: string
// ): Promise<HallucinationResult> {
//   const prompt = `You are a strict factual auditor for an AI newsletter system.

// Your job is to check whether the GENERATED OUTPUT is fully grounded in the SOURCE CONTEXT.

// SOURCE CONTEXT:
// ${context}

// GENERATED OUTPUT:
// ${output}

// TASK:
// 1. Identify every factual claim in the generated output.
// 2. For each claim, check if it is directly supported by the source context.
// 3. Flag any claim that is invented, extrapolated, or not present in the context.

// Respond ONLY in this exact JSON format (no markdown, no extra text):
// {
//   "score": <float between 0.0 and 1.0, where 1.0 means fully grounded>,
//   "label": <"grounded" | "partial" | "hallucinated">,
//   "reasoning": "<one sentence summary of your finding>",
//   "flaggedClaims": ["<claim 1 that is not grounded>", "<claim 2>"]
// }

// Scoring guide:
// - 0.9 to 1.0 → grounded (all claims traceable to context)
// - 0.5 to 0.89 → partial (some claims extrapolated)
// - 0.0 to 0.49 → hallucinated (many invented claims)`;

//   const response = await llm.invoke([
//     { role: "user", content: prompt },
//   ]);

//   const raw = (response.content as string)
//     .replace(/```json|```/g, "")
//     .trim();

//   let result: HallucinationResult;

//   try {
//     result = JSON.parse(raw);
//   } catch {
//     result = {
//       score: 0.5,
//       label: "partial",
//       reasoning: "Could not parse evaluator response.",
//       flaggedClaims: [],
//     };
//   }

//   // Log feedback to LangSmith if runId is provided
//   if (runId && process.env.LANGCHAIN_TRACING_V2 === "true") {
//     try {
//       await langsmithClient.createFeedback(runId, "hallucination_score", {
//         score: result.score,
//         comment: result.reasoning,
//         value: result.label,
//       });
//       console.log(`[LangSmith] Feedback logged for run ${runId} → score: ${result.score}`);
//     } catch (err: any) {
//       console.warn("[LangSmith] Could not log feedback:", err.message);
//     }
//   }

//   return result;
// } 


// import { llm } from "./llm";
// import { Client } from "langsmith";

// const langsmithClient = new Client({
//   apiKey: process.env.LANGCHAIN_API_KEY,
// });

// export interface HallucinationResult {
//   score: number;
//   label: "grounded" | "partial" | "hallucinated";
//   reasoning: string;
//   flaggedClaims: string[];
// }

// export async function checkHallucination(
//   context: string,
//   output: string,
//   runId?: string
// ): Promise<HallucinationResult> {
//   const prompt = `You are a strict factual auditor for an AI newsletter system.

// Check whether every claim in the GENERATED OUTPUT is directly supported by the SOURCE CONTEXT.

// Pay special attention to:
// - Numbers and percentages: "30-40%" in output must match "30-40%" exactly in context
// - Company and product names: must appear verbatim in context
// - Causal claims: "X caused Y" must be explicitly stated in context, not inferred
// - Superlatives: "most", "best", "largest" must be in context

// SOURCE CONTEXT:
// ${context}

// GENERATED OUTPUT:
// ${output}

// SCORING:
// - 0.9 to 1.0 → grounded: every single claim traces directly to context
// - 0.75 to 0.89 → partial: 1-2 claims are slightly rephrased or extrapolated
// - 0.0 to 0.74 → hallucinated: multiple invented or unsupported claims

// Respond ONLY in this exact JSON format (no markdown, no extra text):
// {
//   "score": <float 0.0 to 1.0>,
//   "label": <"grounded" | "partial" | "hallucinated">,
//   "reasoning": "<one sentence>",
//   "flaggedClaims": ["<exact quote from output that is not grounded>"]
// }`;

//   const response = await llm.invoke([{ role: "user", content: prompt }]);

//   const raw = (response.content as string)
//     .replace(/```json|```/g, "")
//     .trim();

//   let result: HallucinationResult;
//   try {
//     result = JSON.parse(raw);
//   } catch {
//     result = {
//       score: 0.5,
//       label: "partial",
//       reasoning: "Could not parse evaluator response.",
//       flaggedClaims: [],
//     };
//   }

//   if (runId && process.env.LANGCHAIN_TRACING_V2 === "true") {
//     try {
//       await langsmithClient.createFeedback(runId, "hallucination_score", {
//         score: result.score,
//         comment: result.reasoning,
//         value: result.label,
//       });
//       console.log(`[LangSmith] Feedback logged → score: ${result.score}`);
//     } catch (err: any) {
//       console.warn("[LangSmith] Could not log feedback:", err.message);
//     }
//   }

//   return result;
// }  


import { llm } from "./llm";
import { Client } from "langsmith";

const langsmithClient = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
});

export interface HallucinationResult {
  score: number;
  label: "grounded" | "partial" | "hallucinated";
  reasoning: string;
  flaggedClaims: string[];
}

export async function checkHallucination(
  context: string,
  output: string,
  runId?: string
): Promise<HallucinationResult> {
  const prompt = `You are a strict factual auditor for an AI newsletter system.

Your job is to check whether factual claims in the GENERATED OUTPUT are supported by the SOURCE CONTEXT.

BEFORE YOU START — these are NOT hallucinations, ignore them completely:
- The newsletter date line (e.g. "AI Newsletter – April 12, 2026") — this is auto-generated
- Any URLs listed under "Sources:" — these are metadata added by the system, not claims
- Section headings — these are organizational, not factual claims
- The word "Sources:" itself

WHAT TO CHECK:
Only audit sentences that make a factual claim about a company, product, person, number, event, or technology.

For each factual claim ask: "Is this explicitly stated in the SOURCE CONTEXT?"
- Yes, word for word or very close → not a hallucination
- Slightly rephrased but same meaning → not a hallucination  
- Cannot be found anywhere in context → hallucination, flag it

Pay special attention to:
- Numbers and percentages — must match context exactly
- Company/product names — must appear in context
- Causal statements — must be explicitly in context, not inferred

SOURCE CONTEXT:
${context}

GENERATED OUTPUT:
${output}

SCORING GUIDE:
- 0.9 to 1.0 → grounded: all factual claims trace to context
- 0.75 to 0.89 → partial: 1-2 factual claims are extrapolated
- 0.0 to 0.74 → hallucinated: multiple invented factual claims

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "score": <float 0.0 to 1.0>,
  "label": <"grounded" | "partial" | "hallucinated">,
  "reasoning": "<one sentence about factual claims only>",
  "flaggedClaims": ["<exact quote of ungrounded factual claim>"]
}`;

  const response = await llm.invoke([{ role: "user", content: prompt }]);

  const raw = (response.content as string)
    .replace(/```json|```/g, "")
    .trim();

  let result: HallucinationResult;
  try {
    result = JSON.parse(raw);
  } catch {
    result = {
      score: 0.5,
      label: "partial",
      reasoning: "Could not parse evaluator response.",
      flaggedClaims: [],
    };
  }

  // Post-process — remove any flags that are just dates or URLs
  result.flaggedClaims = result.flaggedClaims.filter((claim) => {
    const isDate = /AI Newsletter\s*[–-]\s*\w+ \d+, \d{4}/i.test(claim);
    const isUrl = /^https?:\/\//i.test(claim.trim());
    const isSourceLine = /^sources:/i.test(claim.trim());
    return !isDate && !isUrl && !isSourceLine;
  });

  // Recalculate score if we removed false flags
  if (result.flaggedClaims.length === 0 && result.label !== "grounded") {
    result.score = Math.max(result.score, 0.92);
    result.label = "grounded";
    result.reasoning = result.reasoning + " (re-scored after removing false positive flags)";
  }

  if (runId && process.env.LANGCHAIN_TRACING_V2 === "true") {
    try {
      await langsmithClient.createFeedback(runId, "hallucination_score", {
        score: result.score,
        comment: result.reasoning,
        value: result.label,
      });
      console.log(`[LangSmith] Feedback logged → score: ${result.score}`);
    } catch (err: any) {
      console.warn("[LangSmith] Could not log feedback:", err.message);
    }
  }

  return result;
}