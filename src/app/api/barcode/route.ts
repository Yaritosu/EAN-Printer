import bwipjs from "bwip-js";
import { NextResponse } from "next/server";

import { Ean13 } from "@/domain/label/value-objects/ean13";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value") ?? "";
  const scale = Number(searchParams.get("scale") ?? "2");
  const heightMm = Number(searchParams.get("heightMm") ?? "16");

  try {
    const ean = Ean13.create(value);
    const svg = bwipjs.toSVG({
      bcid: "code128",
      text: ean.value,
      scale: Math.max(1, Math.round(scale)),
      height: Math.max(8, heightMm),
      includetext: false,
      backgroundcolor: "FFFFFF"
    });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Barcode preview failed."
      },
      { status: 400 }
    );
  }
};
