import { renderPdf } from "@/infrastructure/renderers/pdf/pdf-renderer";

import { buildLocationLabelPreview, type LocationLabelPreviewInput } from "./build-location-label-preview";

export const generateLocationPdf = async (input: LocationLabelPreviewInput): Promise<Uint8Array> => {
  const spec = buildLocationLabelPreview(input);
  return renderPdf(spec);
};
