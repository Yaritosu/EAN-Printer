import { LabelTemplate } from "@/domain/templates/entities/label-template";

export interface TemplateRepository {
  list(): Promise<LabelTemplate[]>;
  save(template: LabelTemplate): Promise<LabelTemplate>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<LabelTemplate | null>;
  findByNormalizedName(normalizedName: string): Promise<LabelTemplate | null>;
}
