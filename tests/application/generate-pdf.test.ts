import { generatePdf } from "@/application/use-cases/generate-pdf";

describe("generatePdf", () => {
  it("returns a non-empty PDF buffer for a valid label", async () => {
    const pdfBytes = await generatePdf({
      articleName: "PDF Testlabel",
      sku: "SKU-PDF",
      ean: "4006381333931",
      layout: {
        widthMm: 100,
        heightMm: 37.5,
        marginTopMm: 2,
        marginRightMm: 2,
        marginBottomMm: 2,
        marginLeftMm: 2,
        articleNameFontSizePt: 12,
        skuFontSizePt: 10,
        barcodeHeightMm: 16,
        barcodeScale: 2,
        textAlign: "left",
        showSku: true,
        showHumanReadableEan: true
      }
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.byteLength).toBeGreaterThan(500);
  });
});
