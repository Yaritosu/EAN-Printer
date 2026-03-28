import { Ean13 } from "@/domain/label/value-objects/ean13";

export type ArticleStatus = "active" | "inactive";

export type ArticleProps = {
  articleId: string;
  name: string;
  sku?: string;
  ean?: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
};

export const normalizeSku = (sku: string): string => sku.trim().toLocaleLowerCase("de-DE");

export class Article {
  private constructor(
    public readonly articleId: string,
    public readonly name: string,
    public readonly sku: string | undefined,
    public readonly ean: string | undefined,
    public readonly status: ArticleStatus,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(props: ArticleProps): Article {
    const name = props.name.trim();
    if (!name) {
      throw new Error("Article name is required.");
    }

    const sku = props.sku?.trim() || undefined;
    const ean = props.ean?.trim() || undefined;

    if (ean) {
      Ean13.create(ean);
    }

    return new Article(props.articleId, name, sku, ean, props.status, props.createdAt, props.updatedAt);
  }
}
