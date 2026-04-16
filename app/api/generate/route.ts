// import { getVectorStore } from "@/app/lib/langchain/vectorstore";
// import { getRetriever } from "@/app/lib/langchain/retriever";
// import { llm } from "@/app/lib/langchain/llm";
// import { checkHallucination } from "@/app/lib/langchain/evaluator";
// import { traceable } from "langsmith/traceable";

// export const runtime = "nodejs";

// export async function GET() {
//   try {
//     const vectorStore = await getVectorStore();
//     const retriever = getRetriever(vectorStore);

//     const result = await runRAG(
//       retriever,
//       "Latest artificial intelligence news, LLM breakthroughs, AI model updates, and technology industry news"
//     );

//     return Response.json(result);
//   } catch (err: any) {
//     console.error("[generate] Error:", err.message);
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// const generateNewsletter = traceable(
//   async (context: string, sources: string[]): Promise<{ content: string }> => {
//     const sourceList = sources.join("\n");

//     const response = await llm.invoke([
//       {
//         role: "system",
//         content: `You are a strict AI newsletter writer. Your ONLY job is to report what is EXPLICITLY written in the SOURCE CONTEXT.

// ABSOLUTE RULES — any violation causes your output to be rejected:
// - COPY numbers, percentages, and statistics EXACTLY as they appear in the context — never round or rephrase them
// - COPY company names, product names, and model names EXACTLY as written
// - Do NOT use phrases like "approximately", "around", "over", "nearly" unless the context uses those exact words
// - Do NOT combine two separate facts into one sentence — keep them separate
// - Do NOT use transition phrases that imply causation (e.g. "this means", "as a result") unless the context says so
// - Do NOT use markdown: no **, no ##, no ---
// - Keep paragraphs to 2–3 lines max
// - Use natural topic-based headings that come directly from what is in the context

// STRUCTURE:
// 1. First line must be:
//    AI Newsletter – ${new Date().toLocaleDateString("en-US", {
//      month: "long",
//      day: "numeric",
//      year: "numeric",
//    })}

// 2. Write 2–4 sections. Each heading must reflect a topic that is explicitly covered in the context.

// 3. For each claim you write, ask yourself: "Can I point to the exact sentence in the context that says this?" If not — remove it.

// 4. If a company or product appears — only say what the context explicitly says about it. Nothing more.

// 5. Final line:
//    Sources: ${sourceList}

// If the context does not contain enough information, respond ONLY with:
// "Insufficient source data. Please re-run /api/ingest to refresh."`,
//       },
//       {
//         role: "user",
//         content: `SOURCE CONTEXT — use ONLY this, copy facts exactly as written:\n\n${context}\n\nWrite the newsletter now.`,
//       },
//     ]);

//     return { content: response.content as string };
//   },
//   {
//     name: "generate_newsletter",
//     run_type: "llm",
//   }
// );

// const retrieveDocs = traceable(
//   async (retriever: any, query: string) => {
//     return await retriever.invoke(query);
//   },
//   {
//     name: "retrieve_docs",
//     run_type: "retriever",
//   }
// );

// export async function runRAG(
//   retriever: any,
//   searchQuery: string
// ): Promise<{
//   newsletter: string;
//   hallucination: {
//     score: number;
//     label: string;
//     reasoning: string;
//     flaggedClaims: string[];
//   };
// }> {
//   // Step 1 — Retrieve
//   let docs: any[] = [];
//   try {
//     docs = await retrieveDocs(retriever, searchQuery);
//   } catch (err) {
//     console.error("[RAG] Retriever error:", err);
//     return {
//       newsletter: "Retrieval failed. Check your MongoDB Atlas vector index.",
//       hallucination: { score: 0, label: "error", reasoning: "Retrieval failed", flaggedClaims: [] },
//     };
//   }

//   if (!docs || docs.length === 0) {
//     return {
//       newsletter: "No results from vector search. Please run /api/ingest first.",
//       hallucination: { score: 0, label: "error", reasoning: "No docs retrieved", flaggedClaims: [] },
//     };
//   }

//   // Deduplicate chunks by content to remove near-identical RSS snippets
//   const seen = new Set<string>();
//   const uniqueDocs = docs.filter((d: any) => {
//     const key = d.pageContent.slice(0, 80);
//     if (seen.has(key)) return false;
//     seen.add(key);
//     return true;
//   });

//   const context = uniqueDocs.map((d: any) => d.pageContent).join("\n\n---\n\n");
//   const sources = [
//     ...new Set(
//       uniqueDocs
//         .map((d: any) => d.metadata?.link || d.metadata?.source || "")
//         .filter(Boolean)
//     ),
//   ];

//   console.log(`[RAG] Context length: ${context.length} chars from ${uniqueDocs.length} unique chunks`);
//   console.log(`[RAG] Sources: ${sources.length} unique links`);

//   // Step 2 — Generate
//   const { content: newsletter } = await generateNewsletter(context, sources);

//   // Step 3 — Hallucination check
//   console.log("[Evaluator] Running hallucination check...");
//   const hallucination = await checkHallucination(context, newsletter);

//   console.log(`[Evaluator] Score: ${hallucination.score} | Label: ${hallucination.label}`);
//   console.log(`[Evaluator] Reasoning: ${hallucination.reasoning}`);

//   if (hallucination.flaggedClaims.length > 0) {
//     console.warn("[Evaluator] Flagged claims:", hallucination.flaggedClaims);
//   }

//   // Block if score below 0.75
//   if (hallucination.score < 0.75) {
//     console.error("[Evaluator] Output rejected — score below threshold.");
//     return {
//       newsletter:
//         "Newsletter blocked: model produced ungrounded claims. Re-run /api/ingest to refresh data.",
//       hallucination,
//     };
//   }

//   return { newsletter, hallucination };
// }  



import { runMultiAgentNewsletter } from "@/app/lib/langchain/agents/orchestrator";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await runMultiAgentNewsletter();
    return Response.json(result);
  } catch (err: any) {
    console.error("[generate] Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}