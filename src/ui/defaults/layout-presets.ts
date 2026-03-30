import { defaultLayout } from "@/ui/defaults/default-layout";

const createPreset = (
  id: string,
  name: string,
  widthMm: number,
  heightMm: number,
  overrides: Partial<(typeof defaultLayout)> = {}
) => ({
  id,
  name,
  layout: {
    ...defaultLayout,
    widthMm,
    heightMm,
    ...overrides
  }
});

export const layoutPresets = [
  createPreset("preset-standard-100x37.5", "Standard 100 x 37.5 mm", 100, 37.5),
  createPreset("preset-a6-label", "A6 Label", 105, 148, {
    marginMm: 6,
    articleNameFontSizePt: 18,
    skuFontSizePt: 13,
    barcodeHeightMm: 42,
    orientation: "portrait"
  }),
  createPreset("preset-50x25", "50 x 25 mm", 50, 25, { barcodeHeightMm: 10 }),
  createPreset("preset-50x30", "50 x 30 mm", 50, 30, { barcodeHeightMm: 11 }),
  createPreset("preset-58x40", "58 x 40 mm", 58, 40, { barcodeHeightMm: 14 }),
  createPreset("preset-60x30", "60 x 30 mm", 60, 30, { barcodeHeightMm: 12 }),
  createPreset("preset-70x35", "70 x 35 mm", 70, 35, { barcodeHeightMm: 14 }),
  createPreset("preset-80x50", "80 x 50 mm", 80, 50, { barcodeHeightMm: 20 }),
  createPreset("preset-88x36", "88 x 36 mm", 88, 36, { barcodeHeightMm: 15 }),
  createPreset("preset-100x50", "100 x 50 mm", 100, 50, { barcodeHeightMm: 20 }),
  createPreset("preset-105x74", "105 x 74 mm", 105, 74, { barcodeHeightMm: 28 }),
  createPreset("preset-a7-label", "A7 Label", 74, 105, {
    marginMm: 5,
    articleNameFontSizePt: 16,
    skuFontSizePt: 12,
    barcodeHeightMm: 28,
    orientation: "portrait"
  })
] as const;
