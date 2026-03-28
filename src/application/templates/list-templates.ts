import { type TemplateRepository } from "@/application/templates/template-repository";

export const listTemplates = async (repository: TemplateRepository) => repository.list();
