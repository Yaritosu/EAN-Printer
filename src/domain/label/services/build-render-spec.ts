import { LabelDocument } from "@/domain/label/entities/label-document";

export type RenderTextBlock = {
  kind: "articleName" | "sku" | "humanReadableEan" | "locationCode" | "locationArrow";
  value: string;
  fontSizePt: number;
  align: "left" | "center" | "right";
};

export type RenderSpec = {
  widthMm: number;
  heightMm: number;
  marginsMm: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  barcode: {
    format: "CODE128";
    value: string;
    heightMm: number;
    scale: number;
  };
  textBlocks: RenderTextBlock[];
};

export const buildRenderSpec = (document: LabelDocument): RenderSpec => {
  const { content, layout } = document;
  const textBlocks: RenderTextBlock[] = [
    {
      kind: "articleName",
      value: content.articleName,
      fontSizePt: layout.articleNameFontSizePt,
      align: "center"
    }
  ];

  if (content.sku) {
    textBlocks.push({
      kind: "sku",
      value: content.sku,
      fontSizePt: layout.skuFontSizePt,
      align: "center"
    });
  }

  textBlocks.push({
    kind: "humanReadableEan",
    value: content.ean.value,
    fontSizePt: layout.skuFontSizePt,
    align: "center"
  });

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
      format: content.barcode.format,
      value: content.barcode.value,
      heightMm: layout.barcodeHeightMm,
      scale: 2
    },
    textBlocks
  };
};
