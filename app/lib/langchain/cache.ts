import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

const DB = "ai_newsletter";
const COL = "newsletter_cache";
const TTL_HOURS = 12; // regenerate only after 12 hours

export async function getCachedNewsletter(): Promise<{
  newsletter: string;
  evaluation: { score: number; label: string; flaggedClaims: string[] };
} | null> {
  await client.connect();
  const col = client.db(DB).collection(COL);

  const cutoff = new Date(Date.now() - TTL_HOURS * 60 * 60 * 1000);
  const cached = await col.findOne({ createdAt: { $gte: cutoff } }, { sort: { createdAt: -1 } });

  if (!cached) return null;

  console.log(`[Cache] HIT — serving cached newsletter from ${cached.createdAt}`);
  return {
    newsletter: cached.newsletter,
    evaluation: cached.evaluation,
  };
}

export async function cacheNewsletter(
  newsletter: string,
  evaluation: { score: number; label: string; flaggedClaims: string[] }
) {
  await client.connect();
  const col = client.db(DB).collection(COL);

  await col.insertOne({ newsletter, evaluation, createdAt: new Date() });
  console.log(`[Cache] Newsletter saved to cache`);
}