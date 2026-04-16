// import { MongoClient } from "mongodb";
// import { runMultiAgentNewsletter } from "@/app/lib/langchain/agents/orchestrator";
// import { sendNewsletter } from "@/app/lib/mailer";

// const client = new MongoClient(process.env.MONGODB_URI!);

// export const runtime = "nodejs";

// export async function POST() {
//   try {
//     // Step 1 — Get all subscribers
//     await client.connect();
//     const collection = client.db("ai_newsletter").collection("subscribers");
//     const subscribers = await collection.find({}).toArray();

//     if (subscribers.length === 0) {
//       return Response.json({ error: "No subscribers found" }, { status: 400 });
//     }

//     const emails = subscribers.map((s) => s.email);

//     // Step 2 — Generate newsletter
//     console.log("[Send] Generating newsletter...");
//     const result = await runMultiAgentNewsletter();

//     // Step 3 — Send via Gmail
//     await sendNewsletter(emails, result.newsletter);

//     return Response.json({
//       message: `Newsletter sent to ${emails.length} subscribers`,
//       hallucinationScore: result.evaluation.score,
//       label: result.evaluation.label,
//     });
//   } catch (err: any) {
//     console.error("[Send] Error:", err.message);
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }  



import { MongoClient } from "mongodb";
import { sendNewsletter } from "@/app/lib/mailer";

const client = new MongoClient(process.env.MONGODB_URI!);

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { newsletter } = await req.json();

    if (!newsletter || newsletter.trim().length === 0) {
      return Response.json(
        { error: "No newsletter content provided. Please generate first." },
        { status: 400 }
      );
    }

    // Get all subscribers
    await client.connect();
    const collection = client.db("ai_newsletter").collection("subscribers");
    const subscribers = await collection.find({}).toArray();

    if (subscribers.length === 0) {
      return Response.json(
        { error: "No subscribers found. Add subscribers first." },
        { status: 400 }
      );
    }

    const emails = subscribers.map((s) => s.email);

    // Send the already-generated newsletter directly
    await sendNewsletter(emails, newsletter);

    return Response.json({
      message: `Newsletter sent to ${emails.length} subscriber${emails.length > 1 ? "s" : ""}`,
    });
  } catch (err: any) {
    console.error("[Send] Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}