import { buildPreview, type ManualLabelInput } from "@/application/use-cases/build-preview";
import { renderPdf } from "@/infrastructure/renderers/pdf/pdf-renderer";

export const generatePdf = async (input: ManualLabelInput): Promise<Uint8Array> => {
  const spec = buildPreview(input);
  return renderPdf(spec);
};
