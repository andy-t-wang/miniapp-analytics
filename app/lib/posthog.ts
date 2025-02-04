"use client";

// Custom analytics function that uses our proxy
async function captureEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send analytics");
    }
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

export const analytics = {
  capture: captureEvent,
};
