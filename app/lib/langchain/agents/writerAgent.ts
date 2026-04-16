// import { llm } from "../llm";
// import { NewsletterState } from "./types";

// export async function writerAgent(
//   state: NewsletterState
// ): Promise<Partial<NewsletterState>> {
//   console.log(`[WriterAgent:${state.topic}] Generating section...`);

//   const context = state.docs
//     .map((d: any) => d.pageContent)
//     .join("\n\n---\n\n");

//   const response = await llm.invoke([
//     {
//       role: "system",
//       content: `
// You are an extractive newsletter writer.

// ABSOLUTE RULES (VIOLATION = FAILURE):
// - Write ONLY what is EXPLICITLY stated in the context
// - REPHRASE permitted, INFERENCE forbidden
// - Do NOT combine facts across documents
// - Do NOT introduce timeline logic, causality, or implications
// - If uncertain, OMIT the information
// - Output must be traceable verbatim to the context

// FORMAT RULES:
// - Write exactly ONE section
// - Start with a clear heading line
// - 2–4 short paragraphs
// - No markdown, no symbols, no emphasis
// - Topic: ${state.topic.toUpperCase()}
// `,
//     },
//     {
//       role: "user",
//       content: `Context:\n${context}\n\nWrite the section now.`,
//     },
//   ]);

//   return { draft: response.content as string };
// }   


import { llm } from "../llm";
import { NewsletterState } from "./types";

// Deduplicate + compress context before sending to LLM
function compressContext(docs: any[], maxChars = 1200): string {
  const seen = new Set<string>();
  let result = "";

  for (const doc of docs) {
    // Deduplicate by first 60 chars
    const key = doc.pageContent.slice(0, 60).trim();
    if (seen.has(key)) continue;
    seen.add(key);

    // Only take first 300 chars of each chunk — enough for facts
    const snippet = doc.pageContent.slice(0, 300).trim();
    if (!snippet || snippet.length < 80) continue;

    if (result.length + snippet.length > maxChars) break;
    result += snippet + "\n\n";
  }

  return result.trim();
}

export async function writerAgent(
  state: NewsletterState
): Promise<Partial<NewsletterState>> {
  console.log(`[WriterAgent:${state.topic}] Generating section...`);

  const context = compressContext(state.docs);

  // Skip immediately if no usable content
  if (!context || context.length < 100) {
    console.log(`[WriterAgent:${state.topic}] No usable context — skipping`);
    return { draft: "" };
  }

  // Single combined user message — no separate system message saves tokens
  const response = await llm.invoke([
    {
      role: "user",
      content: `Write one newsletter section about ${state.topic.toUpperCase()}.

STRICT RULES:
- ONLY use facts from context
- DO NOT infer or assume
- DO NOT generalize beyond context
- If information is insufficient → return empty

STYLE:
- 2 short paragraphs
- Clear, factual, concise
- No markdown

Context:
${context}

Write section now:`
    },
  ]);

  const draft = response.content as string;

  // Reject drafts that are clearly low quality
  if (
    draft.length < 80 ||
    /no information/i.test(draft) ||
    /there is no/i.test(draft) ||
    /context does not/i.test(draft)
  ) {
    console.log(`[WriterAgent:${state.topic}] Low quality draft — skipping`);
    return { draft: "" };
  }

  console.log(`[WriterAgent:${state.topic}] Done — ${draft.length} chars`);
  return { draft };
}