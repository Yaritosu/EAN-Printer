import { deleteArticle } from "@/application/articles/delete-article";
import { listArticles } from "@/application/articles/list-articles";
import { saveArticle } from "@/application/articles/save-article";
import { LocalStorageArticleRepository } from "@/infrastructure/storage/local-storage-article-repository";

describe("LocalStorageArticleRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and lists articles", async () => {
    const repository = new LocalStorageArticleRepository(localStorage);

    await saveArticle(repository, {
      name: "Premium Shirt",
      sku: "SKU-1",
      ean: "4006381333931"
    });

    const articles = await listArticles(repository);
    expect(articles).toHaveLength(1);
    expect(articles[0]?.name).toBe("Premium Shirt");
  });

  it("rejects duplicate sku values case-insensitively", async () => {
    const repository = new LocalStorageArticleRepository(localStorage);

    await saveArticle(repository, {
      name: "Artikel 1",
      sku: "SKU-1",
      ean: "4006381333931"
    });

    await expect(
      saveArticle(repository, {
        name: "Artikel 2",
        sku: "sku-1",
        ean: "5901234123457"
      })
    ).rejects.toThrow("SKU already exists.");
  });

  it("updates an existing article", async () => {
    const repository = new LocalStorageArticleRepository(localStorage);
    const created = await saveArticle(repository, {
      name: "Artikel 1",
      sku: "SKU-1",
      ean: "4006381333931"
    });

    const updated = await saveArticle(repository, {
      articleId: created.articleId,
      name: "Artikel 1 neu",
      sku: "SKU-1",
      ean: "4006381333931"
    });

    expect(updated.name).toBe("Artikel 1 neu");
  });

  it("deletes an article", async () => {
    const repository = new LocalStorageArticleRepository(localStorage);
    const created = await saveArticle(repository, {
      name: "Artikel 1",
      sku: "SKU-1",
      ean: "4006381333931"
    });

    await deleteArticle(repository, created.articleId);
    const articles = await listArticles(repository);
    expect(articles).toHaveLength(0);
  });
});
