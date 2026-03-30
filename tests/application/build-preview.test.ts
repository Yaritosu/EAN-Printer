import { buildPreview } from "@/application/use-cases/build-preview";

describe("buildPreview", () => {
  it("returns a CODE128 render spec from manual label input", () => {
    const preview = buildPreview({
      articleName: "Etikettendrucker",
      sku: "SKU-9000",
      ean: "4006381333931",
      layout: {
        widthMm: 100,
        heightMm: 37.5,
        marginMm: 2,
        articleNameFontSizePt: 12,
        skuFontSizePt: 10,
        barcodeHeightMm: 16,
        orientation: "landscape"
      }
    });

    expect(preview.barcode.format).toBe("CODE128");
    expect(preview.textBlocks).toHaveLength(3);
    expect(preview.widthMm).toBe(100);
  });
});
