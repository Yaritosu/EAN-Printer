import { BarcodeValue } from "@/domain/label/value-objects/barcode-value";
import { Ean13 } from "@/domain/label/value-objects/ean13";

export type LabelContentProps = {
  articleName: string;
  sku?: string;
  ean: string;
};

export class LabelContent {
  private constructor(
    public readonly articleName: string,
    public readonly sku: string | undefined,
    public readonly ean: Ean13,
    public readonly barcode: BarcodeValue
  ) {}

  static create(props: LabelContentProps): LabelContent {
    const articleName = props.articleName.trim();

    if (!articleName) {
      throw new Error("Article name is required.");
    }

    const ean = Ean13.create(props.ean);

    return new LabelContent(articleName, props.sku?.trim() || undefined, ean, BarcodeValue.fromEan(ean.value));
  }
}
