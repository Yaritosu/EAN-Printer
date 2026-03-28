import { type ArticleRepository } from "@/application/articles/article-repository";

export const listArticles = async (repository: ArticleRepository) => repository.list();
