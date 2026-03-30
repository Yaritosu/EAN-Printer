import bwipjs from "bwip-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { buildLayoutMetrics } from "@/domain/label/services/build-layout-metrics";
import { type RenderSpec } from "@/domain/label/services/build-render-spec";
import { mmToPoints } from "@/lib/units";

const renderBarcodePng = async (
  value: string,
  scale: number,
  heightMm: number
): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: value,
        scale: Math.max(1, Math.round(scale)),
        height: heightMm,
        includetext: false,
        paddingwidth: 0,
        paddingheight: 0
      },
      (error: Error | null, png: Buffer) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(new Uint8Array(png));
      }
    );
  });

export const renderPdf = async (spec: RenderSpec): Promise<Uint8Array> => {
  const metrics = buildLayoutMetrics(spec);
  const pdf = await PDFDocument.create();
  const width = mmToPoints(spec.widthMm);
  const height = mmToPoints(spec.heightMm);
  const page = pdf.addPage([width, height]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const barcodePng = await renderBarcodePng(spec.barcode.value, spec.barcode.scale, spec.barcode.heightMm);
  const barcodeImage = await pdf.embedPng(barcodePng);

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 1)
  });

  for (const row of metrics.textRows) {
    const drawFont = row.kind === "articleName" || row.kind === "locationCode" ? boldFont : font;
    page.drawText(row.value, {
      x: mmToPoints(row.x),
      y: height - mmToPoints(row.y + row.lineHeightMm),
      size: row.fontSizePt,
      font: drawFont,
      color: rgb(0.1, 0.13, 0.17)
    });
  }

  if (metrics.humanReadableRow) {
    page.drawText(metrics.humanReadableRow.value, {
      x: mmToPoints(metrics.humanReadableRow.x),
      y: height - mmToPoints(metrics.humanReadableRow.y + metrics.humanReadableRow.lineHeightMm),
      size: metrics.humanReadableRow.fontSizePt,
      font,
      color: rgb(0.1, 0.13, 0.17)
    });
  }

  page.drawImage(barcodeImage, {
    x: mmToPoints(metrics.barcodeBox.x),
    y: height - mmToPoints(metrics.barcodeBox.y + metrics.barcodeBox.height),
    width: mmToPoints(metrics.barcodeBox.width),
    height: mmToPoints(metrics.barcodeBox.height)
  });

  return pdf.save();
};
