import { NextResponse } from "next/server";
import { generateReviewSummary } from "@/lib/reviewSummary";
import type { Review } from "@/lib/types";

export async function POST(request: Request) {
  const { reviews } = (await request.json()) as { reviews: Review[] };

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return NextResponse.json({ summary: null });
  }

  const result = await generateReviewSummary(reviews);
  const summary = typeof result === "string" ? result : null;
  return NextResponse.json({ summary });
}
