import { LabelContent } from "@/domain/label/entities/label-content";
import { LabelLayout } from "@/domain/label/entities/label-layout";

export type LabelDocumentProps = {
  content: LabelContent;
  layout: LabelLayout;
};

export class LabelDocument {
  private constructor(
    public readonly content: LabelContent,
    public readonly layout: LabelLayout
  ) {}

  static create(props: LabelDocumentProps): LabelDocument {
    return new LabelDocument(props.content, props.layout);
  }
}
