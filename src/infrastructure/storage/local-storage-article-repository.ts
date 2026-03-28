import { type ArticleRepository } from "@/application/articles/article-repository";
import { Article, normalizeSku } from "@/domain/articles/entities/article";

const STORAGE_KEY = "ean-printer.articles.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

type StoredArticle = {
  articleId: string;
  name: string;
  sku?: string;
  ean?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export class LocalStorageArticleRepository implements ArticleRepository {
  constructor(private readonly storage: StorageLike) {}

  async list(): Promise<Article[]> {
    return this.readAll().sort((left, right) => left.name.localeCompare(right.name, "de-DE"));
  }

  async save(article: Article): Promise<Article> {
    const next = [...this.readAll().filter((entry) => entry.articleId !== article.articleId), article];
    this.writeAll(next);
    return article;
  }

  async delete(articleId: string): Promise<void> {
    this.writeAll(this.readAll().filter((article) => article.articleId !== articleId));
  }

  async findById(articleId: string): Promise<Article | null> {
    return this.readAll().find((article) => article.articleId === articleId) ?? null;
  }

  async findByNormalizedSku(normalizedSku: string): Promise<Article | null> {
    return this.readAll().find((article) => (article.sku ? normalizeSku(article.sku) === normalizedSku : false)) ?? null;
  }

  private readAll(): Article[] {
    const rawValue = this.storage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as StoredArticle[];
    return parsed.map((entry) =>
      Article.create({
        articleId: entry.articleId,
        name: entry.name,
        sku: entry.sku,
        ean: entry.ean,
        status: entry.status,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      })
    );
  }

  private writeAll(articles: Article[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }
}
