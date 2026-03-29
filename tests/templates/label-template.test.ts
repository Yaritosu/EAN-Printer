import { LabelTemplate, normalizeTemplateName } from "@/domain/templates/entities/label-template";
import { defaultLayout } from "@/ui/defaults/default-layout";

describe("LabelTemplate", () => {
  it("creates a template with trimmed name and layout only", () => {
    const template = LabelTemplate.create({
      id: "tpl-1",
      name: "  100x37.5 Standard  ",
      layout: defaultLayout,
      createdAt: "2026-03-28T00:00:00.000Z",
      updatedAt: "2026-03-28T00:00:00.000Z"
    });

    expect(template.name).toBe("100x37.5 Standard");
    expect(template.layout.widthMm).toBe(100);
    expect("articleName" in template.layout).toBe(false);
  });

  it("rejects an empty template name", () => {
    expect(() =>
      LabelTemplate.create({
        id: "tpl-2",
        name: "   ",
        layout: defaultLayout,
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      })
    ).toThrow("Ein Template-Name ist erforderlich.");
  });

  it("normalizes names case-insensitively", () => {
    expect(normalizeTemplateName("  Promo Klein ")).toBe("promo klein");
  });
});
