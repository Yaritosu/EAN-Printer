import { NextResponse } from "next/server";

import { generateLocationPdf } from "@/application/use-cases/generate-location-pdf";

export const POST = async (request: Request) => {
  try {
    const payload = await request.json();
    const pdfBytes = await generateLocationPdf(payload);
    const body = Buffer.from(pdfBytes);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="stellplatz-label.pdf"'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Stellplatz-PDF konnte nicht erzeugt werden."
      },
      { status: 400 }
    );
  }
};
