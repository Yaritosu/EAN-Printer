export type Orientation = "landscape" | "portrait";

export type LabelLayoutProps = {
  widthMm: number;
  heightMm: number;
  marginMm: number;
  articleNameFontSizePt: number;
  skuFontSizePt: number;
  barcodeHeightMm: number;
  orientation: Orientation;
};

export class LabelLayout {
  private constructor(
    public readonly widthMm: number,
    public readonly heightMm: number,
    public readonly marginMm: number,
    public readonly articleNameFontSizePt: number,
    public readonly skuFontSizePt: number,
    public readonly barcodeHeightMm: number,
    public readonly orientation: Orientation
  ) {}

  static create(props: LabelLayoutProps): LabelLayout {
    const numericFields = [
      props.widthMm,
      props.heightMm,
      props.marginMm,
      props.articleNameFontSizePt,
      props.skuFontSizePt,
      props.barcodeHeightMm
    ];

    if (numericFields.some((value) => !Number.isFinite(value) || value < 0)) {
      throw new Error("Layoutwerte müssen endlich und nicht negativ sein.");
    }

    const layout = new LabelLayout(
      props.widthMm,
      props.heightMm,
      props.marginMm,
      props.articleNameFontSizePt,
      props.skuFontSizePt,
      props.barcodeHeightMm,
      props.orientation
    );

    if (layout.printableWidthMm <= 0 || layout.printableHeightMm <= 0) {
      throw new Error("Das Layout muss eine positive druckbare Fläche übrig lassen.");
    }

    return layout;
  }

  get resolvedWidthMm(): number {
    return this.orientation === "portrait" ? this.heightMm : this.widthMm;
  }

  get resolvedHeightMm(): number {
    return this.orientation === "portrait" ? this.widthMm : this.heightMm;
  }

  get printableWidthMm(): number {
    return this.resolvedWidthMm - this.marginMm * 2;
  }

  get printableHeightMm(): number {
    return this.resolvedHeightMm - this.marginMm * 2;
  }
}
