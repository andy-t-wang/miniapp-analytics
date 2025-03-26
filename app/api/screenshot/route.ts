import { NextResponse } from "next/server";
import { chromium } from "playwright-core";

export const revalidate = 86400; // 24 hours

export async function GET(request: Request) {
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 630 });

    // Get the base URL from the request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Navigate to the page
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    // Take a screenshot
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    await browser.close();

    // Return the screenshot as a response with caching headers
    return new NextResponse(screenshot, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Screenshot error:", error);
    return NextResponse.json(
      { error: "Failed to generate screenshot" },
      { status: 500 }
    );
  }
}
