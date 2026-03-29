import { Ean13 } from "@/domain/label/value-objects/ean13";

describe("Ean13", () => {
  it("accepts a valid 13-digit EAN string", () => {
    const ean = Ean13.create("4006381333931");

    expect(ean.value).toBe("4006381333931");
  });

  it("rejects non-digit content", () => {
    expect(() => Ean13.create("40063813339A1")).toThrow("EAN darf nur Ziffern enthalten.");
  });

  it("rejects invalid length", () => {
    expect(() => Ean13.create("123")).toThrow("EAN muss genau 13 Ziffern enthalten.");
  });

  it("rejects an invalid check digit", () => {
    expect(() => Ean13.create("4006381333932")).toThrow("Die Prüfziffer der EAN ist ungültig.");
  });
});
