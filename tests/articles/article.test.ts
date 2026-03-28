import { Article } from "@/domain/articles/entities/article";

describe("Article", () => {
  it("creates an article with trimmed name and optional sku", () => {
    const article = Article.create({
      articleId: "art-1",
      name: "  Premium Shirt  ",
      sku: " SKU-1 ",
      ean: "4006381333931",
      status: "active",
      createdAt: "2026-03-28T00:00:00.000Z",
      updatedAt: "2026-03-28T00:00:00.000Z"
    });

    expect(article.name).toBe("Premium Shirt");
    expect(article.sku).toBe("SKU-1");
    expect(article.ean).toBe("4006381333931");
  });

  it("rejects empty article names", () => {
    expect(() =>
      Article.create({
        articleId: "art-2",
        name: "   ",
        status: "active",
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      })
    ).toThrow("Article name is required.");
  });

  it("rejects invalid optional EAN values", () => {
    expect(() =>
      Article.create({
        articleId: "art-3",
        name: "Artikel",
        ean: "123",
        status: "active",
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      })
    ).toThrow("EAN must be exactly 13 digits.");
  });
});
