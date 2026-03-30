import { buildLayoutMetrics } from "@/domain/label/services/build-layout-metrics";
import { LabelContent } from "@/domain/label/entities/label-content";
import { LabelDocument } from "@/domain/label/entities/label-document";
import { LabelLayout } from "@/domain/label/entities/label-layout";
import { buildRenderSpec } from "@/domain/label/services/build-render-spec";

describe("buildLayoutMetrics", () => {
  it("places text rows from top padding downward and barcode from bottom upward", () => {
    const spec = buildRenderSpec(
      LabelDocument.create({
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
      })
    );

    const metrics = buildLayoutMetrics(spec);

    expect(metrics.contentBox.x).toBeCloseTo(2);
    expect(metrics.contentBox.width).toBeCloseTo(96);
    expect(metrics.barcodeBox.y + metrics.barcodeBox.height).toBeLessThanOrEqual(35.5);
    expect(metrics.textRows[0]?.y).toBeLessThan(metrics.textRows[1]?.y ?? Number.POSITIVE_INFINITY);
  });

  it("reserves extra bottom space when the human-readable EAN is shown", () => {
    const withReadable = buildLayoutMetrics({
      widthMm: 100,
      heightMm: 37.5,
      marginsMm: { top: 2, right: 2, bottom: 2, left: 2 },
      barcode: { format: "CODE128", value: "4006381333931", heightMm: 16, scale: 2 },
      textBlocks: [
        { kind: "articleName", value: "Artikel", fontSizePt: 12, align: "center" },
        { kind: "humanReadableEan", value: "4006381333931", fontSizePt: 10, align: "center" }
      ]
    });

    const withoutReadable = buildLayoutMetrics({
      widthMm: 100,
      heightMm: 37.5,
      marginsMm: { top: 2, right: 2, bottom: 2, left: 2 },
      barcode: { format: "CODE128", value: "4006381333931", heightMm: 16, scale: 2 },
      textBlocks: [{ kind: "articleName", value: "Artikel", fontSizePt: 12, align: "center" }]
    });

    expect(withReadable.barcodeBox.y).toBeLessThan(withoutReadable.barcodeBox.y);
  });
});
