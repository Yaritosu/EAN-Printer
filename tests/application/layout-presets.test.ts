import { layoutPresets } from "@/ui/defaults/layout-presets";

describe("layoutPresets", () => {
  it("contains the built-in standard and A6 presets", () => {
    expect(layoutPresets.map((preset) => preset.name)).toEqual([
      "Standard 100 x 37.5 mm",
      "A6 Label"
    ]);
    expect(layoutPresets[1]?.layout.widthMm).toBe(105);
    expect(layoutPresets[1]?.layout.heightMm).toBe(148);
  });
});
