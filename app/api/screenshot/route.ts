import { NextResponse } from "next/server";
import mql from "@microlink/mql";

export const revalidate = 1800; // 24 hours

export async function GET(request: Request) {
  try {
    // Get the base URL from the request
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const pathname = searchParams.get("pathname") || "";
    const baseUrl = `${url.protocol}//${url.host}/${pathname}`;

    const { data } = await mql(baseUrl, {
      screenshot: true,
      meta: false,
      adblock: true,
      viewport: {
        width: 1200,
        height: 630,
        deviceScaleFactor: 1,
      },
    });

    if (!data?.screenshot?.url) {
      throw new Error("Failed to generate screenshot");
    }

    // Fetch the screenshot from Microlink
    const screenshotResponse = await fetch(data.screenshot.url);
    const screenshot = await screenshotResponse.arrayBuffer();

    return new NextResponse(screenshot, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Detailed screenshot error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        error: "Failed to generate screenshot",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
