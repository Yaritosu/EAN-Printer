import { defaultLayout } from "@/ui/defaults/default-layout";

export const layoutPresets = [
  {
    id: "preset-standard-100x37.5",
    name: "Standard 100 x 37.5 mm",
    layout: defaultLayout
  },
  {
    id: "preset-a6-label",
    name: "A6 Label",
    layout: {
      ...defaultLayout,
      widthMm: 105,
      heightMm: 148,
      marginTopMm: 6,
      marginRightMm: 6,
      marginBottomMm: 6,
      marginLeftMm: 6,
      articleNameFontSizePt: 18,
      skuFontSizePt: 13,
      barcodeHeightMm: 42,
      barcodeScale: 3
    }
  }
] as const;
