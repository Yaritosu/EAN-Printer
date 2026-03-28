import { type ArticleRepository } from "@/application/articles/article-repository";
import { Article, normalizeSku } from "@/domain/articles/entities/article";

type SaveArticleInput = {
  articleId?: string;
  name: string;
  sku?: string;
  ean?: string;
  status?: "active" | "inactive";
};

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `art-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const saveArticle = async (
  repository: ArticleRepository,
  input: SaveArticleInput
): Promise<Article> => {
  const sku = input.sku?.trim();
  if (sku) {
    const existingWithSku = await repository.findByNormalizedSku(normalizeSku(sku));
    if (existingWithSku && existingWithSku.articleId !== input.articleId) {
      throw new Error("SKU already exists.");
    }
  }

  const existingById = input.articleId ? await repository.findById(input.articleId) : null;
  const now = new Date().toISOString();
  const article = Article.create({
    articleId: existingById?.articleId ?? input.articleId ?? createId(),
    name: input.name,
    sku,
    ean: input.ean,
    status: input.status ?? existingById?.status ?? "active",
    createdAt: existingById?.createdAt ?? now,
    updatedAt: now
  });

  return repository.save(article);
};
