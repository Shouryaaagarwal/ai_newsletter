

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