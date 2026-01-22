import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SentimentIntensityAnalyzer } from "vader-sentiment";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("X-API-Key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401, headers: corsHeaders }
      );
    }

    const project = await prisma.project.findUnique({
      where: { apiKey },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { content, rating, feedbackType, email } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400, headers: corsHeaders }
      );
    }

    const validTypes = ["BUG", "FEATURE", "OTHER"];
    const type = validTypes.includes(feedbackType) ? feedbackType : "OTHER";

    const result = SentimentIntensityAnalyzer.polarity_scores(content.trim());
    console.log("Sentiment analysis result:", result);

    let sentiment = "neutral";
    if (result.compound >= 0.1) sentiment = "positive";
    if (result.compound <= -0.1) sentiment = "negative";

    const sentimentScore = Math.abs(result.compound);

    const feedback = await prisma.feedback.create({
      data: {
        content: content.trim(),
        rating,
        feedbackType: type,
        email: email?.trim() || null,
        userAgent: request.headers.get("user-agent") || null,
        projectId: project.id,
        sentiment,
        sentimentScore,
      },
    });

    return NextResponse.json(
      { success: true, id: feedback.id },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
