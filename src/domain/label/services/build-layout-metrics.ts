import { type RenderSpec, type RenderTextBlock } from "@/domain/label/services/build-render-spec";

const lineHeightMultiplier = 1.15;
const barcodeWidthFactor = 0.65;
const humanReadableOffsetMm = 4.2;
const textGapMm = 0.6;
const locationRowGapMm = 1.1;
const previewOutlinePaddingMm = 1.1;
const previewOutlineGapMm = 0.8;
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
  previewOutlineBox: LayoutBox;
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
  const locationCodeSource = spec.textBlocks.find((block) => block.kind === "locationCode") ?? null;
  const locationArrowSource = spec.textBlocks.find((block) => block.kind === "locationArrow") ?? null;
  const hasLocationFooter = Boolean(locationCodeSource);
  const textSources = spec.textBlocks.filter(
    (block) =>
      block.kind !== "humanReadableEan" &&
      block.kind !== "locationCode" &&
      block.kind !== "locationArrow"
  );

  const locationCodeLineHeightMm = locationCodeSource ? pointsToMm(locationCodeSource.fontSizePt * lineHeightMultiplier) : 0;
  const locationFooterReserveMm = hasLocationFooter ? locationCodeLineHeightMm + locationRowGapMm : 0;
  const barcodeYOffset = humanReadableRowSource ? humanReadableOffsetMm : 0;
  const barcodeBottom = spec.heightMm - spec.marginsMm.bottom - barcodeYOffset - locationFooterReserveMm;
  const barcodeBox = {
    x: contentBox.x + (contentBox.width - contentBox.width * barcodeWidthFactor) / 2,
    y: barcodeBottom - spec.barcode.heightMm,
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

  if (locationCodeSource) {
    const locationCodeWidthMm = estimateTextWidthMm(locationCodeSource.value, locationCodeSource.fontSizePt);
    const locationArrowWidthMm = locationArrowSource
      ? estimateTextWidthMm(locationArrowSource.value, locationArrowSource.fontSizePt)
      : 0;
    const locationGapMm = locationArrowSource ? 1.4 : 0;
    const combinedWidthMm = locationCodeWidthMm + locationArrowWidthMm + locationGapMm;
    const combinedX = contentBox.x + (contentBox.width - combinedWidthMm) / 2;
    const rowY = barcodeBox.y + barcodeBox.height + locationRowGapMm;

    textRows.push({
      ...locationCodeSource,
      x: combinedX,
      y: rowY,
      estimatedWidthMm: locationCodeWidthMm,
      lineHeightMm: locationCodeLineHeightMm
    });

    if (locationArrowSource) {
      const locationArrowLineHeightMm = pointsToMm(locationArrowSource.fontSizePt * lineHeightMultiplier);
      textRows.push({
        ...locationArrowSource,
        x: combinedX + locationCodeWidthMm + locationGapMm,
        y: rowY,
        estimatedWidthMm: locationArrowWidthMm,
        lineHeightMm: locationArrowLineHeightMm
      });
    }
  }

  const humanReadableRow = humanReadableRowSource && !hasLocationFooter
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

  const lastTextBottom = textRows.reduce((maxBottom, row) => Math.max(maxBottom, row.y + row.lineHeightMm), contentBox.y);
  const outlineTop = Math.max(lastTextBottom + previewOutlineGapMm, barcodeBox.y - previewOutlinePaddingMm);
  const outlineBottomSource = humanReadableRow
    ? humanReadableRow.y + humanReadableRow.lineHeightMm
    : barcodeBox.y + barcodeBox.height;
  const outlineBottom = Math.min(contentBox.y + contentBox.height, outlineBottomSource + previewOutlinePaddingMm);

  return {
    labelBox: {
      x: 0,
      y: 0,
      width: spec.widthMm,
      height: spec.heightMm
    },
    contentBox,
    barcodeBox,
    previewOutlineBox: {
      x: contentBox.x,
      y: outlineTop,
      width: contentBox.width,
      height: Math.max(0, outlineBottom - outlineTop)
    },
    textRows,
    humanReadableRow
  };
};
