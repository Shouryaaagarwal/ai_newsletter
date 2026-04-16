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



export function getRetriever(vectorStore: any) {
  // Increased k from 5 → 15 to give the LLM enough real context
  const retriever = vectorStore.asRetriever({
    k: 15,
    searchType: "similarity",
  });

  const originalInvoke = retriever.invoke.bind(retriever);
  retriever.invoke = async (query: string) => {
    const results = await originalInvoke(query);
    console.log(`[Retriever] Query: "${query}" → ${results.length} docs returned`);
    if (results.length > 0) {
      console.log(`[Retriever] Sample doc: ${results[0].pageContent.slice(0, 120)}`);
    }
    return results;
  };

  return retriever;
}