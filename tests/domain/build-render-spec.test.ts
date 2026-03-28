import { LabelContent } from "@/domain/label/entities/label-content";
import { LabelDocument } from "@/domain/label/entities/label-document";
import { LabelLayout } from "@/domain/label/entities/label-layout";
import { buildRenderSpec } from "@/domain/label/services/build-render-spec";

describe("buildRenderSpec", () => {
  it("builds a render spec with CODE128 barcode and text blocks", () => {
    const document = LabelDocument.create({
      content: LabelContent.create({
        articleName: "Premium Baumwoll-Shirt",
        sku: "SKU-1234",
        ean: "4006381333931"
      }),
      layout: LabelLayout.create({
        widthMm: 100,
        heightMm: 37.5,
        marginTopMm: 2,
        marginRightMm: 2,
        marginBottomMm: 2,
        marginLeftMm: 2,
        articleNameFontSizePt: 12,
        skuFontSizePt: 10,
        barcodeHeightMm: 16,
        barcodeScale: 2.2,
        textAlign: "center",
        showSku: true,
        showHumanReadableEan: true
      })
    });

    const spec = buildRenderSpec(document);

    expect(spec.widthMm).toBe(100);
    expect(spec.heightMm).toBe(37.5);
    expect(spec.barcode.format).toBe("CODE128");
    expect(spec.barcode.value).toBe("4006381333931");
    expect(spec.textBlocks.map((block) => block.value)).toEqual([
      "Premium Baumwoll-Shirt",
      "SKU-1234",
      "4006381333931"
    ]);
  });

  it("omits the SKU block when disabled in the layout", () => {
    const document = LabelDocument.create({
      content: LabelContent.create({
        articleName: "Artikel ohne SKU",
        ean: "4006381333931"
      }),
      layout: LabelLayout.create({
        widthMm: 58,
        heightMm: 40,
        marginTopMm: 2,
        marginRightMm: 2,
        marginBottomMm: 2,
        marginLeftMm: 2,
        articleNameFontSizePt: 11,
        skuFontSizePt: 9,
        barcodeHeightMm: 16,
        barcodeScale: 2,
        textAlign: "left",
        showSku: false,
        showHumanReadableEan: true
      })
    });

    const spec = buildRenderSpec(document);

    expect(spec.textBlocks.map((block) => block.kind)).toEqual(["articleName", "humanReadableEan"]);
  });
});
