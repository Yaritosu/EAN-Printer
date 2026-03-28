import { filterArticles } from "@/application/articles/filter-articles";
import { Article } from "@/domain/articles/entities/article";

const articles = [
  Article.create({
    articleId: "a1",
    name: "Premium Shirt",
    sku: "SKU-100",
    ean: "4006381333931",
    status: "active",
    createdAt: "2026-03-28T00:00:00.000Z",
    updatedAt: "2026-03-28T00:00:00.000Z"
  }),
  Article.create({
    articleId: "a2",
    name: "Basic Hoodie",
    sku: "HD-200",
    ean: "5901234123457",
    status: "active",
    createdAt: "2026-03-28T00:00:00.000Z",
    updatedAt: "2026-03-28T00:00:00.000Z"
  })
];

describe("filterArticles", () => {
  it("returns all articles for an empty query", () => {
    expect(filterArticles(articles, "")).toHaveLength(2);
  });

  it("finds articles by partial name, sku, or ean", () => {
    expect(filterArticles(articles, "shirt").map((article) => article.articleId)).toEqual(["a1"]);
    expect(filterArticles(articles, "hd-2").map((article) => article.articleId)).toEqual(["a2"]);
    expect(filterArticles(articles, "590123").map((article) => article.articleId)).toEqual(["a2"]);
  });
});
