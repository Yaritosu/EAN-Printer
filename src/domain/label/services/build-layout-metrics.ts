import { type RenderSpec, type RenderTextBlock } from "@/domain/label/services/build-render-spec";

const lineHeightMultiplier = 1.15;
const barcodeWidthFactor = 0.65;
const humanReadableOffsetMm = 4.2;
const textGapMm = 0.6;
const pointsToMm = (points: number): number => (points * 25.4) / 72;

type LayoutTextRow = RenderTextBlock & {
  x: number;
  y: number;
  estimatedWidthMm: number;
  lineHeightMm: number;
};

type LayoutBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutMetrics = {
  labelBox: LayoutBox;
  contentBox: LayoutBox;
  barcodeBox: LayoutBox;
  textRows: LayoutTextRow[];
  humanReadableRow: LayoutTextRow | null;
};

const estimateTextWidthMm = (value: string, fontSizePt: number): number => {
  const averageGlyphFactor = 0.56;
  return pointsToMm(value.length * fontSizePt * averageGlyphFactor);
};

const computeAlignedX = (
  align: RenderTextBlock["align"],
  contentX: number,
  contentWidth: number,
  estimatedWidthMm: number
): number => {
  if (align === "left") {
    return contentX;
  }

  if (align === "right") {
    return contentX + contentWidth - estimatedWidthMm;
  }

  return contentX + (contentWidth - estimatedWidthMm) / 2;
};

export const buildLayoutMetrics = (spec: RenderSpec): LayoutMetrics => {
  const contentBox = {
    x: spec.marginsMm.left,
    y: spec.marginsMm.top,
    width: spec.widthMm - spec.marginsMm.left - spec.marginsMm.right,
    height: spec.heightMm - spec.marginsMm.top - spec.marginsMm.bottom
  };

  const humanReadableRowSource = spec.textBlocks.find((block) => block.kind === "humanReadableEan") ?? null;
  const textSources = spec.textBlocks.filter((block) => block.kind !== "humanReadableEan");

  const barcodeYOffset = humanReadableRowSource ? humanReadableOffsetMm : 0;
  const barcodeBox = {
    x: contentBox.x + (contentBox.width - contentBox.width * barcodeWidthFactor) / 2,
    y: spec.heightMm - spec.marginsMm.bottom - spec.barcode.heightMm - barcodeYOffset,
    width: contentBox.width * barcodeWidthFactor,
    height: spec.barcode.heightMm
  };

  let currentY = contentBox.y;
  const textRows: LayoutTextRow[] = textSources.map((block) => {
    const lineHeightMm = pointsToMm(block.fontSizePt * lineHeightMultiplier);
    const estimatedWidthMm = estimateTextWidthMm(block.value, block.fontSizePt);
    const row = {
      ...block,
      x: computeAlignedX(block.align, contentBox.x, contentBox.width, estimatedWidthMm),
      y: currentY,
      estimatedWidthMm,
      lineHeightMm
    };

    currentY += lineHeightMm + textGapMm;
    return row;
  });

  const humanReadableRow = humanReadableRowSource
    ? {
        ...humanReadableRowSource,
        x: computeAlignedX(
          humanReadableRowSource.align,
          contentBox.x,
          contentBox.width,
          estimateTextWidthMm(humanReadableRowSource.value, humanReadableRowSource.fontSizePt)
        ),
        y: barcodeBox.y + barcodeBox.height + 0.8,
        estimatedWidthMm: estimateTextWidthMm(humanReadableRowSource.value, humanReadableRowSource.fontSizePt),
        lineHeightMm: pointsToMm(humanReadableRowSource.fontSizePt * lineHeightMultiplier)
      }
    : null;

  return {
    labelBox: {
      x: 0,
      y: 0,
      width: spec.widthMm,
      height: spec.heightMm
    },
    contentBox,
    barcodeBox,
    textRows,
    humanReadableRow
  };
};
