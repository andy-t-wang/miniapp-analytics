"use client";

// Custom analytics function that uses our proxy
async function captureEvent(
  eventName: string,
  properties?: Record<string, unknown>,
  retries = 2
) {
  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventName,
        properties: {
          ...properties,
          $current_url: window.location.href,
          $browser: navigator.userAgent,
        },
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send analytics");
    }
  } catch (error) {
    console.error("Analytics error:", error);
    // Retry the request if we have retries left
    if (retries > 0) {
      console.log(
        `Retrying analytics event ${eventName}, ${retries} retries left`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return captureEvent(eventName, properties, retries - 1);
    }
  }
}

export const analytics = {
  capture: captureEvent,
};
