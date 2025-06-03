import React from "react";
import { NextResponse } from "next/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

// Define types for the app data
interface AppData {
  name: string;
  integration_url: string;
  team_name: string;
  app_id: string;
  is_android_only: boolean;
}

interface CleanedAppData {
  name: string;
  url: string;
  team: string;
  app_id: string;
}

interface ApiResponse {
  app_rankings: {
    top_apps: AppData[];
  };
}

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  summary: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginBottom: 30,
    textAlign: "center",
    fontSize: 12,
    color: "#333",
  },
  table: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
    padding: 12,
    minHeight: 30,
    alignItems: "center",
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "left",
    padding: 8,
    paddingVertical: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    minHeight: 30,
    fontSize: 10,
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "left",
    fontSize: 10,
  },
  urlCell: {
    flex: 2,
    padding: 8,
    textAlign: "left",
    fontSize: 8,
    color: "#7f8c8d",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 10,
    color: "#7f8c8d",
  },
});

export async function GET() {
  try {
    console.log("Fetching app data...");

    // Fetch data from API
    const res = await fetch(
      `https://world-id-assets.com/api/v2/public/apps?skip_country_check=true`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const apps: ApiResponse = await res.json();
    const appDetails = apps.app_rankings.top_apps;
    const ios_apps = appDetails.filter((app: AppData) => !app.is_android_only);

    const ios_apps_cleaned: CleanedAppData[] = ios_apps.map((app: AppData) => ({
      name: app.name,
      url: app.integration_url,
      team: app.team_name,
      app_id: app.app_id,
    }));

    console.log(`Found ${ios_apps_cleaned.length} iOS apps`);

    // Generate PDF using @react-pdf/renderer
    console.log("Generating PDF...");
    const pdfDoc = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: "A4", style: styles.page },
        React.createElement(Text, { style: styles.title }, "iOS Apps Report"),
        React.createElement(
          View,
          { style: styles.summary },
          React.createElement(
            Text,
            null,
            `Total iOS Apps: ${ios_apps_cleaned.length}`
          )
        ),
        React.createElement(
          View,
          { style: styles.table },
          // Table Header
          React.createElement(
            View,
            { style: styles.tableHeader },
            React.createElement(
              Text,
              { style: [styles.tableHeaderCell, { flex: 2 }] },
              "App Name"
            ),
            React.createElement(
              Text,
              { style: [styles.tableHeaderCell, { flex: 3 }] },
              "URL"
            ),
            React.createElement(
              Text,
              { style: [styles.tableHeaderCell, { flex: 2 }] },
              "Team"
            )
          ),
          // Table Rows
          ...ios_apps_cleaned.map((app, index) =>
            React.createElement(
              View,
              {
                key: app.app_id,
                style: [
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowEven : {},
                ],
              },
              React.createElement(
                Text,
                { style: [styles.tableCell, { flex: 2 }] },
                app.name
              ),
              React.createElement(
                Text,
                { style: [styles.urlCell, { flex: 3 }] },
                app.url
              ),
              React.createElement(
                Text,
                { style: [styles.tableCell, { flex: 2 }] },
                app.team
              )
            )
          )
        ),
        React.createElement(
          Text,
          { style: styles.footer },
          `Generated on ${new Date().toLocaleDateString()}`
        )
      )
    );

    const pdfInstance = pdf(pdfDoc);

    // Get the ReadableStream from toBuffer()
    const stream = await pdfInstance.toBuffer();

    // Convert ReadableStream to Buffer
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      stream.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      stream.on("error", (error: Error) => {
        reject(error);
      });
    });

    console.log("PDF generated successfully");

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ios_apps_report.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
