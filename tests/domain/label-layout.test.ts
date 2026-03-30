import { LabelLayout } from "@/domain/label/entities/label-layout";

describe("LabelLayout", () => {
  it("accepts a valid layout with printable area", () => {
    const layout = LabelLayout.create({
      widthMm: 100,
      heightMm: 37.5,
      marginMm: 2,
      articleNameFontSizePt: 12,
      skuFontSizePt: 10,
      barcodeHeightMm: 16,
      orientation: "landscape"
    });

    expect(layout.printableWidthMm).toBe(96);
    expect(layout.printableHeightMm).toBe(33.5);
    expect(layout.orientation).toBe("landscape");
  });

  it("rejects layouts without printable width", () => {
    expect(() =>
      LabelLayout.create({
        widthMm: 10,
        heightMm: 20,
        marginMm: 5,
        articleNameFontSizePt: 12,
        skuFontSizePt: 10,
        barcodeHeightMm: 8,
        orientation: "landscape"
      })
    ).toThrow("Das Layout muss eine positive druckbare Fläche übrig lassen.");
  });
});
