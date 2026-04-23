// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

// export async function loadAndSplit(url: string) {
//   const loader = new CheerioWebBaseLoader(url);
//   const docs = await loader.load();

//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap: 50,
//   });

//   return await splitter.splitDocuments(docs);
// }   


// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { Document } from "@langchain/core/documents";
// import Parser from "rss-parser";

// const rssParser = new Parser({
//   customFields: {
//     item: ["description", "content:encoded"],
//   },
// });

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 500,
//   chunkOverlap: 50,
// });

// function cleanText(raw: string): string {
//   return raw
//     .replace(/<[^>]*>/g, " ")  // strip HTML tags
//     .replace(/&[a-z]+;/gi, " ") // decode HTML entities like &amp; &nbsp;
//     .replace(/\s+/g, " ")
//     .trim();
// }

// // Load and parse an RSS/Atom feed
// export async function loadFromRSS(url: string): Promise<Document[]> {
//   const feed = await rssParser.parseURL(url);
//   const docs: Document[] = [];

//   for (const item of feed.items) {
//     const raw =
//       (item as any)["content:encoded"] ||
//       item.content ||
//       item.contentSnippet ||
//       item.summary ||
//       item.title ||
//       "";

//     const text = cleanText(raw);
//     if (!text || text.length < 50) continue; // skip empty/tiny items

//     docs.push(
//       new Document({
//         pageContent: text,
//         metadata: {
//           source: url,
//           title: item.title || "",
//           link: item.link || "",
//           pubDate: item.pubDate || "",
//         },
//       })
//     );
//   }

//   console.log(`[RSS] ${url} → ${docs.length} items parsed`);
//   return docs;
// }

// // Load a plain HTML page
// export async function loadFromHTML(url: string): Promise<Document[]> {
//   const loader = new CheerioWebBaseLoader(url, {
//     selector: "p, h1, h2, h3, article, .post-content, .entry-content",
//   });
//   const docs = await loader.load();

//   return docs.map((doc) => ({
//     ...doc,
//     pageContent: cleanText(doc.pageContent),
//   }));
// }

// // Split documents into chunks
// export async function splitDocs(docs: Document[]): Promise<Document[]> {
//   const filtered = docs.filter((d) => d.pageContent.length > 50);
//   return await splitter.splitDocuments(filtered);
// }  



// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { Document } from "@langchain/core/documents";
// import RSSParser from "rss-parser";

// const rssParser = new RSSParser({
//   customFields: {
//     item: ["description", "content:encoded", "content"],
//   },
// });

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 800,   // larger chunks = more context per piece
//   chunkOverlap: 100,
// });

// function cleanText(raw: string): string {
//   return raw
//     .replace(/<!\[CDATA\[|\]\]>/g, "")      // strip CDATA wrappers
//     .replace(/<[^>]*>/g, " ")               // strip HTML tags
//     .replace(/&[a-z#0-9]+;/gi, " ")         // decode HTML entities
//     .replace(/https?:\/\/\S+/g, "")         // remove bare URLs
//     .replace(/\s+/g, " ")
//     .trim();
// }

// // Quality check — reject chunks that are just metadata noise
// function isQualityContent(text: string): boolean {
//   if (text.length < 150) return false;                   // too short
//   if (/^\d+\s+(days?|hours?|minutes?)\s+ago/i.test(text)) return false; // HN-style metadata
//   if ((text.match(/•/g) || []).length > 3) return false; // bullet-only metadata
//   if (text.split(" ").length < 30) return false;         // fewer than 30 words
//   return true;
// }

// export async function loadFromRSS(url: string): Promise<Document[]> {
//   const feed = await rssParser.parseURL(url);
//   const docs: Document[] = [];

//   for (const item of feed.items) {
//     // Priority: full content > description > snippet > title
//     const raw =
//       (item as any)["content:encoded"] ||
//       (item as any)["content"] ||
//       item.summary ||
//       item.contentSnippet ||
//       item.title ||
//       "";

//     const text = cleanText(raw);

//     if (!isQualityContent(text)) {
//       console.log(`[RSS] Skipped low-quality item: "${item.title?.slice(0, 60)}"`);
//       continue;
//     }

//     docs.push(
//       new Document({
//         pageContent: text,
//         metadata: {
//           source: url,
//           title: item.title || "",
//           link: item.link || "",
//           pubDate: item.pubDate || "",
//         },
//       })
//     );
//   }

//   console.log(`[RSS] ${url} → ${docs.length} quality items parsed`);
//   return docs;
// }

// export async function loadFromHTML(url: string): Promise<Document[]> {
//   const loader = new CheerioWebBaseLoader(url, {
//     selector: "p, h1, h2, h3, article, .post-content, .entry-content",
//   });
//   const docs = await loader.load();

//   return docs
//     .map((doc) => ({
//       ...doc,
//       pageContent: cleanText(doc.pageContent),
//     }))
//     .filter((doc) => isQualityContent(doc.pageContent));
// }

// export async function splitDocs(docs: Document[]): Promise<Document[]> {
//   const filtered = docs.filter((d) => isQualityContent(d.pageContent));
//   const chunks = await splitter.splitDocuments(filtered);

//   // Final pass — drop any chunks that degraded below quality threshold after splitting
//   const qualityChunks = chunks.filter((c) => isQualityContent(c.pageContent));
//   console.log(`[Splitter] ${chunks.length} chunks → ${qualityChunks.length} after quality filter`);
//   return qualityChunks;
// }

// // ── Full ingestion pipeline ────────────────────────────────────────────
// // Loads all sources, splits into chunks, and stores in the vector DB.
// // Returns a summary object with per-source counts and total chunks.

// import { createVectorStore } from "./vectorstore";
// import { rssSources, htmlSources } from "@/app/data/sources";

// export interface IngestionResult {
//   totalChunks: number;
//   perSource: Record<string, number | string>;
// }

// export async function runIngestion(): Promise<IngestionResult> {
//   const allDocs: Document[] = [];
//   const perSource: Record<string, number | string> = {};

//   // Parse RSS feeds
//   for (const url of rssSources) {
//     try {
//       const docs = await loadFromRSS(url);
//       const chunks = await splitDocs(docs);
//       allDocs.push(...chunks);
//       perSource[url] = chunks.length;
//     } catch (err: any) {
//       console.error(`[Ingest] RSS error ${url}:`, err.message);
//       perSource[url] = `ERROR: ${err.message}`;
//     }
//   }

//   // Scrape HTML pages
//   for (const url of htmlSources) {
//     try {
//       const docs = await loadFromHTML(url);
//       const chunks = await splitDocs(docs);
//       allDocs.push(...chunks);
//       perSource[url] = chunks.length;
//     } catch (err: any) {
//       console.error(`[Ingest] HTML error ${url}:`, err.message);
//       perSource[url] = `ERROR: ${err.message}`;
//     }
//   }

//   if (allDocs.length === 0) {
//     throw new Error("No documents loaded from any source");
//   }

//   await createVectorStore(allDocs);

//   console.log(`[Ingest] Pipeline complete — ${allDocs.length} total chunks stored`);
//   return { totalChunks: allDocs.length, perSource };
// }   




// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { Document } from "@langchain/core/documents";
// import RSSParser from "rss-parser";
// import { SOURCE_MAP, htmlSources } from "@/app/data/sources";
// import { createVectorStore } from "./vectorstore";

// const rssParser = new RSSParser({
//   customFields: { item: ["description", "content:encoded", "content"] },
// });

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 800,
//   chunkOverlap: 100,
// });

// function cleanText(raw: string): string {
//   return raw
//     .replace(/<!\[CDATA\[|\]\]>/g, "")
//     .replace(/<[^>]*>/g, " ")
//     .replace(/&[a-z#0-9]+;/gi, " ")
//     .replace(/https?:\/\/\S+/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function isQualityContent(text: string): boolean {
//   if (text.length < 150) return false;
//   if (/^\d+\s+(days?|hours?|minutes?)\s+ago/i.test(text)) return false;
//   if ((text.match(/•/g) || []).length > 3) return false;
//   if (text.split(" ").length < 30) return false;
//   return true;
// }

// export async function loadFromRSS(url: string): Promise<Document[]> {
//   const feed = await rssParser.parseURL(url);
//   const docs: Document[] = [];

//   for (const item of feed.items) {
//     const raw =
//       (item as any)["content:encoded"] ||
//       (item as any)["content"] ||
//       item.summary ||
//       item.contentSnippet ||
//       item.title || "";

//     const text = cleanText(raw);
//     if (!isQualityContent(text)) continue;

//     docs.push(new Document({
//       pageContent: text,
//       metadata: {
//         source: url,
//         title: item.title || "",
//         link: item.link || "",
//         pubDate: item.pubDate || "",
//       },
//     }));
//   }

//   console.log(`[RSS] ${url} → ${docs.length} items`);
//   return docs;
// }

// export async function loadFromHTML(url: string): Promise<Document[]> {
//   const loader = new CheerioWebBaseLoader(url, {
//     selector: "p, h1, h2, h3, article, .post-content, .entry-content",
//   });
//   const docs = await loader.load();
//   return docs
//     .map((doc) => ({ ...doc, pageContent: cleanText(doc.pageContent) }))
//     .filter((doc) => isQualityContent(doc.pageContent));
// }

// export async function splitDocs(docs: Document[]): Promise<Document[]> {
//   const filtered = docs.filter((d) => isQualityContent(d.pageContent));
//   const chunks = await splitter.splitDocuments(filtered);
//   const quality = chunks.filter((c) => isQualityContent(c.pageContent));
//   console.log(`[Splitter] ${chunks.length} chunks → ${quality.length} quality`);
//   return quality;
// }

// // ✅ Main callable function used by cron + API route
// export async function runIngestion(): Promise<{
//   totalChunks: number;
//   perSource: Record<string, number | string>;
// }> {
//   const allDocs: Document[] = [];
//   const perSource: Record<string, number | string> = {};

//   for (const url of SOURCE_MAP) {
//     try {
//       const docs = await loadFromRSS(url);
//       const chunks = await splitDocs(docs);
//       allDocs.push(...chunks);
//       perSource[url] = chunks.length;
//     } catch (err: any) {
//       console.error(`[Ingest] RSS error ${url}:`, err.message);
//       perSource[url] = `ERROR: ${err.message}`;
//     }
//   }

//   for (const url of htmlSources) {
//     try {
//       const docs = await loadFromHTML(url);
//       const chunks = await splitDocs(docs);
//       allDocs.push(...chunks);
//       perSource[url] = chunks.length;
//     } catch (err: any) {
//       console.error(`[Ingest] HTML error ${url}:`, err.message);
//       perSource[url] = `ERROR: ${err.message}`;
//     }
//   }

//   if (allDocs.length === 0) {
//     throw new Error("No documents loaded from any source");
//   }

//   await createVectorStore(allDocs);
//   return { totalChunks: allDocs.length, perSource };
// }   



// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import { Document } from "@langchain/core/documents";
// import RSSParser from "rss-parser";
// import { SOURCE_MAP, htmlSources } from "@/app/data/sources";
// import { createVectorStore } from "./vectorstore";

// const rssParser = new RSSParser({
//   customFields: { item: ["description", "content:encoded", "content"] },
// });

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 800,
//   chunkOverlap: 100,
// });

// // 🔥 CLEAN TEXT
// function cleanText(raw: string): string {
//   return raw
//     .replace(/<!\[CDATA\[|\]\]>/g, "")
//     .replace(/<[^>]*>/g, " ")
//     .replace(/&[a-z#0-9]+;/gi, " ")
//     .replace(/https?:\/\/\S+/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// // 🔥 QUALITY FILTER
// function isQualityContent(text: string): boolean {
//   if (text.length < 150) return false;
//   if (/^\d+\s+(days?|hours?|minutes?)\s+ago/i.test(text)) return false;
//   if ((text.match(/•/g) || []).length > 3) return false;
//   if (text.split(" ").length < 30) return false;
//   return true;
// }

// // 🔥 ONLY LAST 24 HOURS
// function isRecent(pubDate?: string): boolean {
//   if (!pubDate) return true;
//   const date = new Date(pubDate);
//   const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
//   return date >= cutoff;
// }

// // 🔥 LOAD RSS WITH DATE FILTER
// export async function loadFromRSS(url: string, topic: string): Promise<Document[]> {
//   const feed = await rssParser.parseURL(url);
//   const docs: Document[] = [];

//   for (const item of feed.items) {
//     if (!isRecent(item.pubDate)) continue;

//     const raw =
//       (item as any)["content:encoded"] ||
//       (item as any)["content"] ||
//       item.summary ||
//       item.contentSnippet ||
//       item.title ||
//       "";

//     const text = cleanText(raw);
//     if (!isQualityContent(text)) continue;

//     docs.push(
//       new Document({
//         pageContent: text,
//         metadata: {
//           source: url,
//           title: item.title || "",
//           link: item.link || "",
//           pubDate: item.pubDate || "",
//           topic, // 🔥 CRITICAL
//         },
//       })
//     );
//   }

//   console.log(`[RSS] ${topic} | ${url} → ${docs.length} items`);
//   return docs;
// }

// // 🔥 HTML LOADER
// export async function loadFromHTML(url: string): Promise<Document[]> {
//   const loader = new CheerioWebBaseLoader(url, {
//     selector: "p, h1, h2, h3, article, .post-content, .entry-content",
//   });

//   const docs = await loader.load();

//   return docs
//     .map((doc) => ({
//       ...doc,
//       pageContent: cleanText(doc.pageContent),
//     }))
//     .filter((doc) => isQualityContent(doc.pageContent));
// }

// // 🔥 SPLITTER
// export async function splitDocs(docs: Document[]): Promise<Document[]> {
//   const filtered = docs.filter((d) => isQualityContent(d.pageContent));
//   const chunks = await splitter.splitDocuments(filtered);
//   const quality = chunks.filter((c) => isQualityContent(c.pageContent));

//   console.log(`[Splitter] ${chunks.length} → ${quality.length}`);
//   return quality;
// }

// // 🚀 MAIN INGEST FUNCTION
// export async function runIngestion(): Promise<{
//   totalChunks: number;
//   perSource: Record<string, number | string>;
// }> {
//   const allDocs: Document[] = [];
//   const perSource: Record<string, number | string> = {};

//   // 🔥 FIXED: iterate properly
//   for (const [topic, urls] of Object.entries(SOURCE_MAP)) {
//     for (const url of urls) {
//       try {
//         const docs = await loadFromRSS(url, topic);
//         const chunks = await splitDocs(docs);

//         allDocs.push(...chunks);
//         perSource[`${topic}:${url}`] = chunks.length;

//       } catch (err: any) {
//         console.error(`[Ingest] ${url}:`, err.message);
//         perSource[`${topic}:${url}`] = `ERROR: ${err.message}`;
//       }
//     }
//   }

//   // HTML sources (optional)
//   for (const url of htmlSources) {
//     try {
//       const docs = await loadFromHTML(url);
//       const chunks = await splitDocs(docs);

//       allDocs.push(...chunks);
//       perSource[url] = chunks.length;

//     } catch (err: any) {
//       console.error(`[Ingest] HTML ${url}:`, err.message);
//       perSource[url] = `ERROR: ${err.message}`;
//     }
//   }

//   if (allDocs.length === 0) {
//     throw new Error("No documents loaded from any source");
//   }

//   console.log(`[Ingest] Total chunks: ${allDocs.length}`);

//   await createVectorStore(allDocs);

//   return {
//     totalChunks: allDocs.length,
//     perSource,
//   };
// } 


import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { Document } from "@langchain/core/documents";
import RSSParser from "rss-parser";
import { SOURCE_MAP, htmlSources } from "@/app/data/sources";
import { createVectorStore } from "./vectorstore";

const rssParser = new RSSParser({
  customFields: { item: ["description", "content:encoded", "content"] },
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 100,
});

// 🔥 SOURCE NORMALIZATION
function getSourceName(url: string): string {
  if (url.includes("arxiv")) return "arxiv";
  if (url.includes("huggingface")) return "huggingface";
  if (url.includes("technologyreview")) return "mittechreview";
  if (url.includes("techcrunch")) return "techcrunch";
  if (url.includes("verge")) return "theverge";
  if (url.includes("nytimes")) return "nytimes";
  if (url.includes("skynews")) return "skynews";
  if (url.includes("oilprice")) return "oilprice";
  if (url.includes("energy.gov")) return "energygov";
  if (url.includes("economictimes")) return "economictimes";
  if (url.includes("livemint")) return "livemint";

  return "unknown";
}

// 🔥 CLEAN TEXT
function cleanText(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 🔥 QUALITY FILTER
function isQualityContent(text: string): boolean {
  if (text.length < 150) return false;
  if (/^\d+\s+(days?|hours?|minutes?)\s+ago/i.test(text)) return false;
  if ((text.match(/•/g) || []).length > 3) return false;
  if (text.split(" ").length < 30) return false;
  return true;
}

// 🔥 LAST 24 HOURS FILTER
function isRecent(pubDate?: string): boolean {
  if (!pubDate) return true;
  const date = new Date(pubDate);
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return date >= cutoff;
}

// 🔥 LOAD RSS WITH FULL METADATA
export async function loadFromRSS(
  url: string,
  topic: string
): Promise<Document[]> {
  const feed = await rssParser.parseURL(url);
  const docs: Document[] = [];

  const sourceName = getSourceName(url);

  for (const item of feed.items) {
    if (!isRecent(item.pubDate)) continue;

    const raw =
      (item as any)["content:encoded"] ||
      (item as any)["content"] ||
      item.summary ||
      item.contentSnippet ||
      item.title ||
      "";

    const text = cleanText(raw);
    if (!isQualityContent(text)) continue;

    docs.push(
      new Document({
        pageContent: text,
        metadata: {
          topic,                       // 🔥 CRITICAL
          source: url,                 // full URL
          sourceName,                  // 🔥 NEW
          title: item.title || "",
          link: item.link || "",
          pubDate: item.pubDate || "",
          timestamp: item.pubDate
            ? new Date(item.pubDate).getTime()
            : Date.now(),             // 🔥 NEW
        },
      })
    );
  }

  console.log(`[RSS] ${topic} | ${sourceName} → ${docs.length}`);
  return docs;
}

// 🔥 HTML LOADER (OPTIONAL)
export async function loadFromHTML(url: string): Promise<Document[]> {
  const loader = new CheerioWebBaseLoader(url, {
    selector: "p, h1, h2, h3, article, .post-content, .entry-content",
  });

  const docs = await loader.load();

  return docs
    .map((doc) => ({
      ...doc,
      pageContent: cleanText(doc.pageContent),
    }))
    .filter((doc) => isQualityContent(doc.pageContent));
}

// 🔥 SPLITTER
export async function splitDocs(docs: Document[]): Promise<Document[]> {
  const filtered = docs.filter((d) => isQualityContent(d.pageContent));
  const chunks = await splitter.splitDocuments(filtered);

  const quality = chunks.filter((c) =>
    isQualityContent(c.pageContent)
  );

  console.log(`[Splitter] ${chunks.length} → ${quality.length}`);
  return quality;
}

// 🚀 MAIN INGEST FUNCTION
export async function runIngestion(): Promise<{
  totalChunks: number;
  perSource: Record<string, number | string>;
}> {
  const allDocs: Document[] = [];
  const perSource: Record<string, number | string> = {};

  for (const [topic, urls] of Object.entries(SOURCE_MAP)) {
    for (const url of urls) {
      try {
        let docs = await loadFromRSS(url, topic);

        // 🔥 LIMIT PER SOURCE (prevents domination)
        const MAX_PER_SOURCE = 50;
        if (docs.length > MAX_PER_SOURCE) {
          docs = docs.slice(0, MAX_PER_SOURCE);
        }

        const chunks = await splitDocs(docs);

        allDocs.push(...chunks);
        perSource[`${topic}:${url}`] = chunks.length;

      } catch (err: any) {
        console.error(`[Ingest] ${topic} ${url}:`, err.message);
        perSource[`${topic}:${url}`] = `ERROR: ${err.message}`;
      }
    }
  }

  // 🔥 HTML SOURCES (OPTIONAL)
  for (const url of htmlSources) {
    try {
      const docs = await loadFromHTML(url);
      const chunks = await splitDocs(docs);

      allDocs.push(...chunks);
      perSource[url] = chunks.length;

    } catch (err: any) {
      console.error(`[Ingest] HTML ${url}:`, err.message);
      perSource[url] = `ERROR: ${err.message}`;
    }
  }

  if (allDocs.length === 0) {
    throw new Error("No documents loaded from any source");
  }

  console.log(`[Ingest] Total chunks: ${allDocs.length}`);

  await createVectorStore(allDocs);

  return {
    totalChunks: allDocs.length,
    perSource,
  };
}