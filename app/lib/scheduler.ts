import cron from "node-cron";
import { MongoClient } from "mongodb";
import { runIngestion } from "@/app/lib/langchain/ingest"; // 👈 your ingest logic function

const client = new MongoClient(process.env.MONGODB_URI!);

const DB = "ai_newsletter";
const COLLECTIONS_TO_CLEAR = [
  "documents",          
  "newsletter_cache",  
];

async function clearDatabase() {
  await client.connect();
  const db = client.db(DB);

  console.log("[Scheduler] Clearing old data...");

  for (const colName of COLLECTIONS_TO_CLEAR) {
    const col = db.collection(colName);
    await col.deleteMany({});
    console.log(`[Scheduler] Cleared collection: ${colName}`);
  }
}

async function runPipeline() {
  try {
    console.log("[Scheduler] Starting scheduled pipeline...");

    await clearDatabase();

    console.log("[Scheduler] Running ingestion...");
    await runIngestion(); // 👈 directly call function (BEST PRACTICE)

    console.log("[Scheduler] Pipeline completed successfully");
  } catch (err) {
    console.error("[Scheduler] Error:", err);
  }
}

// 🕒 Schedule: Every day at 6 AM
cron.schedule("0 6 * * *", async () => {
  console.log("[Scheduler] Triggered at 6 AM");
  await runPipeline();
});