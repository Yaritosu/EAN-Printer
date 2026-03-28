export class Ean13 {
  private constructor(public readonly value: string) {}

  static create(value: string): Ean13 {
    if (!/^\d+$/.test(value)) {
      throw new Error("EAN must contain digits only.");
    }

    if (value.length !== 13) {
      throw new Error("EAN must be exactly 13 digits.");
    }

    if (!Ean13.hasValidCheckDigit(value)) {
      throw new Error("EAN check digit is invalid.");
    }

    return new Ean13(value);
  }

  private static hasValidCheckDigit(value: string): boolean {
    const digits = value.split("").map((digit) => Number(digit));
    const expectedCheckDigit = digits.at(-1);

    if (expectedCheckDigit === undefined) {
      return false;
    }

    const sum = digits
      .slice(0, 12)
      .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 1 : 3), 0);
    const calculatedCheckDigit = (10 - (sum % 10)) % 10;

    return calculatedCheckDigit === expectedCheckDigit;
  }
}
