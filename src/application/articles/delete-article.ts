import { type ArticleRepository } from "@/application/articles/article-repository";

export const deleteArticle = async (repository: ArticleRepository, articleId: string): Promise<void> => {
  await repository.delete(articleId);
};
