// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { MongoClient } from "mongodb";
// import { embeddings } from "./embeddings";

// const client = new MongoClient(process.env.MONGODB_URI!);

// export async function createVectorStore(docs: any[]) {
//   await client.connect();
//   const collection = client.db("ai_newsletter").collection("news");

//   return await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, {
//     collection,
//     indexName: "vector_index",      
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }

// export async function getVectorStore() {
//   await client.connect();
//   const collection = client.db("ai_newsletter").collection("news");

//   return new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: "vector_index",
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }  

// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { MongoClient } from "mongodb";
// import { embeddings } from "./embeddings";

// let client: MongoClient | null = null;

// async function getClient(): Promise<MongoClient> {
//   if (!client) {
//     client = new MongoClient(process.env.MONGODB_URI!);
//     await client.connect();
//   }
//   return client;
// }

// const DB_NAME = "ai_newsletter";
// const COLLECTION_NAME = "news";
// const INDEX_NAME = "vector_index";

// export async function createVectorStore(docs: any[]) {
//   const mongoClient = await getClient();
//   const collection = mongoClient.db(DB_NAME).collection(COLLECTION_NAME);

//   // Drop existing docs before re-ingesting to avoid duplicates
//   await collection.deleteMany({});

//   return await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, {
//     collection,
//     indexName: INDEX_NAME,
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }

// export async function getVectorStore() {
//   const mongoClient = await getClient();
//   const collection = mongoClient.db(DB_NAME).collection(COLLECTION_NAME);

//   const count = await collection.countDocuments();
//   console.log(`[VectorStore] Found ${count} documents in collection`);

//   if (count === 0) {
//     throw new Error("Collection is empty. Please run /api/ingest first.");
//   }

//   return new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: INDEX_NAME,
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }  


// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import clientPromise from "@/app/lib/langchain/mongo";
// import { embeddings } from "./embeddings";

// const DB_NAME = "ai_newsletter";
// const COLLECTION_NAME = "news";
// const INDEX_NAME = "vector_index";

// export async function createVectorStore(docs: any[]) {
//   const mongoClient = await clientPromise;
//   const collection = mongoClient.db(DB_NAME).collection(COLLECTION_NAME);

//   // Clear old docs
//   await collection.deleteMany({});

//   return await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, {
//     collection,
//     indexName: INDEX_NAME,
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }

// export async function getVectorStore() {
//   const mongoClient = await clientPromise;
//   const collection = mongoClient.db(DB_NAME).collection(COLLECTION_NAME);

//   const count = await collection.countDocuments();
//   console.log(`[VectorStore] Found ${count} documents`);

//   if (count === 0) {
//     throw new Error("Collection is empty. Please run /api/ingest first.");
//   }

//   return new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: INDEX_NAME,
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }  

// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { MongoClient, MongoClientOptions } from "mongodb";
// import { embeddings } from "./embeddings";

// const DB_NAME = "ai_newsletter";
// const COLLECTION_NAME = "news";
// const INDEX_NAME = "vector_index";

// const options: MongoClientOptions = {
//   tls: true,
//   serverSelectionTimeoutMS: 10000,
//   connectTimeoutMS: 10000,
//   socketTimeoutMS: 45000,
//   maxPoolSize: 5,
//   retryWrites: true,
//   retryReads: true,
// };

// // Next.js global pattern — survives hot reloads in dev
// declare global {
//   var _mongoClient: MongoClient | undefined;
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// async function getClientPromise(): Promise<MongoClient> {
//   if (process.env.NODE_ENV === "development") {
//     // In dev: reuse across hot reloads via global
//     if (!global._mongoClientPromise) {
//       global._mongoClient = new MongoClient(process.env.MONGODB_URI!, options);
//       global._mongoClientPromise = global._mongoClient.connect();
//     }
//     return global._mongoClientPromise;
//   } else {
//     // In prod: create once per serverless instance
//     if (!global._mongoClientPromise) {
//       const client = new MongoClient(process.env.MONGODB_URI!, options);
//       global._mongoClientPromise = client.connect();
//     }
//     return global._mongoClientPromise;
//   }
// }

// async function getCollection() {
//   try {
//     const client = await getClientPromise();
//     // Verify connection is alive
//     await client.db("admin").command({ ping: 1 });
//     return client.db(DB_NAME).collection(COLLECTION_NAME);
//   } catch (err) {
//     // Connection is dead — reset and reconnect fresh
//     console.warn("[MongoDB] Connection failed, resetting...", err);
//     global._mongoClient = undefined;
//     global._mongoClientPromise = undefined;

//     const freshClient = new MongoClient(process.env.MONGODB_URI!, options);
//     global._mongoClientPromise = freshClient.connect();
//     const client = await global._mongoClientPromise;
//     return client.db(DB_NAME).collection(COLLECTION_NAME);
//   }
// }

// export async function createVectorStore(docs: any[]) {
//   const collection = await getCollection();
//   await collection.deleteMany({});

//   return await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, {
//     collection,
//     indexName: INDEX_NAME,
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }

// export async function getVectorStore() {
//   const collection = await getCollection();

//   const count = await collection.countDocuments();
//   console.log(`[VectorStore] Found ${count} documents in collection`);

//   if (count === 0) {
//     throw new Error("Collection is empty. Please run /api/ingest first.");
//   }

//   return new MongoDBAtlasVectorSearch(embeddings, {
//     collection,
//     indexName: INDEX_NAME,
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
// }   




import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient, MongoClientOptions } from "mongodb";
import { embeddings } from "./embeddings";

const DB_NAME = "ai_newsletter";
const COLLECTION_NAME = "news";
const INDEX_NAME = "vector_index";

const options: MongoClientOptions = {
  tls: true,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 5,
  retryWrites: true,
  retryReads: true,
};

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI!, options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

async function getCollection() {
  const client = await getClientPromise();
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// 🔥 MAIN FIX
export async function createVectorStore(docs: any[]) {
  const collection = await getCollection();

  // ✅ 1. REMOVE OLD DATA (rolling window: 2 days)
  const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  await collection.deleteMany({
    createdAt: { $lt: cutoff },
  });

  console.log("[VectorStore] Old documents cleaned");

  // ✅ 2. ADD TIMESTAMP + BASIC DEDUP KEY
  const enrichedDocs = docs.map((doc) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      createdAt: new Date(),
      hash: doc.pageContent?.slice(0, 100), // simple dedup key
    },
  }));

  // ✅ 3. OPTIONAL: SKIP DUPLICATES
  const existingHashes = new Set(
    (
      await collection
        .find({}, { projection: { "metadata.hash": 1 } })
        .toArray()
    ).map((d: any) => d.metadata?.hash)
  );

  const filteredDocs = enrichedDocs.filter(
    (d) => !existingHashes.has(d.metadata.hash)
  );

  console.log(
    `[VectorStore] Adding ${filteredDocs.length} new docs (skipped ${enrichedDocs.length - filteredDocs.length} duplicates)`
  );

  if (filteredDocs.length === 0) {
    console.warn("[VectorStore] No new documents to insert");
    return;
  }

  return await MongoDBAtlasVectorSearch.fromDocuments(
    filteredDocs,
    embeddings,
    {
      collection,
      indexName: INDEX_NAME,
      textKey: "text",
      embeddingKey: "embedding",
    }
  );
}

export async function getVectorStore() {
  const collection = await getCollection();

  const count = await collection.countDocuments();
  console.log(`[VectorStore] Found ${count} documents`);

  if (count === 0) {
    throw new Error("Collection is empty. Run ingestion first.");
  }

  return new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: INDEX_NAME,
    textKey: "text",
    embeddingKey: "embedding",
  });
}