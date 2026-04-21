// // import { getVectorStore } from "../vectorstore";
// // import { getRetriever } from "../retriever";
// // import { NewsletterState } from "./types";

// // const TOPIC_QUERIES: Record<string, string> = {
// //   ai: "Latest AI research LLM breakthroughs model updates",
// //   energy: "AI energy consumption data centers power grid",
// //   geopolitics: "AI geopolitics chip export controls semiconductor policy",
// //   india: "India AI policy MeitY GPU compute INDIAai mission",
// // };

// // export async function researchAgent(
// //   state: NewsletterState
// // ): Promise<Partial<NewsletterState>> {
// //   console.log(`[ResearchAgent:${state.topic}] Starting retrieval...`);

// //   const vectorStore = await getVectorStore();
// //   const retriever = getRetriever(vectorStore);
// //   const query = TOPIC_QUERIES[state.topic] || state.topic;
// //   const docs = await retriever.invoke(query);

// //   console.log(`[ResearchAgent:${state.topic}] Retrieved ${docs.length} docs`);
// //   return { docs };
// // }  



// import { getVectorStore } from "../vectorstore";
// import { getRetriever } from "../retriever";
// import { NewsletterState } from "./types";

// const TOPIC_QUERIES: Record<string, string> = {
//   ai_research: "Latest AI research papers LLM architecture capabilities benchmarks",
//   energy: "AI energy consumption data centers power grid electricity usage",
//   geopolitics: "AI geopolitics semiconductor export controls national AI policy",
//   india_ai: "India AI policy MeitY INDIAai mission GPU compute regulation",
//   india_impact_synthesis:
//     "Impact of global AI research energy geopolitics on India technology economy policy"
// };

// export async function researchAgent(
//   state: NewsletterState
// ): Promise<Partial<NewsletterState>> {
//   console.log(`[ResearchAgent:${state.topic}] Starting retrieval...`);

//   const vectorStore = await getVectorStore();
//   const retriever = getRetriever(vectorStore);

//   const query = TOPIC_QUERIES[state.topic];
//   if (!query) throw new Error(`No query defined for topic ${state.topic}`);

//   const docs = await retriever.invoke(query);

//   console.log(`[ResearchAgent:${state.topic}] Retrieved ${docs.length} docs`);
//   return { docs };
// }  




// import { getVectorStore } from "../vectorstore";
// import { getRetriever } from "../retriever";
// import { NewsletterState } from "./types";


// const TOPIC_QUERIES: Record<string, string> = {
//   ai_research:
//     "what is happening in AI research globally latest advancements and trends",
//   energy:
//     "global energy market electricity grid renewable transition oil gas policy impact analysis",

//   geopolitics:
//     "global geopolitics  conflicts trade sanctions US China Russia relations analysis",

//   india_ai:
//     "India AI policy INDIAai mission government initiatives compute infrastructure startups",

//   india_impact_synthesis:
//     "impact of global AI ,  energy ,  geopolitics on India economy policy industry analysis"
// };

// export async function researchAgent(
//   state: NewsletterState
// ): Promise<Partial<NewsletterState>> {
//   console.log(`[ResearchAgent:${state.topic}] Starting retrieval...`);

//   const vectorStore = await getVectorStore();
//   const retriever = getRetriever(vectorStore, state.topic);

//   const query = TOPIC_QUERIES[state.topic];
//   if (!query) {
//     throw new Error(
//       `[ResearchAgent] No retrieval query defined for topic: ${state.topic}`
//     );
//   }

//   const docs = await retriever.invoke(query);

//   console.log(
//     `[ResearchAgent:${state.topic}] Retrieved ${docs.length} documents`
//   );

//   return { docs };
// }  



import { getVectorStore } from "../vectorstore";
import { getRetriever } from "../retriever";
import { NewsletterState } from "./types";

// 🔥 MUCH STRONGER QUERIES (fact-driven, not vague)
const TOPIC_QUERIES: Record<string, string> = {
  ai_research:
    "latest AI models benchmarks architectures research breakthroughs machine learning advancements",

  energy:
    "global energy market electricity grid renewable energy oil gas supply policy developments",

  geopolitics:
    "global conflicts sanctions trade relations US China Russia geopolitical developments",

  india_ai:
    "India AI policy INDIAai mission startups infrastructure government announcements AI India",

  india_impact_synthesis:
    "impact of global AI energy geopolitics on India economy policy industry effects",
};

function isValidDoc(doc: any): boolean {
  if (!doc?.pageContent) return false;

  const text = doc.pageContent.trim();

  if (text.length < 80) return false;
  if (/^\s*$/.test(text)) return false;
  if (/cookie|subscribe|advertisement/i.test(text)) return false;

  return true;
}

export async function researchAgent(
  state: NewsletterState
): Promise<Partial<NewsletterState>> {
  console.log(`[ResearchAgent:${state.topic}] Starting retrieval...`);

  try {
    const vectorStore = await getVectorStore();
    const retriever = getRetriever(vectorStore, state.topic);

    const query = TOPIC_QUERIES[state.topic];
    if (!query) {
      throw new Error(
        `[ResearchAgent] No query defined for topic: ${state.topic}`
      );
    }

    const rawDocs = await retriever.invoke(query);

    // 🔥 FILTER BAD DOCS
    const docs = rawDocs.filter(isValidDoc);

    console.log(
      `[ResearchAgent:${state.topic}] Retrieved ${docs.length} valid documents (from ${rawDocs.length})`
    );

    // 🔥 MINIMUM THRESHOLD (CRITICAL FIX)
    if (docs.length < 3) {
      console.warn(
        `[ResearchAgent:${state.topic}] Low data — skipping topic`
      );

      return {
        docs: [],
      };
    }

    // 🔥 LIMIT (avoid noise overload)
    const limitedDocs = docs.slice(0, 12);

    return {
      docs: limitedDocs,
    };

  } catch (err: any) {
    console.error(
      `[ResearchAgent:${state.topic}] Failed:`,
      err.message
    );

    return {
      docs: [],
    };
  }
}