import { type TemplateRepository } from "@/application/templates/template-repository";

export const deleteTemplate = async (repository: TemplateRepository, id: string): Promise<void> => {
  await repository.delete(id);
};
