import { type Article } from "@/domain/articles/entities/article";

export interface ArticleRepository {
  list(): Promise<Article[]>;
  save(article: Article): Promise<Article>;
  delete(articleId: string): Promise<void>;
  findById(articleId: string): Promise<Article | null>;
  findByNormalizedSku(normalizedSku: string): Promise<Article | null>;
}
