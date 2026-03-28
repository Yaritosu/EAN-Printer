import { LabelLayout } from "@/domain/label/entities/label-layout";

describe("LabelLayout", () => {
  it("accepts a valid layout with printable area", () => {
    const layout = LabelLayout.create({
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
      textAlign: "left",
      showSku: true,
      showHumanReadableEan: true
    });

    expect(layout.printableWidthMm).toBe(96);
    expect(layout.printableHeightMm).toBe(33.5);
  });

  it("rejects layouts without printable width", () => {
    expect(() =>
      LabelLayout.create({
        widthMm: 10,
        heightMm: 20,
        marginTopMm: 2,
        marginRightMm: 5,
        marginBottomMm: 2,
        marginLeftMm: 5,
        articleNameFontSizePt: 12,
        skuFontSizePt: 10,
        barcodeHeightMm: 8,
        barcodeScale: 2,
        textAlign: "left",
        showSku: true,
        showHumanReadableEan: true
      })
    ).toThrow("Layout must leave a positive printable area.");
  });
});
