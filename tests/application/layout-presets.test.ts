import { layoutPresets } from "@/ui/defaults/layout-presets";

describe("layoutPresets", () => {
  it("contains the built-in presets plus ten common standard formats", () => {
    expect(layoutPresets.map((preset) => preset.name)).toEqual([
      "Standard 100 x 37.5 mm",
      "A6 Label",
      "50 x 25 mm",
      "50 x 30 mm",
      "58 x 40 mm",
      "60 x 30 mm",
      "70 x 35 mm",
      "80 x 50 mm",
      "88 x 36 mm",
      "100 x 50 mm",
      "105 x 74 mm",
      "A7 Label"
    ]);
    expect(layoutPresets[1]?.layout.widthMm).toBe(105);
    expect(layoutPresets[1]?.layout.heightMm).toBe(148);
    expect(layoutPresets).toHaveLength(12);
  });
});
