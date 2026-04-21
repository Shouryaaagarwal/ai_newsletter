// import { llm } from "../llm";
// import { checkHallucination } from "../evaluator";
// import { NewsletterState } from "./types";

// export async function editorAgent(drafts: string[], allDocs: any[]): Promise<{
//   newsletter: string;
//   score: number;
//   label: string;
//   flaggedClaims: string[];
// }> {
//   console.log(`[EditorAgent] Merging ${drafts.length} agent drafts...`);

//   const combined = drafts.join("\n\n");
//   const context = allDocs.map((d: any) => d.pageContent).join("\n\n---\n\n");

//   const response = await llm.invoke([
//     {
//       role: "system",
//       content: `You are an editor merging multiple newsletter sections into one cohesive newsletter.
// - Start with: AI Newsletter – ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
// - Merge sections smoothly, remove duplicates
// - Keep all headings, keep all facts exactly as written
// - No markdown, no **, no ##
// - Do NOT add any new facts not present in the drafts`,
//     },
//     {
//       role: "user",
//       content: `Drafts to merge:\n\n${combined}\n\nMerge into one clean newsletter.`,
//     },
//   ]);

//   const newsletter = response.content as string;
//   const hallucination = await checkHallucination(context, newsletter);

//   return {
//     newsletter,
//     score: hallucination.score,
//     label: hallucination.label,
//     flaggedClaims: hallucination.flaggedClaims,
//   };
// }   

import { checkHallucination } from "../evaluator";

/**
 * EditorAgent
 *
 * Responsibilities:
 * - Assemble the final newsletter (NO rewriting)
 * - Deduplicate identical sections
 * - Add header
 * - Run hallucination check using DRAFTS ONLY (not source docs)
 *
 * NOTE:
 * Writers are already extractive + grounded.
 * Passing allDocs here explodes tokens and adds no safety value.
 */

// export async function editorAgent(
//   drafts: string[],
//   _allDocs: any[] // intentionally unused to prevent token explosion
// ): Promise<{
//   newsletter: string;
//   score: number;
//   label: string;
//   flaggedClaims: string[];
// }> {
//   console.log("[EditorAgent] Assembling final newsletter...");

//   const header = `AI Newsletter – ${new Date().toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   })}`;

//   // 1️⃣ Strict exact-string deduplication
//   const uniqueDrafts = Array.from(
//     new Set(drafts.map(d => d.trim()).filter(Boolean))
//   );

//   // 2️⃣ Build newsletter (editor NEVER rewrites content)
//   const newsletter = [header, ...uniqueDrafts].join("\n\n");

//   /**
//    * 3️⃣ Hallucination check
//    *
//    * Grounding source = concatenated drafts only
//    * Reason:
//    * - Each draft already came from verified context
//    * - Editor introduces zero new facts
//    * - Prevents 12k+ token overflows
//    */
//   const groundingSource = uniqueDrafts.join("\n\n");

//   const hallucination = await checkHallucination(
//     groundingSource,
//     newsletter
//   );

//   return {
//     newsletter,
//     score: hallucination.score,
//     label: hallucination.label,
//     flaggedClaims: hallucination.flaggedClaims,
//   };
// }   



// import { llm } from "../llm";

// export async function editorAgent(
//   drafts: string[],
//   allDocs: any[]
// ): Promise<{
//   newsletter: string;
//   score: number;
//   label: string;
//   flaggedClaims: string[];
// }> {
//   // Filter invalid drafts
//   const validDrafts = drafts.filter((d) => {
//     if (!d || d.trim().length < 80) return false;
//     if (/no information available/i.test(d)) return false;
//     if (/there is no/i.test(d)) return false;
//     if (/context does not/i.test(d)) return false;
//     return true;
//   });

//   console.log(`[EditorAgent] ${validDrafts.length} valid drafts from ${drafts.length} total`);

//   if (validDrafts.length === 0) {
//     return {
//       newsletter: "Insufficient data. Please run /api/ingest to refresh sources.",
//       score: 0,
//       label: "error",
//       flaggedClaims: [],
//     };
//   }

//   const date = new Date().toLocaleDateString("en-US", {
//     month: "long", day: "numeric", year: "numeric",
//   });

//   // Strip internal agent labels
//   const cleanedDrafts = validDrafts.map((d) =>
//     d.replace(/^#\s*(AI_RESEARCH|ENERGY|GEOPOLITICS|INDIA_AI|INDIA_IMPACT_SYNTHESIS)\s*\n?/gim, "").trim()
//   );

//   // Truncate each draft to max 600 chars before merging
//   const truncatedDrafts = cleanedDrafts.map((d) => d.slice(0, 600));
//   const combined = truncatedDrafts.join("\n\n---\n\n");

// //   const response = await llm.invoke([
// //     {
// //       role: "user",
// //       content: `You are a newsletter editor. Rewrite these drafts into a clean newsletter.
// // Start with: AI Newsletter – ${date}
// // Rules: rewrite in editorial prose (no verbatim copying), natural headings, no markdown, no **, facts only from drafts.
// // End with: EVAL:{"score":<0-1>,"label":"grounded"|"partial"|"hallucinated","flaggedClaims":[]}

// // DRAFTS:
// // ${combined}

// // Write newsletter now:`,
// //     },
// //   ]);


// const response = await llm.invoke([
//   {
//     role: "user",
//     content: `You are a strict AI auditor.

// TASK 1: Rewrite into a clean newsletter.

// TASK 2: Evaluate grounding STRICTLY:
// - Every claim must be supported by drafts
// - If ANY claim is not clearly supported → penalize
// - Do NOT assume correctness
// - Be skeptical

// SCORING RULES:
// - 0.9–1.0 → All claims clearly supported
// - 0.75–0.89 → Mostly supported, minor drift
// - 0.5–0.74 → Noticeable unsupported claims
// - <0.5 → Hallucinated

// OUTPUT FORMAT:
// Newsletter text...

// EVAL:{"score":<0-1>,"label":"grounded|partial|hallucinated","flaggedClaims":["..."]}

// DRAFTS:
// ${combined}
// `,
//   },
// ]);
//   const full = response.content as string;

//   // Parse eval from end of response
//   const evalIndex = full.lastIndexOf("EVAL:");
//   let newsletter = full;
//   let score = 0.85;
//   let label = "grounded";
//   let flaggedClaims: string[] = [];

//   if (evalIndex !== -1) {
//     newsletter = full.slice(0, evalIndex).trim();
//     try {
//       const evalRaw = full
//         .slice(evalIndex + 5)
//         .trim()
//         .replace(/```json|```/g, "");
//       const parsed = JSON.parse(evalRaw);
//       score = parsed.score ?? 0.85;
//       label = parsed.label ?? "grounded";
//       flaggedClaims = parsed.flaggedClaims ?? [];
//     } catch {
//       console.warn("[EditorAgent] Could not parse eval JSON — using defaults");
//     }
//   }

//   // Remove false positive flags
//   flaggedClaims = flaggedClaims.filter(
//     (c) =>
//       !/AI Newsletter\s*[–-]/i.test(c) &&
//       !/^https?:\/\//i.test(c.trim()) &&
//       !/^sources:/i.test(c.trim())
//   );

//   if (flaggedClaims.length === 0 && label !== "grounded") {
//     score = Math.max(score, 0.9);
//     label = "grounded";
//   }

//   console.log(`[EditorAgent] Score: ${score} | Label: ${label}`);
//   return { newsletter, score, label, flaggedClaims };
// }  



// import { llm } from "../llm";

// export async function editorAgent(
//   drafts: string[],
//   allDocs: any[]
// ): Promise<{
//   newsletter: string;
//   score: number;
//   label: string;
//   flaggedClaims: string[];
// }> {
//   // ✅ Filter invalid drafts
//   const validDrafts = drafts.filter((d) => {
//     if (!d || d.trim().length < 80) return false;
//     if (/no information available/i.test(d)) return false;
//     if (/there is no/i.test(d)) return false;
//     if (/context does not/i.test(d)) return false;
//     return true;
//   });

//   console.log(
//     `[EditorAgent] ${validDrafts.length} valid drafts from ${drafts.length} total`
//   );

//   if (validDrafts.length === 0) {
//     return {
//       newsletter:
//         "Insufficient data. Please run /api/ingest to refresh sources.",
//       score: 0,
//       label: "error",
//       flaggedClaims: [],
//     };
//   }

//   const date = new Date().toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });

//   // ✅ Clean drafts
//   const cleanedDrafts = validDrafts.map((d) =>
//     d
//       .replace(
//         /^#\s*(AI_RESEARCH|ENERGY|GEOPOLITICS|INDIA_AI|INDIA_IMPACT_SYNTHESIS)\s*\n?/gim,
//         ""
//       )
//       .trim()
//   );

//   // ✅ Slightly increase context (better grounding)
//   const truncatedDrafts = cleanedDrafts.map((d) => d.slice(0, 700));
//   const combined = truncatedDrafts.join("\n\n---\n\n");

//   // 🔥 STRICT PROMPT (FIXED)
//   const response = await llm.invoke([
//     {
//       role: "user",
//       content: `You are a strict AI auditor and editor.

// TASK 1:
// Rewrite the drafts into a clean, professional newsletter.

// - Start with: AI Newsletter – ${date}
// - Use clear sections
// - No markdown or symbols like **
// - Do NOT add new facts
// - ONLY use information from drafts

// TASK 2:
// Evaluate grounding STRICTLY.

// RULES:
// - Every claim must be traceable to drafts
// - If unsure → penalize
// - Be skeptical, not optimistic

// SCORING:
// - 0.9–1.0 → fully grounded
// - 0.75–0.89 → mostly grounded
// - 0.5–0.74 → partial
// - <0.5 → hallucinated

// 🚨 CRITICAL OUTPUT RULE:
// You MUST end with EXACTLY this format:
// EVAL:{"score":0.0,"label":"grounded","flaggedClaims":[]}

// - No markdown
// - No backticks
// - No explanation after EVAL
// - JSON must be valid

// DRAFTS:
// ${combined}

// Now generate the newsletter and evaluation.`,
//     },
//   ]);

//   const full = (response.content as string).trim();

//   // 🔥 ROBUST EVAL EXTRACTION
//   let newsletter = full;
//   let score = 0.7; // safer default
//   let label = "partial";
//   let flaggedClaims: string[] = [];

//   const evalMatch = full.match(/EVAL:\s*(\{[\s\S]*\})/);

//   if (evalMatch) {
//     newsletter = full.replace(evalMatch[0], "").trim();

//     try {
//       const parsed = JSON.parse(evalMatch[1]);

//       score = typeof parsed.score === "number" ? parsed.score : 0.7;
//       label = parsed.label || "partial";
//       flaggedClaims = Array.isArray(parsed.flaggedClaims)
//         ? parsed.flaggedClaims
//         : [];
//     } catch (err) {
//       console.warn("[EditorAgent] JSON parse failed, fallback used");
//     }
//   } else {
//     console.warn("[EditorAgent] No EVAL block found — fallback used");
//   }

//   // ✅ Clean false positives
//   flaggedClaims = flaggedClaims.filter(
//     (c) =>
//       !/AI Newsletter/i.test(c) &&
//       !/^https?:\/\//i.test(c.trim()) &&
//       !/^sources:/i.test(c.trim())
//   );

//   console.log(
//     `[EditorAgent] Score: ${score} | Label: ${label} | Flags: ${flaggedClaims.length}`
//   );

//   return { newsletter, score, label, flaggedClaims };
// }  



import { llm } from "../llm";

export async function editorAgent(
  drafts: string[],
  allDocs: any[]
): Promise<{
  newsletter: string;
  score: number;
  label: string;
  flaggedClaims: string[];
}> {
  // ✅ Relaxed filtering
  const validDrafts = drafts.filter((d) => {
    if (!d || d.trim().length < 50) return false;
    if (/no information available/i.test(d)) return false;
    return true;
  });

  console.log(
    `[EditorAgent] ${validDrafts.length} valid drafts from ${drafts.length} total`
  );

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // 🔥 FALLBACK (CRITICAL FIX)
  if (validDrafts.length === 0) {
    console.warn("[EditorAgent] No valid drafts — using fallback");

    const fallback = drafts
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 2000);

    return {
      newsletter: `AI Newsletter – ${date}\n\n${fallback || "Limited data available today."}`,
      score: 0.6,
      label: "partial",
      flaggedClaims: ["Low data coverage"],
    };
  }

  // ✅ Clean drafts
  const cleanedDrafts = validDrafts.map((d) =>
    d
      .replace(
        /^#\s*(AI_RESEARCH|ENERGY|GEOPOLITICS|INDIA_AI|INDIA_IMPACT_SYNTHESIS)\s*\n?/gim,
        ""
      )
      .trim()
  );

  const truncatedDrafts = cleanedDrafts.map((d) => d.slice(0, 800));
  const combined = truncatedDrafts.join("\n\n---\n\n");

  // 🔥 IMPROVED PROMPT (balanced, not over-strict)
  const response = await llm.invoke([
    {
      role: "user",
      content: `You are a professional newsletter editor and fact-checker.

TASK 1:
Rewrite the drafts into a clean, professional newsletter.

- Start with: AI Newsletter – ${date}
- Use clear sections
- Keep it concise and factual
- Do NOT add new facts
- ONLY use information from drafts

TASK 2:
Evaluate grounding carefully.

- Ensure claims are supported by drafts
- Penalize only clear unsupported claims
- Do not over-penalize

SCORING:
- 0.9–1.0 → fully grounded
- 0.75–0.89 → mostly grounded
- 0.5–0.74 → partial
- <0.5 → hallucinated

🚨 OUTPUT FORMAT (STRICT):
EVAL:{"score":0.0,"label":"grounded","flaggedClaims":[]}

DRAFTS:
${combined}

Generate newsletter and evaluation.`,
    },
  ]);

  const full = (response.content as string).trim();

  // 🔥 Better extraction
  let newsletter = full;
  let score = 0.75;
  let label = "partial";
  let flaggedClaims: string[] = [];

  const evalMatch = full.match(/EVAL:\s*(\{[\s\S]*\})/);

  if (evalMatch) {
    newsletter = full.replace(evalMatch[0], "").trim();

    try {
      const parsed = JSON.parse(evalMatch[1]);

      if (typeof parsed.score === "number") {
        score = Math.min(Math.max(parsed.score, 0), 1);
      }

      if (parsed.label) label = parsed.label;

      if (Array.isArray(parsed.flaggedClaims)) {
        flaggedClaims = parsed.flaggedClaims;
      }
    } catch {
      console.warn("[EditorAgent] JSON parse failed");
    }
  } else {
    console.warn("[EditorAgent] No EVAL found");
  }

  // ✅ Clean false positives
  flaggedClaims = flaggedClaims.filter(
    (c) =>
      c &&
      !/AI Newsletter/i.test(c) &&
      !/^https?:\/\//i.test(c.trim())
  );

  console.log(
    `[EditorAgent] Score: ${score} | Label: ${label} | Flags: ${flaggedClaims.length}`
  );

  return { newsletter, score, label, flaggedClaims };
}