import { type LabelLayoutProps } from "@/domain/label/entities/label-layout";

export const normalizeTemplateName = (name: string): string => name.trim().toLocaleLowerCase("de-DE");

export type LabelTemplateProps = {
  id: string;
  name: string;
  layout: LabelLayoutProps;
  createdAt: string;
  updatedAt: string;
};

export class LabelTemplate {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly layout: LabelLayoutProps,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(props: LabelTemplateProps): LabelTemplate {
    const trimmedName = props.name.trim();

    if (!trimmedName) {
      throw new Error("Template name is required.");
    }

    return new LabelTemplate(props.id, trimmedName, props.layout, props.createdAt, props.updatedAt);
  }
}
