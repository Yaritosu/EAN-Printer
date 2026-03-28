import { type Article } from "@/domain/articles/entities/article";

const normalize = (value: string): string => value.trim().toLocaleLowerCase("de-DE");

export const filterArticles = (articles: Article[], query: string): Article[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return articles;
  }

  return articles.filter((article) => {
    const candidates = [article.name, article.sku ?? "", article.ean ?? ""].map(normalize);
    return candidates.some((candidate) => candidate.includes(normalizedQuery));
  });
};
