import { LabelDocument } from "@/domain/label/entities/label-document";

export type RenderTextBlock = {
  kind: "articleName" | "sku" | "humanReadableEan";
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
      align: layout.textAlign
    }
  ];

  if (layout.showSku && content.sku) {
    textBlocks.push({
      kind: "sku",
      value: content.sku,
      fontSizePt: layout.skuFontSizePt,
      align: layout.textAlign
    });
  }

  if (layout.showHumanReadableEan) {
    textBlocks.push({
      kind: "humanReadableEan",
      value: content.ean.value,
      fontSizePt: layout.skuFontSizePt,
      align: layout.textAlign
    });
  }

  return {
    widthMm: layout.widthMm,
    heightMm: layout.heightMm,
    marginsMm: {
      top: layout.marginTopMm,
      right: layout.marginRightMm,
      bottom: layout.marginBottomMm,
      left: layout.marginLeftMm
    },
    barcode: {
      format: content.barcode.format,
      value: content.barcode.value,
      heightMm: layout.barcodeHeightMm,
      scale: layout.barcodeScale
    },
    textBlocks
  };
};
