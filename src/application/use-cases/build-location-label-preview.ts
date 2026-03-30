import { LabelLayout, type LabelLayoutProps } from "@/domain/label/entities/label-layout";
import { type RenderSpec } from "@/domain/label/services/build-render-spec";
import { LocationLabel, type LocationArrow } from "@/domain/location-label/entities/location-label";

export type LocationLabelPreviewInput = {
  aisle: string;
  block: string;
  level: string;
  bin: string;
  arrow: LocationArrow;
  layout: LabelLayoutProps;
};

export const buildLocationLabelPreview = (input: LocationLabelPreviewInput): RenderSpec => {
  const locationLabel = LocationLabel.create(input);
  const layout = LabelLayout.create(input.layout);

  const textBlocks: RenderSpec["textBlocks"] = [];

  if (locationLabel.arrow === "up") {
    textBlocks.push({ kind: "articleName", value: "↑", fontSizePt: layout.articleNameFontSizePt + 6, align: "center" });
  }

  if (locationLabel.arrow === "down") {
    textBlocks.push({ kind: "articleName", value: "↓", fontSizePt: layout.articleNameFontSizePt + 6, align: "center" });
  }

  textBlocks.push({ kind: "humanReadableEan", value: locationLabel.locationCode, fontSizePt: layout.articleNameFontSizePt + 4, align: "center" });

  return {
    widthMm: layout.resolvedWidthMm,
    heightMm: layout.resolvedHeightMm,
    marginsMm: {
      top: layout.marginMm,
      right: layout.marginMm,
      bottom: layout.marginMm,
      left: layout.marginMm
    },
    barcode: {
      format: "CODE128",
      value: locationLabel.locationCode,
      heightMm: layout.barcodeHeightMm,
      scale: 2
    },
    textBlocks
  };
};
