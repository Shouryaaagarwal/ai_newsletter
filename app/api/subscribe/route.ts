import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  await client.connect();
  const collection = client.db("ai_newsletter").collection("subscribers");

  // Upsert so duplicate emails don't cause errors
  await collection.updateOne(
    { email },
    { $set: { email, subscribedAt: new Date() } },
    { upsert: true }
  );

  return Response.json({ message: "Subscribed successfully" });
}

export async function DELETE(req: Request) {
  const { email } = await req.json();

  await client.connect();
  const collection = client.db("ai_newsletter").collection("subscribers");
  await collection.deleteOne({ email });

  return Response.json({ message: "Unsubscribed successfully" });
}