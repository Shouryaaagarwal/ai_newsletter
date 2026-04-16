// import { runIngestion } from "@/app/lib/langchain/ingest";
// import { runMultiAgentNewsletter } from "@/app/lib/langchain/agents/orchestrator";
// import { sendIngestNotification, sendNewsletter } from "@/app/lib/mailer";
// import { MongoClient } from "mongodb";

// export const runtime = "nodejs";
// export const maxDuration = 300; // 5 min max — Vercel Pro allows up to 300s

// const client = new MongoClient(process.env.MONGODB_URI!);

// export async function GET(req: Request) {
//   // Verify request is from Vercel Cron
//   const authHeader = req.headers.get("authorization");
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     console.error("[Cron] Unauthorized request");
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   console.log("[Cron] Daily pipeline started at", new Date().toISOString());

//   try {
//     // ── STEP 1: Ingest fresh data ──────────────────────────
//     console.log("[Cron] Step 1 — Ingesting fresh data...");
//     const { totalChunks, perSource } = await runIngestion();
//     console.log(`[Cron] Ingested ${totalChunks} chunks`);

//     // ── STEP 2: Notify admin that ingest is done ───────────
//     console.log("[Cron] Step 2 — Sending ingest notification...");
//     await sendIngestNotification(totalChunks, perSource);

//     // ── STEP 3: Generate fresh newsletter ─────────────────
//     console.log("[Cron] Step 3 — Generating newsletter...");
//     const result = await runMultiAgentNewsletter();
//     console.log(`[Cron] Newsletter generated — score: ${result.evaluation.score}`);

//     // ── STEP 4: Fetch all subscribers ─────────────────────
//     await client.connect();
//     const col = client.db("ai_newsletter").collection("subscribers");
//     const subscribers = await col.find({}).toArray();
//     const emails = subscribers.map((s) => s.email);

//     if (emails.length === 0) {
//       console.log("[Cron] No subscribers — skipping email send");
//       return Response.json({
//         message: "Ingested and generated but no subscribers to send to",
//         totalChunks,
//       });
//     }

//     // ── STEP 5: Send newsletter to all subscribers ─────────
//     console.log(`[Cron] Step 4 — Sending to ${emails.length} subscribers...`);
//     await sendNewsletter(emails, result.newsletter);

//     console.log("[Cron] Daily pipeline completed successfully");

//     return Response.json({
//       message: "Daily pipeline completed",
//       totalChunks,
//       newsletterScore: result.evaluation.score,
//       subscribersSent: emails.length,
//       completedAt: new Date().toISOString(),
//     });

//   } catch (err: any) {
//     console.error("[Cron] Pipeline failed:", err.message);
//     return Response.json(
//       { error: "Pipeline failed", details: err.message },
//       { status: 500 }
//     );
//   }
// }  


import { runIngestion } from "@/app/lib/langchain/ingest";
import { runMultiAgentNewsletter } from "@/app/lib/langchain/agents/orchestrator";
import { sendIngestNotification, sendNewsletter } from "@/app/lib/mailer";
import { MongoClient } from "mongodb";

export const runtime = "nodejs";
export const maxDuration = 300;

const client = new MongoClient(process.env.MONGODB_URI!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  // 🔐 SECURITY CHECK (UPDATED)
  if (secret !== process.env.CRON_SECRET) {
    console.error("[Cron] Unauthorized request");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Cron] Daily pipeline started at", new Date().toISOString());

  try {
    // ── STEP 0: CLEAR OLD DATA (ADD THIS) ───────────────
    await client.connect();
    const db = client.db("ai_newsletter");

    console.log("[Cron] Clearing old data...");
    await db.collection("documents").deleteMany({});
    await db.collection("newsletter_cache").deleteMany({});

    // ── STEP 1: INGEST ─────────────────────────────────
    console.log("[Cron] Step 1 — Ingesting...");
    const { totalChunks, perSource } = await runIngestion();

    // ── STEP 2: ADMIN NOTIFICATION ─────────────────────
    await sendIngestNotification(totalChunks, perSource);

    // ── STEP 3: GENERATE NEWSLETTER ────────────────────
    console.log("[Cron] Step 3 — Generating newsletter...");
    const result = await runMultiAgentNewsletter(true);

    // ── STEP 4: GET SUBSCRIBERS ────────────────────────
    const col = db.collection("subscribers");
    const subscribers = await col.find({}).toArray();
    const emails = subscribers.map((s) => s.email);

    if (emails.length === 0) {
      console.log("[Cron] No subscribers found");
      return Response.json({ message: "No subscribers" });
    }

    // ── STEP 5: SEND NEWSLETTER ────────────────────────
    console.log(`[Cron] Sending to ${emails.length} users`);
    await sendNewsletter(emails, result.newsletter);

    console.log("[Cron] Pipeline completed");

    return Response.json({
      success: true,
      chunks: totalChunks,
      score: result.evaluation.score,
      sent: emails.length,
    });

  } catch (err: any) {
    console.error("[Cron] Failed:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}