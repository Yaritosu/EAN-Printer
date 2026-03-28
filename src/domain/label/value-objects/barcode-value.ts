import { Ean13 } from "@/domain/label/value-objects/ean13";

export type BarcodeFormat = "CODE128";

export class BarcodeValue {
  private constructor(
    public readonly format: BarcodeFormat,
    public readonly value: string
  ) {}

  static fromEan(ean: string): BarcodeValue {
    const parsedEan = Ean13.create(ean);

    return new BarcodeValue("CODE128", parsedEan.value);
  }
}
