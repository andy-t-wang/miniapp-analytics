import { NextResponse } from "next/server";
import { chromium } from "playwright";

export const revalidate = 86400; // 24 hours

export async function GET(request: Request) {
  let browser;
  try {
    console.log("Starting screenshot generation...");
    browser = await chromium.launch({
      headless: true,
    });
    console.log("Browser launched successfully");

    const context = await browser.newContext({
      viewport: { width: 1200, height: 630 },
    });
    const page = await context.newPage();
    console.log("Page created and viewport set");

    // Get the base URL from the request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    console.log("Navigating to:", baseUrl);

    // Navigate to the main page instead of the screenshot endpoint
    const response = await page.goto(baseUrl, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    if (!response) {
      throw new Error("Failed to get response from page");
    }

    console.log("Page loaded, status:", response.status());

    // Wait for the content to be fully loaded
    try {
      await page.waitForSelector(".bg-white", { timeout: 10000 });
      console.log("Content loaded successfully");
    } catch (selectorError) {
      console.error("Failed to find content:", selectorError);
      // Continue anyway as the page might still be usable
    }

    // Take a screenshot
    console.log("Taking screenshot...");
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });
    console.log("Screenshot taken successfully");

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
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed successfully");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
}
