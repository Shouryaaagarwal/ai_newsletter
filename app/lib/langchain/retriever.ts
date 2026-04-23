// export function getRetriever(vectorStore: any) {
//   return vectorStore.asRetriever({
//     k: 5,
//   });
// }  


// export function getRetriever(vectorStore: any) {
//   const retriever = vectorStore.asRetriever({ k: 5 });

//   // Wrap to log results for debugging
//   const originalInvoke = retriever.invoke.bind(retriever);
//   retriever.invoke = async (query: string) => {
//     const results = await originalInvoke(query);
//     console.log(`[Retriever] Query: "${query}" → ${results.length} docs returned`);
//     if (results.length > 0) {
//       console.log(`[Retriever] Sample doc: ${results[0].pageContent.slice(0, 100)}`);
//     }
//     return results;
//   };

//   return retriever;
// }   



// export function getRetriever(vectorStore: any, topic:string) {
//   // Increased k from 5 → 15 to give the LLM enough real context
//   const retriever = vectorStore.asRetriever({
//     k: 15,
//     searchType: "similarity",  
//     topic,
//   });

//   const originalInvoke = retriever.invoke.bind(retriever);
//   retriever.invoke = async (query: string) => {
//     const results = await originalInvoke(query);
//     console.log(`[Retriever] Query: "${query}" → ${results.length} docs returned`);
//     if (results.length > 0) {
//       console.log(`[Retriever] Sample doc: ${results[0].pageContent.slice(0, 120)}`);
//     }
//     return results;
//   };

//   return retriever;
// }  


// export function getRetriever(vectorStore: any, topic: string) {

//   //  SOURCE CREDIBILITY WEIGHTS
//   const SOURCE_WEIGHTS: Record<string, number> = {
//     "reuters": 1.0,
//     "ft.com": 1.0,
//     "nytimes": 0.95,
//     "arxiv": 0.9,
//     "technologyreview": 0.9,
//     "theverge": 0.8,
//     "techcrunch": 0.75,
//     "venturebeat": 0.7,
//     "unknown": 0.6,
//   };

//   // 🔥 BASE RETRIEVER (topic-aware)
//   const retriever = vectorStore.asRetriever({
//     k: 15, // slightly reduced for quality
//     searchType: "similarity",

//     // 🔥 REAL FIX (topic filter)
//     filter: {
//       "metadata.topic": topic,
//     },
//   });

//   const originalInvoke = retriever.invoke.bind(retriever);

//   retriever.invoke = async (query: string) => {
//     let results = await originalInvoke(query);

//     console.log(
//       `[Retriever:${topic}] Query → ${results.length} docs`
//     );

//     // 🔥 QUALITY FILTERING
//     results = results.filter((doc: any) => {
//       const text = doc.pageContent || "";

//       if (text.length < 80) return false;
//       if (/^\d+\s+(hours?|days?)\s+ago/i.test(text)) return false;
//       if (text.split(" ").length < 20) return false;

//       return true;
//     });

//     // 🔥 SOURCE WEIGHTING
//     const scored = results.map((doc: any) => {
//       const source = (doc.metadata?.source || "").toLowerCase();

//       let weight = SOURCE_WEIGHTS["unknown"];

//       for (const key in SOURCE_WEIGHTS) {
//         if (source.includes(key)) {
//           weight = SOURCE_WEIGHTS[key];
//           break;
//         }
//       }

//       return {
//         doc,
//         score: weight,
//       };
//     });

//     const sorted = scored
//       .sort((a: { doc: any; score: number }, b: { doc: any; score: number }) => b.score - a.score)
//       .map((item: { doc: any; score: number }) => item.doc);

//     let finalResults = sorted.slice(0, 8);

//     if (finalResults.length < 3) {
//       console.warn(`[Retriever:${topic}] Low results → fallback`);

//       const fallbackRetriever = vectorStore.asRetriever({
//         k: 6,
//         searchType: "similarity",
//       });

//       const fallbackResults = await fallbackRetriever.invoke(query);

//       finalResults = fallbackResults;
//     }

//     if (finalResults.length > 0) {
//       console.log(
//         `[Retriever:${topic}] Final sample → ${finalResults[0].pageContent.slice(
//           0,
//           120
//         )}`
//       );
//     }

//     return finalResults;
//   };

//   return retriever;
// }   





// export function getRetriever(vectorStore: any, topic: string) {

//   const SOURCE_WEIGHTS: Record<string, number> = {
//     "reuters": 1.0,
//     "ft.com": 1.0,
//     "nytimes": 0.95,
//     "arxiv": 0.9,
//     "technologyreview": 0.9,
//     "theverge": 0.8,
//     "techcrunch": 0.75,
//     "venturebeat": 0.7,
//     "unknown": 0.6,
//   };

//   // ✅ REMOVE broken filter from DB layer
//   const retriever = vectorStore.asRetriever({
//     k: 15,
//     searchType: "similarity",
//   });

//   const originalInvoke = retriever.invoke.bind(retriever);

//   retriever.invoke = async (query: string) => {
//     let results = await originalInvoke(query);

//     console.log(`[Retriever:${topic}] Raw → ${results.length} docs`);

//     // ✅ STEP 1: FILTER BY TOPIC (MANUAL)
//     let topicFiltered = results.filter((doc: any) => {
//       return doc.metadata?.topic === topic;
//     });

//     // 🔥 FALLBACK if topic fails
//     if (topicFiltered.length < 3) {
//       console.warn(`[Retriever:${topic}] Weak topic match → using raw results`);
//       topicFiltered = results;
//     }

//     // ✅ STEP 2: QUALITY FILTER
//     let qualityFiltered = topicFiltered.filter((doc: any) => {
//       const text = doc.pageContent || "";

//       if (text.length < 80) return false;
//       if (/^\d+\s+(hours?|days?)\s+ago/i.test(text)) return false;
//       if (text.split(" ").length < 20) return false;

//       return true;
//     });

//     // 🔥 fallback if over-filtered
//     if (qualityFiltered.length < 3) {
//       console.warn(`[Retriever:${topic}] Over-filtered → relaxing`);
//       qualityFiltered = topicFiltered;
//     }

//     // ✅ STEP 3: SOURCE WEIGHTING
//     const scored = qualityFiltered.map((doc: any) => {
//       const source = (doc.metadata?.source || "").toLowerCase();

//       let weight = SOURCE_WEIGHTS["unknown"];

//       for (const key in SOURCE_WEIGHTS) {
//         if (source.includes(key)) {
//           weight = SOURCE_WEIGHTS[key];
//           break;
//         }
//       }

//       return {
//         doc,
//         score: weight,
//       };
//     });

//     // ✅ STEP 4: SORT BY QUALITY
//     const sorted = scored
//       .sort((a: { doc: any; score: number }, b: { doc: any; score: number }) => b.score - a.score)
//       .map((item: { doc: any; score: number }) => item.doc);

//     // ✅ STEP 5: FINAL LIMIT
//     const finalResults = sorted.slice(0, 8);

//     if (finalResults.length > 0) {
//       console.log(
//         `[Retriever:${topic}] Final → ${finalResults.length} docs | Sample: ${finalResults[0].pageContent.slice(0, 120)}`
//       );
//     } else {
//       console.warn(`[Retriever:${topic}] No usable docs`);
//     }

//     return finalResults;
//   };

//   return retriever;
// }   



export function getRetriever(vectorStore: any, topic: string) {

  const SOURCE_WEIGHTS: Record<string, number> = {
    arxiv: 0.95,
    huggingface: 0.9,
    mittechreview: 0.9,
    nytimes: 0.95,
    skynews: 0.85,
    techcrunch: 0.8,
    theverge: 0.8,
    oilprice: 0.85,
    energygov: 0.9,
    economictimes: 0.85,
    livemint: 0.85,
    unknown: 0.6,
  };

  const retriever = vectorStore.asRetriever({
    k: 20,
    searchType: "similarity",
  });

  const originalInvoke = retriever.invoke.bind(retriever);

  retriever.invoke = async (query: string) => {
    let results = await originalInvoke(query);

    let topicFiltered = results.filter((doc: any) => {
      return doc.metadata?.topic === topic;
    });

    if (topicFiltered.length < 3) {
      topicFiltered = results;
    }

    let qualityFiltered = topicFiltered.filter((doc: any) => {
      const text = doc.pageContent || "";
      if (text.length < 80) return false;
      if (/^\d+\s+(hours?|days?)\s+ago/i.test(text)) return false;
      if (text.split(" ").length < 20) return false;
      return true;
    });

    if (qualityFiltered.length < 3) {
      qualityFiltered = topicFiltered;
    }

    const now = Date.now();

    const scored = qualityFiltered.map((doc: any) => {
      const sourceName = doc.metadata?.sourceName || "unknown";
      const baseWeight = SOURCE_WEIGHTS[sourceName] || SOURCE_WEIGHTS["unknown"];

      const timestamp = doc.metadata?.timestamp || now;
      const ageHours = (now - timestamp) / (1000 * 60 * 60);

      let recencyBoost = 1;
      if (ageHours < 6) recencyBoost = 1.1;
      else if (ageHours < 12) recencyBoost = 1.05;
      else if (ageHours > 24) recencyBoost = 0.9;

      const finalScore = baseWeight * recencyBoost;

      return {
        doc,
        score: finalScore,
      };
    });

    const sorted = scored
      .sort((a: { doc: any; score: number }, b: { doc: any; score: number }) => b.score - a.score)
      .map((item: { doc: any; score: number }) => item.doc);

    const finalResults = sorted.slice(0, 8);

    return finalResults;
  };

  return retriever;
}