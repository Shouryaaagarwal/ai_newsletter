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


// import { runIngestion } from "@/app/lib/langchain/ingest";
// import { runMultiAgentNewsletter } from "@/app/lib/langchain/agents/orchestrator";
// import { sendIngestNotification, sendNewsletter } from "@/app/lib/mailer";
// import { MongoClient } from "mongodb";

// export const runtime = "nodejs";
// export const maxDuration = 300;

// const client = new MongoClient(process.env.MONGODB_URI!);

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const secret = searchParams.get("secret");

//   // 🔐 SECURITY CHECK (UPDATED)
//   if (secret !== process.env.CRON_SECRET) {
//     console.error("[Cron] Unauthorized request");
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   console.log("[Cron] Daily pipeline started at", new Date().toISOString());

//   try {
//     // ── STEP 0: CLEAR OLD DATA (ADD THIS) ───────────────
//     await client.connect();
//     const db = client.db("ai_newsletter");

//     console.log("[Cron] Clearing old data...");
//     await db.collection("documents").deleteMany({});
//     await db.collection("newsletter_cache").deleteMany({});

//     // ── STEP 1: INGEST ─────────────────────────────────
//     console.log("[Cron] Step 1 — Ingesting...");
//     const { totalChunks, perSource } = await runIngestion();

//     // ── STEP 2: ADMIN NOTIFICATION ─────────────────────
//     await sendIngestNotification(totalChunks, perSource);

//     // ── STEP 3: GENERATE NEWSLETTER ────────────────────
//     console.log("[Cron] Step 3 — Generating newsletter...");
//     const result = await runMultiAgentNewsletter(true);

//     // ── STEP 4: GET SUBSCRIBERS ────────────────────────
//     const col = db.collection("subscribers");
//     const subscribers = await col.find({}).toArray();
//     const emails = subscribers.map((s) => s.email);

//     if (emails.length === 0) {
//       console.log("[Cron] No subscribers found");
//       return Response.json({ message: "No subscribers" });
//     }

//     // ── STEP 5: SEND NEWSLETTER ────────────────────────
//     console.log(`[Cron] Sending to ${emails.length} users`);
//     await sendNewsletter(emails, result.newsletter);

//     console.log("[Cron] Pipeline completed");

//     return Response.json({
//       success: true,
//       chunks: totalChunks,
//       score: result.evaluation.score,
//       sent: emails.length,
//     });

//   } catch (err: any) {
//     console.error("[Cron] Failed:", err.message);
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }   



// import { runIngestion } from "@/app/lib/langchain/ingest";
// import { runMultiAgentNewsletter } from "@/app/lib/langchain/agents/orchestrator";
// import { sendIngestNotification, sendNewsletter } from "@/app/lib/mailer";
// import { MongoClient } from "mongodb";

// export const runtime = "nodejs";
// export const maxDuration = 300;

// const client = new MongoClient(process.env.MONGODB_URI!);

// // 🔥 Prevent double execution (basic protection)
// let isRunning = false;

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const secret = searchParams.get("secret");

//   // 🔐 Security check (cron-job.org compatible)
//   if (secret !== process.env.CRON_SECRET) {
//     console.error("[Cron] Unauthorized request");
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // 🚫 Prevent duplicate runs
//   if (isRunning) {
//     console.log("[Cron] Already running — skipping");
//     return Response.json({ message: "Already running" });
//   }

//   isRunning = true;

//   console.log("[Cron] Pipeline started at", new Date().toISOString());

//   try {
//     await client.connect();
//     const db = client.db("ai_newsletter");

//     // ── STEP 0: CLEAR OLD DATA ─────────────────────────
//     console.log("[Cron] Clearing old data...");

//     const collectionsToClear = [
//       "documents",
//       "newsletter_cache",
//       // "vectors" // 👈 add if your vector DB uses this
//     ];

//     for (const col of collectionsToClear) {
//       await db.collection(col).deleteMany({});
//       console.log(`[Cron] Cleared ${col}`);
//     }

//     // ── STEP 1: INGEST ─────────────────────────────────
//     console.log("[Cron] Step 1 — Ingesting data...");
//     const { totalChunks, perSource } = await runIngestion();
//     console.log(`[Cron] Ingested ${totalChunks} chunks`);

//     // ── STEP 2: ADMIN NOTIFICATION ─────────────────────
//     console.log("[Cron] Step 2 — Sending ingest report...");
//     await sendIngestNotification(totalChunks, perSource);

//     // ── STEP 3: GENERATE NEWSLETTER ────────────────────
//     console.log("[Cron] Step 3 — Generating newsletter...");
//     const result = await runMultiAgentNewsletter(true);

//     console.log(
//       `[Cron] Newsletter generated — score: ${result.evaluation.score}`
//     );

//     // ── STEP 4: FETCH SUBSCRIBERS ──────────────────────
//     const subscribers = await db.collection("subscribers").find({}).toArray();
//     const emails = subscribers.map((s) => s.email);

//     if (emails.length === 0) {
//       console.log("[Cron] No subscribers found");

//       await db.collection("cron_logs").insertOne({
//         time: new Date(),
//         status: "no_subscribers",
//         chunks: totalChunks,
//         score: result.evaluation.score,
//       });

//       return Response.json({ message: "No subscribers found" });
//     }

//     // ── STEP 5: SEND NEWSLETTER ────────────────────────
//     console.log(`[Cron] Sending to ${emails.length} subscribers...`);
//     await sendNewsletter(emails, result.newsletter);

//     // ── STEP 6: LOG SUCCESS ────────────────────────────
//     await db.collection("cron_logs").insertOne({
//       time: new Date(),
//       status: "success",
//       chunks: totalChunks,
//       score: result.evaluation.score,
//       subscribers: emails.length,
//     });

//     console.log("[Cron] Pipeline completed successfully");

//     return Response.json({
//       success: true,
//       chunks: totalChunks,
//       score: result.evaluation.score,
//       sent: emails.length,
//       completedAt: new Date().toISOString(),
//     });

//   } catch (err: any) {
//     console.error("[Cron] Pipeline failed:", err.message);

//     try {
//       const db = client.db("ai_newsletter");
//       await db.collection("cron_logs").insertOne({
//         time: new Date(),
//         status: "failed",
//         error: err.message,
//       });
//     } catch (logErr) {
//       console.error("[Cron] Failed to log error");
//     }

//     return Response.json(
//       { error: "Pipeline failed", details: err.message },
//       { status: 500 }
//     );
//   } finally {
//     // 🔥 ALWAYS reset
//     isRunning = false;
//   }
// }   '




// import { runIngestion } from "@/app/lib/langchain/ingest";
// import { runMultiAgentNewsletter } from "@/app/lib/langchain/agents/orchestrator";
// import { sendIngestNotification, sendNewsletter } from "@/app/lib/mailer";
// import { MongoClient } from "mongodb";

// export const runtime = "nodejs";
// export const maxDuration = 300;

// const client = new MongoClient(process.env.MONGODB_URI!);

// let isRunning = false;

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const secret = searchParams.get("secret");

//   if (secret !== process.env.CRON_SECRET) {
//     console.error("[Cron] Unauthorized request");
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   if (isRunning) {
//     console.log("[Cron] Already running — skipping");
//     return Response.json({ message: "Already running" });
//   }

//   isRunning = true;

//   console.log("[Cron] Pipeline started at", new Date().toISOString());

//   try {
//     await client.connect();
//     const db = client.db("ai_newsletter");

//     // ── STEP 0: CLEAR OLD DATA ─────────────────────────
//     console.log("[Cron] Clearing old data...");

//     for (const col of ["documents", "newsletter_cache"]) {
//       await db.collection(col).deleteMany({});
//       console.log(`[Cron] Cleared ${col}`);
//     }

//     // ── STEP 1: INGEST ─────────────────────────────────
//     console.log("[Cron] Step 1 — Ingesting data...");
//     let { totalChunks, perSource } = await runIngestion();

//     console.log(`[Cron] Ingested ${totalChunks} chunks`);

//     // 🔥 RETRY IF WEAK INGESTION
//     if (totalChunks < 50) {
//       console.warn("[Cron] Low data — retrying ingestion...");

//       await new Promise((r) => setTimeout(r, 1000));

//       const retry = await runIngestion();
//       totalChunks = retry.totalChunks;
//       perSource = retry.perSource;

//       console.log(`[Cron] Retry ingestion → ${totalChunks} chunks`);
//     }

//     // 🔥 HARD STOP IF STILL LOW
//     if (totalChunks < 30) {
//       console.error("[Cron] Not enough data — skipping newsletter");

//       await db.collection("cron_logs").insertOne({
//         time: new Date(),
//         status: "skipped_low_data",
//         chunks: totalChunks,
//       });

//       return Response.json({
//         message: "Skipped due to low data",
//         totalChunks,
//       });
//     }

//     // ── STEP 2: ADMIN NOTIFICATION ─────────────────────
//     await sendIngestNotification(totalChunks, perSource);

//     // 🔥 WAIT FOR VECTOR STORE TO SETTLE
//     console.log("[Cron] Waiting before generation...");
//     await new Promise((r) => setTimeout(r, 1500));

//     // ── STEP 3: GENERATE NEWSLETTER ────────────────────
//     console.log("[Cron] Step 3 — Generating newsletter...");
//     const result = await runMultiAgentNewsletter(true);

//     console.log(
//       `[Cron] Newsletter generated — score: ${result.evaluation.score}`
//     );

//     // 🔥 SKIP LOW QUALITY NEWSLETTER
//     if (result.evaluation.score < 0.6) {
//       console.warn("[Cron] Low quality — skipping send");

//       await db.collection("cron_logs").insertOne({
//         time: new Date(),
//         status: "skipped_low_quality",
//         score: result.evaluation.score,
//       });

//       return Response.json({
//         message: "Skipped due to low quality",
//         score: result.evaluation.score,
//       });
//     }

//     // ── STEP 4: FETCH SUBSCRIBERS ──────────────────────
//     const subscribers = await db.collection("subscribers").find({}).toArray();
//     const emails = subscribers.map((s) => s.email);

//     if (emails.length === 0) {
//       console.log("[Cron] No subscribers found");

//       await db.collection("cron_logs").insertOne({
//         time: new Date(),
//         status: "no_subscribers",
//         chunks: totalChunks,
//         score: result.evaluation.score,
//       });

//       return Response.json({ message: "No subscribers found" });
//     }

//     // ── STEP 5: SEND NEWSLETTER ────────────────────────
//     console.log(`[Cron] Sending to ${emails.length} subscribers...`);
//     await sendNewsletter(emails, result.newsletter);

//     // ── STEP 6: LOG SUCCESS ────────────────────────────
//     await db.collection("cron_logs").insertOne({
//       time: new Date(),
//       status: "success",
//       chunks: totalChunks,
//       score: result.evaluation.score,
//       subscribers: emails.length,
//     });

//     console.log("[Cron] Pipeline completed successfully");

//     return Response.json({
//       success: true,
//       chunks: totalChunks,
//       score: result.evaluation.score,
//       sent: emails.length,
//       completedAt: new Date().toISOString(),
//     });

//   } catch (err: any) {
//     console.error("[Cron] Pipeline failed:", err.message);

//     try {
//       const db = client.db("ai_newsletter");
//       await db.collection("cron_logs").insertOne({
//         time: new Date(),
//         status: "failed",
//         error: err.message,
//       });
//     } catch {
//       console.error("[Cron] Failed to log error");
//     }

//     return Response.json(
//       { error: "Pipeline failed", details: err.message },
//       { status: 500 }
//     );
//   } finally {
//     isRunning = false;
//   }
// }   




// import { MongoClient } from "mongodb";
// import { sendNewsletter } from "@/app/lib/mailer";

// export const runtime = "nodejs";
// export const maxDuration = 300;

// const client = new MongoClient(process.env.MONGODB_URI!);

// let isRunning = false;

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const secret = searchParams.get("secret");

//   if (secret !== process.env.CRON_SECRET) {
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   if (isRunning) {
//     console.log("[Cron] Already running — skipping");
//     return Response.json({ message: "Already running" });
//   }

//   isRunning = true;

//   try {
//     console.log("[Cron] Starting full pipeline...");

//     const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
//     await client.connect();
//     const db = client.db("ai_newsletter");

//     // ── STEP 0: CLEAR DB ─────────────────────────
//     console.log("[Cron] Clearing database...");

//     await db.collection("news").deleteMany({});
//     await db.collection("newsletter_cache").deleteMany({});

//     console.log("[Cron] Database cleared");

//     console.log("[Cron] Calling /api/ingest...");

//     const ingestRes = await fetch(`${BASE_URL}/api/ingest`);
//     const ingestData = await ingestRes.json();

//     console.log("[Cron] Ingest response:", ingestData);

//     console.log("[Cron] Waiting 60s after ingestion...");
//     await sleep(60000);

//     console.log("[Cron] Calling /api/generate...");

//     const genRes = await fetch(`${BASE_URL}/api/generate`);
//     const genData = await genRes.json();

//     if (!genData?.newsletter) {
//       throw new Error("Newsletter generation failed");
//     }

//     console.log("[Cron] Newsletter generated");

//     console.log("[Cron] Waiting 60s before sending...");
//     await sleep(60000);

//     console.log("[Cron] Sending emails...");

//     const subscribers = await db.collection("subscribers").find({}).toArray();
//     const emails = subscribers.map((s) => s.email);

//     if (emails.length === 0) {
//       console.log("[Cron] No subscribers found");
//       return Response.json({ message: "No subscribers" });
//     }

//     const readTime = Math.max(1, Math.ceil(genData.newsletter.split(/\s+/).length / 200));
//     await sendNewsletter(emails, genData.newsletter, readTime);

//     console.log(`[Cron] Sent to ${emails.length} users`);

//     return Response.json({
//       success: true,
//       sent: emails.length,
//     });

//   } catch (err: any) {
//     console.error("[Cron] Failed:", err.message);

//     return Response.json(
//       { error: "Cron failed", details: err.message },
//       { status: 500 }
//     );
//   } finally {
//     isRunning = false;
//   }
// }  


import { MongoClient } from "mongodb";
import { sendNewsletter, sendIngestReportEmail } from "@/app/lib/mailer";

export const runtime = "nodejs";
export const maxDuration = 300;

const client = new MongoClient(process.env.MONGODB_URI!);

let isRunning = false;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isRunning) {
    console.log("[Cron] Already running — skipping");
    return Response.json({ message: "Already running" });
  }

  isRunning = true;

  try {
    console.log("[Cron] Starting full pipeline...");

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
    await client.connect();
    const db = client.db("ai_newsletter");

    // ── STEP 0: CLEAR DB ─────────────────────────
    console.log("[Cron] Clearing database...");

    await db.collection("news").deleteMany({});
    await db.collection("newsletter_cache").deleteMany({});

    console.log("[Cron] Database cleared");

    console.log("[Cron] Calling /api/ingest...");

    const ingestRes = await fetch(`${BASE_URL}/api/ingest`);
    const ingestData = await ingestRes.json();

    console.log("[Cron] Ingest response:", ingestData);

    // 🔥 NEW: SEND INGEST REPORT EMAIL
    try {
      if (ingestData?.perSource) {
        await sendIngestReportEmail(ingestData.perSource);
        console.log("[Cron] Ingest report email sent");
      } else {
        console.warn("[Cron] No perSource data found for report");
      }
    } catch (err) {
      console.error("[Cron] Failed to send ingest report email");
    }

    console.log("[Cron] Waiting 60s after ingestion...");
    await sleep(60000);

    console.log("[Cron] Calling /api/generate...");

    const genRes = await fetch(`${BASE_URL}/api/generate`);
    const genData = await genRes.json();

    if (!genData?.newsletter) {
      throw new Error("Newsletter generation failed");
    }

    console.log("[Cron] Newsletter generated");

    console.log("[Cron] Waiting 60s before sending...");
    await sleep(60000);

    console.log("[Cron] Sending emails...");

    const subscribers = await db.collection("subscribers").find({}).toArray();
    const emails = subscribers.map((s) => s.email);

    if (emails.length === 0) {
      console.log("[Cron] No subscribers found");
      return Response.json({ message: "No subscribers" });
    }

    const readTime = Math.max(
      1,
      Math.ceil(genData.newsletter.split(/\s+/).length / 200)
    );

    await sendNewsletter(emails, genData.newsletter, readTime);

    console.log(`[Cron] Sent to ${emails.length} users`);

    return Response.json({
      success: true,
      sent: emails.length,
    });

  } catch (err: any) {
    console.error("[Cron] Failed:", err.message);

    return Response.json(
      { error: "Cron failed", details: err.message },
      { status: 500 }
    );
  } finally {
    isRunning = false;
  }
}