// import { MongoClient } from "mongodb";

// const client = new MongoClient(process.env.MONGODB_URI!);

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   const { email } = await req.json();

//   if (!email || !email.includes("@")) {
//     return Response.json({ error: "Invalid email" }, { status: 400 });
//   }

//   await client.connect();
//   const collection = client.db("ai_newsletter").collection("subscribers");

//   // Upsert so duplicate emails don't cause errors
//   await collection.updateOne(
//     { email },
//     { $set: { email, subscribedAt: new Date() } },
//     { upsert: true }
//   );

//   return Response.json({ message: "Subscribed successfully" });
// }

// export async function DELETE(req: Request) {
//   const { email } = await req.json();

//   await client.connect();
//   const collection = client.db("ai_newsletter").collection("subscribers");
//   await collection.deleteOne({ email });

//   return Response.json({ message: "Unsubscribed successfully" });
// }   


// import { MongoClient } from "mongodb";

// const client = new MongoClient(process.env.MONGODB_URI!);

// export const runtime = "nodejs";

// // ✅ Available topics (keep consistent everywhere)
// const VALID_TOPICS = [
//   "ai_research",
//   "ai_industry",
//   "enterprise_software",
//   "cybersecurity",
//   "semiconductors",
//   "energy",
//   "geopolitics",
//   "india_ai",
// ];

// export async function POST(req: Request) {
//   try {
//     const { email, topics } = await req.json();

//     if (!email || !email.includes("@")) {
//       return Response.json({ error: "Invalid email" }, { status: 400 });
//     }

//     // 🔥 DEFAULT TOPICS (if user doesn't select)
//     let selectedTopics = topics;

//     if (!selectedTopics || selectedTopics.length === 0) {
//       selectedTopics = ["ai_research", "ai_industry"]; // default
//     }

//     // 🔥 VALIDATION
//     if (selectedTopics.length > 5) {
//       return Response.json(
//         { error: "Max 5 topics allowed" },
//         { status: 400 }
//       );
//     }

//     // remove invalid topics
//     selectedTopics = selectedTopics.filter((t: string) =>
//       VALID_TOPICS.includes(t)
//     );

//     await client.connect();
//     const collection = client.db("ai_newsletter").collection("subscribers");

//     await collection.updateOne(
//       { email },
//       {
//         $set: {
//           email,
//           preferences: {
//             topics: selectedTopics,
//           },
//           updatedAt: new Date(),
//         },
//         $setOnInsert: {
//           subscribedAt: new Date(),
//         },
//       },
//       { upsert: true }
//     );

//     return Response.json({
//       message: "Subscribed successfully",
//       topics: selectedTopics,
//     });

//   } catch (err: any) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// // 🔥 UPDATE PREFERENCES ONLY
// export async function PUT(req: Request) {
//   try {
//     const { email, topics } = await req.json();

//     if (!email) {
//       return Response.json({ error: "Email required" }, { status: 400 });
//     }

//     if (!topics || topics.length === 0) {
//       return Response.json(
//         { error: "Select at least 1 topic" },
//         { status: 400 }
//       );
//     }

//     if (topics.length > 5) {
//       return Response.json(
//         { error: "Max 5 topics allowed" },
//         { status: 400 }
//       );
//     }

//     await client.connect();
//     const collection = client.db("ai_newsletter").collection("subscribers");

//     await collection.updateOne(
//       { email },
//       {
//         $set: {
//           "preferences.topics": topics,
//           updatedAt: new Date(),
//         },
//       }
//     );

//     return Response.json({ message: "Preferences updated" });

//   } catch (err: any) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   const { email } = await req.json();

//   await client.connect();
//   const collection = client.db("ai_newsletter").collection("subscribers");

//   await collection.deleteOne({ email });

//   return Response.json({ message: "Unsubscribed successfully" });
// }  


import { MongoClient } from "mongodb";
import { sendWelcomeEmail } from "@/app/lib/mailer";

const client = new MongoClient(process.env.MONGODB_URI!);

export const runtime = "nodejs";

const VALID_TOPICS = [
  "ai_research",
  "ai_industry",
  "enterprise_software",
  "cybersecurity",
  "semiconductors",
  "energy",
  "geopolitics",
  "india_ai",
];

export async function POST(req: Request) {
  try {
    const { email, topics } = await req.json();

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    let selectedTopics = topics;

    if (!selectedTopics || selectedTopics.length === 0) {
      selectedTopics = ["ai_research", "ai_industry"];
    }

    if (selectedTopics.length > 5) {
      return Response.json(
        { error: "Max 5 topics allowed" },
        { status: 400 }
      );
    }

    selectedTopics = selectedTopics.filter((t: string) =>
      VALID_TOPICS.includes(t)
    );

    await client.connect();
    const collection = client.db("ai_newsletter").collection("subscribers");

    // 🔥 CHECK IF USER EXISTS
    const existingUser = await collection.findOne({ email });

    await collection.updateOne(
      { email },
      {
        $set: {
          email,
          preferences: {
            topics: selectedTopics,
          },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          subscribedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // 🔥 SEND WELCOME EMAIL ONLY IF NEW USER
    if (!existingUser) {
      try {
        await sendWelcomeEmail(email);
        console.log(`[Subscribe] Welcome email sent to ${email}`);
      } catch (err) {
        console.error("[Subscribe] Failed to send welcome email");
      }
    }

    return Response.json({
      message: "Subscribed successfully",
      topics: selectedTopics,
    });

  } catch (err: any) {
    console.error("[Subscribe] Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// 🔥 UPDATE PREFERENCES
export async function PUT(req: Request) {
  try {
    const { email, topics } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    if (!topics || topics.length === 0) {
      return Response.json(
        { error: "Select at least 1 topic" },
        { status: 400 }
      );
    }

    if (topics.length > 5) {
      return Response.json(
        { error: "Max 5 topics allowed" },
        { status: 400 }
      );
    }

    const filteredTopics = topics.filter((t: string) =>
      VALID_TOPICS.includes(t)
    );

    await client.connect();
    const collection = client.db("ai_newsletter").collection("subscribers");

    await collection.updateOne(
      { email },
      {
        $set: {
          "preferences.topics": filteredTopics,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({ message: "Preferences updated" });

  } catch (err: any) {
    console.error("[Preferences] Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// 🔥 UNSUBSCRIBE
export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    await client.connect();
    const collection = client.db("ai_newsletter").collection("subscribers");

    await collection.deleteOne({ email });

    return Response.json({ message: "Unsubscribed successfully" });

  } catch (err: any) {
    console.error("[Unsubscribe] Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}