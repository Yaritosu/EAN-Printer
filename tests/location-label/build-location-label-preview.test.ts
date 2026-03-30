import { buildLocationLabelPreview } from "@/application/use-cases/build-location-label-preview";
import { defaultLayout } from "@/ui/defaults/default-layout";

describe("buildLocationLabelPreview", () => {
  it("returns a CODE128 preview spec for a location label", () => {
    const preview = buildLocationLabelPreview({
      aisle: "01",
      block: "02",
      level: "01",
      bin: "04",
      arrow: "up",
      layout: defaultLayout
    });

    expect(preview.barcode.format).toBe("CODE128");
    expect(preview.barcode.value).toBe("01-02-01-04");
    expect(preview.textBlocks.some((block) => block.kind === "locationCode" && block.value === "01-02-01-04")).toBe(true);
    expect(preview.textBlocks.some((block) => block.kind === "locationArrow" && block.value === "↑")).toBe(true);
    expect(preview.textBlocks.some((block) => block.kind === "humanReadableEan")).toBe(false);
  });
});
