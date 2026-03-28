import { LabelContent } from "@/domain/label/entities/label-content";
import { LabelDocument } from "@/domain/label/entities/label-document";
import {
  LabelLayout,
  type LabelLayoutProps
} from "@/domain/label/entities/label-layout";
import {
  buildRenderSpec,
  type RenderSpec
} from "@/domain/label/services/build-render-spec";

export type ManualLabelInput = {
  articleName: string;
  sku?: string;
  ean: string;
  layout: LabelLayoutProps;
};

export const buildPreview = (input: ManualLabelInput): RenderSpec => {
  const content = LabelContent.create({
    articleName: input.articleName,
    sku: input.sku,
    ean: input.ean
  });
  const layout = LabelLayout.create(input.layout);
  const document = LabelDocument.create({ content, layout });

  return buildRenderSpec(document);
};
