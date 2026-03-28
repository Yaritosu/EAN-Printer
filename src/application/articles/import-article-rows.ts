import { Article } from "@/domain/articles/entities/article";

type ImportSourceRow = Record<string, unknown>;

type ValidArticleDraft = {
  name: string;
  sku?: string;
  ean?: string;
};

type ImportPreviewRow = ValidArticleDraft & {
  rowNumber: number;
};

type ImportError = {
  rowNumber: number;
  message: string;
};

const pickValue = (row: ImportSourceRow, aliases: string[]): string => {
  const match = Object.entries(row).find(([key]) => aliases.includes(key.trim().toLocaleLowerCase("de-DE")));
  return typeof match?.[1] === "string" ? match[1].trim() : String(match?.[1] ?? "").trim();
};

export const importArticleRows = (
  rows: ImportSourceRow[]
): { validRows: ValidArticleDraft[]; previewRows: ImportPreviewRow[]; errors: ImportError[] } => {
  const validRows: ValidArticleDraft[] = [];
  const previewRows: ImportPreviewRow[] = [];
  const errors: ImportError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 1;
    const draft = {
      name: pickValue(row, ["name", "artikelname", "article name"]),
      sku: pickValue(row, ["sku", "artikelnummer"]),
      ean: pickValue(row, ["ean", "gtin", "barcode"])
    };

    try {
      const article = Article.create({
        articleId: `import-${rowNumber}`,
        name: draft.name,
        sku: draft.sku || undefined,
        ean: draft.ean || undefined,
        status: "active",
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString()
      });

      const normalizedDraft = {
        name: article.name,
        sku: article.sku,
        ean: article.ean
      };

      validRows.push(normalizedDraft);
      previewRows.push({
        rowNumber,
        ...normalizedDraft
      });
    } catch (error) {
      errors.push({
        rowNumber,
        message: error instanceof Error ? error.message : "Import row invalid."
      });
    }
  });

  return { validRows, previewRows, errors };
};
