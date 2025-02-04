import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/capture/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
          ...body,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send analytics");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to send analytics" },
      { status: 500 }
    );
  }
}
