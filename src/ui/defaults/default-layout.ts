import { type LabelLayoutProps } from "@/domain/label/entities/label-layout";

export const defaultLayout: LabelLayoutProps = {
  widthMm: 100,
  heightMm: 37.5,
  marginTopMm: 2,
  marginRightMm: 2,
  marginBottomMm: 2,
  marginLeftMm: 2,
  articleNameFontSizePt: 12,
  skuFontSizePt: 10,
  barcodeHeightMm: 16,
  barcodeScale: 2,
  textAlign: "center",
  showSku: true,
  showHumanReadableEan: true
};
