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



export function getRetriever(vectorStore: any, topic: string) {

  // 🔥 Topic-aware filter (CRITICAL FIX)
  const retriever = vectorStore.asRetriever({
    k: 8, // 🔥 balanced (not too high)
    searchType: "similarity",

    // ✅ THIS IS THE REAL FIX
    filter: {
      "metadata.topic": topic,
    },
  });

  const originalInvoke = retriever.invoke.bind(retriever);

  retriever.invoke = async (query: string) => {
    const results = await originalInvoke(query);

    console.log(
      `[Retriever:${topic}] Query → ${results.length} docs`
    );

    if (results.length > 0) {
      console.log(
        `[Retriever:${topic}] Sample → ${results[0].pageContent.slice(0, 120)}`
      );
    }

    // 🔥 FALLBACK (VERY IMPORTANT)
    if (results.length < 3) {
      console.warn(`[Retriever:${topic}] Low results — fallback to global`);

      const fallbackRetriever = vectorStore.asRetriever({
        k: 6,
        searchType: "similarity",
      });

      const fallbackResults = await fallbackRetriever.invoke(query);

      console.log(
        `[Retriever:${topic}] Fallback → ${fallbackResults.length} docs`
      );

      return fallbackResults;
    }

    return results;
  };

  return retriever;
}