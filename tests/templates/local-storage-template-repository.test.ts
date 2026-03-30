import { deleteTemplate } from "@/application/templates/delete-template";
import { listTemplates } from "@/application/templates/list-templates";
import { saveTemplate } from "@/application/templates/save-template";
import { LocalStorageTemplateRepository } from "@/infrastructure/storage/local-storage-template-repository";
import { defaultLayout } from "@/ui/defaults/default-layout";

describe("LocalStorageTemplateRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and lists templates", async () => {
    const repository = new LocalStorageTemplateRepository(localStorage);

    await saveTemplate(repository, {
      name: "A6 Regal",
      layout: defaultLayout
    });

    const templates = await listTemplates(repository);

    expect(templates).toHaveLength(1);
    expect(templates[0]?.name).toBe("A6 Regal");
  });

  it("rejects duplicate names case-insensitively", async () => {
    const repository = new LocalStorageTemplateRepository(localStorage);

    await saveTemplate(repository, {
      name: "Promo Klein",
      layout: defaultLayout
    });

    await expect(
      saveTemplate(repository, {
        name: "promo klein",
        layout: defaultLayout
      })
    ).rejects.toThrow("Ein Layout mit diesem Namen existiert bereits.");
  });

  it("updates an existing template", async () => {
    const repository = new LocalStorageTemplateRepository(localStorage);
    const created = await saveTemplate(repository, {
      name: "Standard",
      layout: defaultLayout
    });

    const updated = await saveTemplate(repository, {
      id: created.id,
      name: "Standard",
      layout: {
        ...defaultLayout,
        widthMm: 58
      }
    });

    expect(updated.layout.widthMm).toBe(58);
    const templates = await listTemplates(repository);
    expect(templates[0]?.layout.widthMm).toBe(58);
  });

  it("deletes a template by id", async () => {
    const repository = new LocalStorageTemplateRepository(localStorage);
    const created = await saveTemplate(repository, {
      name: "Loeschen",
      layout: defaultLayout
    });

    await deleteTemplate(repository, created.id);

    const templates = await listTemplates(repository);
    expect(templates).toHaveLength(0);
  });
});
