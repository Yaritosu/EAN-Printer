import { importArticleRows } from "@/application/articles/import-article-rows";

describe("importArticleRows", () => {
  it("maps valid rows into article drafts and exposes preview-friendly valid rows plus errors", () => {
    const result = importArticleRows([
      { Name: "Premium Shirt", SKU: "SKU-1", EAN: "4006381333931" },
      { name: "Fehlerhaft", sku: "SKU-2", ean: "123" }
    ]);

    expect(result.validRows).toHaveLength(1);
    expect(result.validRows[0]?.name).toBe("Premium Shirt");
    expect(result.previewRows).toEqual([
      {
        rowNumber: 1,
        name: "Premium Shirt",
        sku: "SKU-1",
        ean: "4006381333931"
      }
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.rowNumber).toBe(2);
    expect(result.errors[0]?.message).toContain("EAN must be exactly 13 digits.");
  });
});
