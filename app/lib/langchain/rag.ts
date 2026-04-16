import { llm } from "./llm";
import { checkHallucination } from "./evaluator";
import { traceable } from "langsmith/traceable";

const generateNewsletter = traceable(
  async (context: string, sources: string[]): Promise<{ content: string }> => {
    const sourceList = sources.join("\n");

    const response = await llm.invoke([
      {
        role: "system",
        content: `You are a strict AI newsletter writer. Your ONLY job is to report what is EXPLICITLY written in the SOURCE CONTEXT.

ABSOLUTE RULES — violating these causes your output to be rejected:
- COPY numbers, percentages, and statistics EXACTLY as they appear — never rephrase them
- COPY company names, product names, and model names EXACTLY as written
- Do NOT use markdown: no **, no ##, no ---
- Keep paragraphs to 2–3 lines max
- Use natural topic-based headings that come directly from the context

THE "2 SENTENCE RULE" — this is the most important rule:
Before writing about ANY company, product, or topic ask yourself:
"Do I have at least 2 distinct, specific facts about this from the context?"
- Yes → include it with those facts only
- No → skip it completely, do not mention it at all, not even once

Examples of what to skip:
- If context only says "OpenClaw is an autonomous agent" → skip OpenClaw entirely
- If context only says "Claude Cowork exists" → skip Claude Cowork entirely
- If you cannot write 2 full sentences from context alone → skip the topic

STRUCTURE:
1. First line must be exactly:
   AI Newsletter – ${new Date().toLocaleDateString("en-US", {
     month: "long",
     day: "numeric",
     year: "numeric",
   })}

2. Write 2–4 sections. Each section heading must describe a topic you have SUFFICIENT context for (at least 2 facts).

3. Inside sections:
   - If multiple companies are mentioned on the same topic, format as:
     CompanyName: what the context explicitly says about them
   - Only include companies that pass the 2 sentence rule

4. For every sentence you write, ask: "Can I point to the exact sentence in the context that says this?" 
   If not → delete it

5. Final line:
   Sources: ${sourceList}

If the context does not contain enough information to write even one section, respond ONLY with:
"Insufficient source data. Please re-run /api/ingest to refresh."`,
      },
      {
        role: "user",
        content: `SOURCE CONTEXT — use ONLY this, copy facts exactly as written:\n\n${context}\n\nWrite the newsletter now. Remember: skip any topic you cannot write 2 full sentences about from the context.`,
      },
    ]);

    return { content: response.content as string };
  },
  {
    name: "generate_newsletter",
    run_type: "llm",
  }
);

const retrieveDocs = traceable(
  async (retriever: any, query: string) => {
    return await retriever.invoke(query);
  },
  {
    name: "retrieve_docs",
    run_type: "retriever",
  }
);

export async function runRAG(
  retriever: any,
  searchQuery: string
): Promise<{
  newsletter: string;
  hallucination: {
    score: number;
    label: string;
    reasoning: string;
    flaggedClaims: string[];
  };
}> {
  // Step 1 — Retrieve
  let docs: any[] = [];
  try {
    docs = await retrieveDocs(retriever, searchQuery);
  } catch (err) {
    console.error("[RAG] Retriever error:", err);
    return {
      newsletter: "Retrieval failed. Check your MongoDB Atlas vector index.",
      hallucination: {
        score: 0,
        label: "error",
        reasoning: "Retrieval failed",
        flaggedClaims: [],
      },
    };
  }

  if (!docs || docs.length === 0) {
    return {
      newsletter: "No results from vector search. Please run /api/ingest first.",
      hallucination: {
        score: 0,
        label: "error",
        reasoning: "No docs retrieved",
        flaggedClaims: [],
      },
    };
  }

  // Step 2 — Deduplicate chunks by content
  const seen = new Set<string>();
  const uniqueDocs = docs.filter((d: any) => {
    const key = d.pageContent.slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const context = uniqueDocs.map((d: any) => d.pageContent).join("\n\n---\n\n");
  const sources = [
    ...new Set(
      uniqueDocs
        .map((d: any) => d.metadata?.link || d.metadata?.source || "")
        .filter(Boolean)
    ),
  ];

  console.log(
    `[RAG] Context length: ${context.length} chars from ${uniqueDocs.length} unique chunks`
  );
  console.log(`[RAG] Sources: ${sources.length} unique links`);

  // Step 3 — Generate newsletter
  const { content: newsletter } = await generateNewsletter(context, sources);

  // Step 4 — Hallucination check
  console.log("[Evaluator] Running hallucination check...");
  const hallucination = await checkHallucination(context, newsletter);

  console.log(
    `[Evaluator] Score: ${hallucination.score} | Label: ${hallucination.label}`
  );
  console.log(`[Evaluator] Reasoning: ${hallucination.reasoning}`);

  if (hallucination.flaggedClaims.length > 0) {
    console.warn("[Evaluator] Flagged claims:", hallucination.flaggedClaims);
  }

  // Step 5 — Block if score below 0.75
  if (hallucination.score < 0.75) {
    console.error("[Evaluator] Output rejected — score below threshold.");
    return {
      newsletter:
        "Newsletter blocked: model produced ungrounded claims. Re-run /api/ingest to refresh data.",
      hallucination,
    };
  }

  return { newsletter, hallucination };
}