// import { loadAndSplit } from "@/app/lib/langchain/ingest";
// import { createVectorStore } from "@/app/lib/langchain/vectorstore";
// import { sources } from "@/app/data/sources";

// export const runtime = "nodejs";
    
// export async function GET() {
//   let allDocs: any[] = [];

//   for (const url of sources) {
//     try {
//       const docs = await loadAndSplit(url);
//       allDocs.push(...docs);
//     } catch (error) {
//       console.error(`Error loading ${url}:`, error);
//     }
//   }

//   if (allDocs.length > 0) {
//     await createVectorStore(allDocs);
//   } else {
//     return Response.json({ error: "No documents were loaded" }, { status: 400 });
//   }

//   return Response.json({ message: `Data ingested successfully. Total chunks: ${allDocs.length}` });
// } 



// import { loadAndSplit } from "@/app/lib/langchain/ingest";
// import { createVectorStore } from "@/app/lib/langchain/vectorstore";
// import { sources } from "@/app/data/sources";

// export const runtime = "nodejs";

// export async function GET() {
//   const allDocs: any[] = [];
//   const results: Record<string, number | string> = {};

//   for (const url of sources) {
//     try {
//       const docs = await loadAndSplit(url);
//       allDocs.push(...docs);
//       results[url] = docs.length;
//       console.log(`[Ingest] ${url} → ${docs.length} chunks`);
//     } catch (error: any) {
//       console.error(`[Ingest] Error loading ${url}:`, error.message);
//       results[url] = `ERROR: ${error.message}`;
//     }
//   }

//   if (allDocs.length === 0) {
//     return Response.json({ error: "No documents were loaded from any source" }, { status: 400 });
//   }

//   await createVectorStore(allDocs);

//   return Response.json({
//     message: `Ingested successfully`,
//     totalChunks: allDocs.length,
//     perSource: results,
//   });
// }  

import { runIngestion } from "@/app/lib/langchain/ingest";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await runIngestion();

    return Response.json({
      message: "Ingested successfully",
      ...result,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 400 }
    );
  }
}