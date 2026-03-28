import { NextResponse } from "next/server";

import { generatePdf } from "@/application/use-cases/generate-pdf";

export const POST = async (request: Request) => {
  try {
    const payload = await request.json();
    const pdfBytes = await generatePdf(payload);
    const body = Buffer.from(pdfBytes);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="ean-label.pdf"'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "PDF generation failed."
      },
      { status: 400 }
    );
  }
};
