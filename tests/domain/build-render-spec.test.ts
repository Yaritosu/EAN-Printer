import { LabelContent } from "@/domain/label/entities/label-content";
import { LabelDocument } from "@/domain/label/entities/label-document";
import { LabelLayout } from "@/domain/label/entities/label-layout";
import { buildRenderSpec } from "@/domain/label/services/build-render-spec";

describe("buildRenderSpec", () => {
  it("builds a render spec with CODE128 barcode and fixed centered text blocks", () => {
    const document = LabelDocument.create({
      content: LabelContent.create({
        articleName: "Premium Baumwoll-Shirt",
        sku: "SKU-1234",
        ean: "4006381333931"
      }),
      layout: LabelLayout.create({
        widthMm: 100,
        heightMm: 37.5,
        marginMm: 2,
        articleNameFontSizePt: 12,
        skuFontSizePt: 10,
        barcodeHeightMm: 16,
        orientation: "landscape"
      })
    });

    const spec = buildRenderSpec(document);

    expect(spec.widthMm).toBe(100);
    expect(spec.heightMm).toBe(37.5);
    expect(spec.marginsMm).toEqual({ top: 2, right: 2, bottom: 2, left: 2 });
    expect(spec.barcode.format).toBe("CODE128");
    expect(spec.barcode.value).toBe("4006381333931");
    expect(spec.textBlocks.map((block) => block.value)).toEqual([
      "Premium Baumwoll-Shirt",
      "SKU-1234",
      "4006381333931"
    ]);
    expect(spec.textBlocks.every((block) => block.align === "center")).toBe(true);
  });

  it("swaps width and height for portrait orientation", () => {
    const document = LabelDocument.create({
      content: LabelContent.create({
        articleName: "A6 Etikett",
        ean: "4006381333931"
      }),
      layout: LabelLayout.create({
        widthMm: 105,
        heightMm: 74,
        marginMm: 4,
        articleNameFontSizePt: 12,
        skuFontSizePt: 10,
        barcodeHeightMm: 20,
        orientation: "portrait"
      })
    });

    const spec = buildRenderSpec(document);

    expect(spec.widthMm).toBe(74);
    expect(spec.heightMm).toBe(105);
    expect(spec.textBlocks.map((block) => block.kind)).toEqual(["articleName", "humanReadableEan"]);
  });
});
