import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

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

// Generate HTML content for PDF
const generateHTML = (data: CleanedAppData[]): string => {
  const tableRows = data
    .map(
      (row) => `
    <tr>
      <td>${row.name}</td>
      <td class="url-cell">${row.url}</td>
      <td>${row.team}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>iOS Apps Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        
        h1 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 30px;
          font-size: 24px;
        }
        
        .summary {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 30px;
          text-align: center;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
          background-color: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        th {
          background-color: #3498db;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #2980b9;
        }
        
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #ecf0f1;
          vertical-align: top;
        }
        
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        
        tr:hover {
          background-color: #e8f4fd;
        }
        
        .url-cell {
          word-break: break-all;
          font-size: 10px;
          color: #7f8c8d;
          max-width: 200px;
        }
        
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #7f8c8d;
        }
      </style>
    </head>
    <body>
      <h1>iOS Apps Report</h1>
      <table>
        <thead>
          <tr>
            <th>App Name</th>
            <th>URL</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
};

// Generate PDF and return as buffer
async function generatePDF(data: CleanedAppData[]): Promise<Uint8Array> {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // For deployment environments
  });

  try {
    const page = await browser.newPage();

    // Set the HTML content
    const htmlContent = generateHTML(data);
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    console.log("Generating PDF...");

    // Generate PDF as buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      printBackground: true,
    });

    console.log("PDF generated successfully");
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

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

    // Generate PDF
    const pdfBuffer = await generatePDF(ios_apps_cleaned);

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
