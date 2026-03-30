import { type TemplateRepository } from "@/application/templates/template-repository";
import { type LabelLayoutProps } from "@/domain/label/entities/label-layout";
import { LabelTemplate, normalizeTemplateName } from "@/domain/templates/entities/label-template";

const STORAGE_KEY = "ean-printer.templates.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

type StoredLabelTemplate = {
  id: string;
  name: string;
  layout: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

const normalizeLayout = (layout: Record<string, unknown>): LabelLayoutProps => ({
  widthMm: Number(layout.widthMm ?? 100),
  heightMm: Number(layout.heightMm ?? 37.5),
  marginMm: Number(layout.marginMm ?? layout.marginTopMm ?? layout.marginRightMm ?? layout.marginBottomMm ?? layout.marginLeftMm ?? 2),
  articleNameFontSizePt: Number(layout.articleNameFontSizePt ?? 12),
  skuFontSizePt: Number(layout.skuFontSizePt ?? 10),
  barcodeHeightMm: Number(layout.barcodeHeightMm ?? 16),
  orientation: layout.orientation === "portrait" ? "portrait" : "landscape"
});

export class LocalStorageTemplateRepository implements TemplateRepository {
  constructor(private readonly storage: StorageLike) {}

  async list(): Promise<LabelTemplate[]> {
    return this.readAll().sort((left, right) => left.name.localeCompare(right.name, "de-DE"));
  }

  async save(template: LabelTemplate): Promise<LabelTemplate> {
    const templates = this.readAll();
    const nextTemplates = [...templates.filter((entry) => entry.id !== template.id), template];
    this.writeAll(nextTemplates);
    return template;
  }

  async delete(id: string): Promise<void> {
    const templates = this.readAll().filter((template) => template.id !== id);
    this.writeAll(templates);
  }

  async findById(id: string): Promise<LabelTemplate | null> {
    return this.readAll().find((template) => template.id === id) ?? null;
  }

  async findByNormalizedName(normalizedName: string): Promise<LabelTemplate | null> {
    return this.readAll().find((template) => normalizeTemplateName(template.name) === normalizedName) ?? null;
  }

  private readAll(): LabelTemplate[] {
    const rawValue = this.storage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as StoredLabelTemplate[];
    return parsed.map((entry) =>
      LabelTemplate.create({
        id: entry.id,
        name: entry.name,
        layout: normalizeLayout(entry.layout),
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      })
    );
  }

  private writeAll(templates: LabelTemplate[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }
}
