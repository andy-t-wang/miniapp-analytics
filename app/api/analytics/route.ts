import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Construct the PostHog payload
    const payload = {
      api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      type: "capture",
      event: body.event,
      properties: {
        ...body.properties,
        $lib: "mini-app-analytics",
      },
      timestamp: body.timestamp,
      distinct_id: "anonymous", // Since we don't track individual users
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`PostHog error: ${response.status} ${responseText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    // Return the actual error message for debugging
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
