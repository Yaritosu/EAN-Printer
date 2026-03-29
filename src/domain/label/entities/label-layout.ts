export type TextAlign = "left" | "center" | "right";

export type LabelLayoutProps = {
  widthMm: number;
  heightMm: number;
  marginTopMm: number;
  marginRightMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  articleNameFontSizePt: number;
  skuFontSizePt: number;
  barcodeHeightMm: number;
  barcodeScale: number;
  textAlign: TextAlign;
  showSku: boolean;
  showHumanReadableEan: boolean;
};

export class LabelLayout {
  private constructor(
    public readonly widthMm: number,
    public readonly heightMm: number,
    public readonly marginTopMm: number,
    public readonly marginRightMm: number,
    public readonly marginBottomMm: number,
    public readonly marginLeftMm: number,
    public readonly articleNameFontSizePt: number,
    public readonly skuFontSizePt: number,
    public readonly barcodeHeightMm: number,
    public readonly barcodeScale: number,
    public readonly textAlign: TextAlign,
    public readonly showSku: boolean,
    public readonly showHumanReadableEan: boolean
  ) {}

  static create(props: LabelLayoutProps): LabelLayout {
    const numericFields = [
      props.widthMm,
      props.heightMm,
      props.marginTopMm,
      props.marginRightMm,
      props.marginBottomMm,
      props.marginLeftMm,
      props.articleNameFontSizePt,
      props.skuFontSizePt,
      props.barcodeHeightMm,
      props.barcodeScale
    ];

    if (numericFields.some((value) => !Number.isFinite(value) || value < 0)) {
      throw new Error("Layoutwerte müssen endlich und nicht negativ sein.");
    }

    const layout = new LabelLayout(
      props.widthMm,
      props.heightMm,
      props.marginTopMm,
      props.marginRightMm,
      props.marginBottomMm,
      props.marginLeftMm,
      props.articleNameFontSizePt,
      props.skuFontSizePt,
      props.barcodeHeightMm,
      props.barcodeScale,
      props.textAlign,
      props.showSku,
      props.showHumanReadableEan
    );

    if (layout.printableWidthMm <= 0 || layout.printableHeightMm <= 0) {
      throw new Error("Das Layout muss eine positive druckbare Fläche übrig lassen.");
    }

    return layout;
  }

  get printableWidthMm(): number {
    return this.widthMm - this.marginLeftMm - this.marginRightMm;
  }

  get printableHeightMm(): number {
    return this.heightMm - this.marginTopMm - this.marginBottomMm;
  }
}

