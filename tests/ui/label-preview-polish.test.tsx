import { render, screen } from "@testing-library/react";

import { LabelContent } from "@/domain/label/entities/label-content";
import { LabelDocument } from "@/domain/label/entities/label-document";
import { LabelLayout } from "@/domain/label/entities/label-layout";
import { buildRenderSpec } from "@/domain/label/services/build-render-spec";
import { LabelPreview } from "@/ui/components/label-preview";

const spec = buildRenderSpec(
  LabelDocument.create({
    content: LabelContent.create({
      articleName: "5-Punkt-Gurt",
      sku: "BW-FPG-0",
      ean: "4260706041349"
    }),
    layout: LabelLayout.create({
      widthMm: 100,
      heightMm: 37.5,
      marginMm: 2,
      articleNameFontSizePt: 12,
      skuFontSizePt: 10,
      barcodeHeightMm: 16,
      orientation: "landscape"
    })
  })
);

describe("LabelPreview polish", () => {
  it("renders the stage centered without gray fill, without outline and with a square preview label", () => {
    render(<LabelPreview spec={spec} />);

    const stage = screen.getByTestId("preview-stage");
    const label = screen.getByTestId("preview-label");

    expect(stage.className).toContain("justify-center");
    expect(stage.className).not.toContain("bg-slate-100");
    expect(label.className).not.toContain("rounded");
    expect(screen.queryByTestId("preview-outline")).not.toBeInTheDocument();
  });
});
