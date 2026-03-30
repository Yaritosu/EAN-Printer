import { type LabelLayoutProps } from "@/domain/label/entities/label-layout";
import { LabelTemplate, normalizeTemplateName } from "@/domain/templates/entities/label-template";
import { type TemplateRepository } from "@/application/templates/template-repository";

type SaveTemplateInput = {
  id?: string;
  name: string;
  layout: LabelLayoutProps;
};

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `tpl-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const saveTemplate = async (
  repository: TemplateRepository,
  input: SaveTemplateInput
): Promise<LabelTemplate> => {
  const existingWithName = await repository.findByNormalizedName(normalizeTemplateName(input.name));
  if (existingWithName && existingWithName.id !== input.id) {
    throw new Error("Ein Layout mit diesem Namen existiert bereits.");
  }

  const existingById = input.id ? await repository.findById(input.id) : null;
  const createdAt = existingById?.createdAt ?? new Date().toISOString();
  const template = LabelTemplate.create({
    id: existingById?.id ?? input.id ?? createId(),
    name: input.name,
    layout: input.layout,
    createdAt,
    updatedAt: new Date().toISOString()
  });

  return repository.save(template);
};
