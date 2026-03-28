"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { deleteArticle } from "@/application/articles/delete-article";
import { filterArticles } from "@/application/articles/filter-articles";
import { importArticleRows } from "@/application/articles/import-article-rows";
import { listArticles } from "@/application/articles/list-articles";
import { saveArticle } from "@/application/articles/save-article";
import { deleteTemplate } from "@/application/templates/delete-template";
import { listTemplates } from "@/application/templates/list-templates";
import { saveTemplate } from "@/application/templates/save-template";
import { buildPreview } from "@/application/use-cases/build-preview";
import { type Article } from "@/domain/articles/entities/article";
import { type LabelLayoutProps } from "@/domain/label/entities/label-layout";
import { type LabelTemplate } from "@/domain/templates/entities/label-template";
import { LocalStorageArticleRepository } from "@/infrastructure/storage/local-storage-article-repository";
import { LocalStorageTemplateRepository } from "@/infrastructure/storage/local-storage-template-repository";
import { ArticleManager } from "@/ui/components/article-manager";
import { LabelPreview } from "@/ui/components/label-preview";
import { TemplateManager } from "@/ui/components/template-manager";
import { ValidationSummary } from "@/ui/components/validation-summary";
import { defaultLayout } from "@/ui/defaults/default-layout";
import { layoutPresets } from "@/ui/defaults/layout-presets";

const labelSchema = z.object({
  articleName: z.string().trim().min(1, "Artikelname ist erforderlich."),
  sku: z.string().optional(),
  ean: z.string().regex(/^\d{13}$/, "EAN muss genau 13 Ziffern enthalten."),
  layout: z.object({
    widthMm: z.number().positive("Breite muss positiv sein."),
    heightMm: z.number().positive("Hoehe muss positiv sein."),
    marginTopMm: z.number().min(0),
    marginRightMm: z.number().min(0),
    marginBottomMm: z.number().min(0),
    marginLeftMm: z.number().min(0),
    articleNameFontSizePt: z.number().positive(),
    skuFontSizePt: z.number().positive(),
    barcodeHeightMm: z.number().positive(),
    barcodeScale: z.number().positive(),
    textAlign: z.enum(["left", "center", "right"]),
    showSku: z.boolean(),
    showHumanReadableEan: z.boolean()
  })
});

type LabelFormValues = z.infer<typeof labelSchema>;
type EditorTab = "create" | "articles" | "layout";

type LayoutOption = {
  id: string;
  name: string;
  layout: LabelLayoutProps;
  source: "preset" | "template";
};

type ImportBuffer = {
  sourceName: string;
  validRows: Array<{
    name: string;
    sku?: string;
    ean?: string;
  }>;
  previewRows: Array<{
    rowNumber: number;
    name: string;
    sku?: string;
    ean?: string;
  }>;
  errorMessages: string[];
};

const numericFieldNames: Array<keyof LabelFormValues["layout"]> = [
  "widthMm",
  "heightMm",
  "marginTopMm",
  "marginRightMm",
  "marginBottomMm",
  "marginLeftMm",
  "articleNameFontSizePt",
  "skuFontSizePt",
  "barcodeHeightMm",
  "barcodeScale"
];

export const LabelEditor = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>("create");
  const [pdfMessage, setPdfMessage] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");
  const [articleMessage, setArticleMessage] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [activeLayoutId, setActiveLayoutId] = useState<string>(layoutPresets[0].id);
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [articleSearch, setArticleSearch] = useState("");
  const [editingArticleId, setEditingArticleId] = useState("");
  const [isArticleSearchOpen, setIsArticleSearchOpen] = useState(false);
  const [articleDraft, setArticleDraft] = useState({ name: "", sku: "", ean: "" });
  const [importBuffer, setImportBuffer] = useState<ImportBuffer | null>(null);

  const templateRepository = useMemo(
    () => (typeof window === "undefined" ? null : new LocalStorageTemplateRepository(window.localStorage)),
    []
  );
  const articleRepository = useMemo(
    () => (typeof window === "undefined" ? null : new LocalStorageArticleRepository(window.localStorage)),
    []
  );

  const {
    register,
    watch,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<LabelFormValues>({
    resolver: zodResolver(labelSchema),
    mode: "onChange",
    defaultValues: {
      articleName: "Premium Baumwoll-Shirt",
      sku: "SKU-1234",
      ean: "4006381333931",
      layout: defaultLayout
    }
  });

  const refreshTemplates = async () => {
    if (!templateRepository) return;
    setTemplates(await listTemplates(templateRepository));
  };

  const refreshArticles = async () => {
    if (!articleRepository) return;
    setArticles(await listArticles(articleRepository));
  };

  useEffect(() => {
    void refreshTemplates();
    void refreshArticles();
  }, [templateRepository, articleRepository]);

  const layoutOptions = useMemo<LayoutOption[]>(() => {
    return [
      ...layoutPresets.map((preset) => ({ id: preset.id, name: preset.name, layout: preset.layout, source: "preset" as const })),
      ...templates.map((template) => ({ id: template.id, name: template.name, layout: template.layout, source: "template" as const }))
    ];
  }, [templates]);

  const filteredArticles = useMemo(() => filterArticles(articles, articleSearch).slice(0, 8), [articles, articleSearch]);
  const articleSearchHasQuery = articleSearch.trim().length > 0;
  const showArticleSearchResults = isArticleSearchOpen && articleSearchHasQuery;
  const selectedArticle = useMemo(
    () => articles.find((article) => article.articleId === selectedArticleId) ?? null,
    [articles, selectedArticleId]
  );

  const values = watch();
  const domainIssues = useMemo(() => {
    try {
      buildPreview(values);
      return [];
    } catch (error) {
      return [error instanceof Error ? error.message : "Unbekannter Validierungsfehler."];
    }
  }, [values]);

  const fieldIssues = useMemo(() => {
    const collected = Object.values(errors).flatMap((issue) => {
      if (!issue) return [];
      if ("message" in issue && issue.message) return [String(issue.message)];
      if ("root" in issue && issue.root?.message) return [String(issue.root.message)];
      return Object.values(issue)
        .filter((nested): nested is { message?: unknown } => typeof nested === "object" && nested !== null)
        .flatMap((nested) => (nested.message ? [String(nested.message)] : []));
    });
    return [...new Set(collected)];
  }, [errors]);

  const allIssues = [...fieldIssues, ...domainIssues];
  const preview = useMemo(() => {
    try {
      return buildPreview(values);
    } catch {
      return null;
    }
  }, [values]);

  const applyLayout = (layout: LabelLayoutProps) => {
    const entries = Object.entries(layout) as Array<[keyof LabelLayoutProps, LabelLayoutProps[keyof LabelLayoutProps]]>;
    for (const [key, value] of entries) {
      setValue(`layout.${key}` as const, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    }
  };

  const handleLayoutSelection = (layoutId: string) => {
    setActiveLayoutId(layoutId);
    const selectedOption = layoutOptions.find((option) => option.id === layoutId);
    if (!selectedOption) return;
    applyLayout(selectedOption.layout);
  };

  const handleArticleSelectionForLabel = (article: Article) => {
    setSelectedArticleId(article.articleId);
    setArticleSearch(article.sku ? `${article.name} (${article.sku})` : article.name);
    setIsArticleSearchOpen(false);
    setValue("articleName", article.name, { shouldValidate: true, shouldDirty: true });
    setValue("sku", article.sku ?? "", { shouldValidate: true, shouldDirty: true });
    setValue("ean", article.ean ?? "", { shouldValidate: true, shouldDirty: true });
  };

  const handleArticleResultMouseDown = (event: React.MouseEvent<HTMLButtonElement>, article: Article) => {
    event.preventDefault();
    handleArticleSelectionForLabel(article);
  };

  const handleSelectedArticleClear = () => {
    setSelectedArticleId("");
    setArticleSearch("");
    setIsArticleSearchOpen(false);
  };

  const handlePdf = async () => {
    setPdfMessage("");
    const response = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setPdfMessage(payload?.error ?? "PDF konnte nicht erzeugt werden.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setPdfMessage("PDF wurde in einem neuen Fenster geoeffnet. Auf Windows jetzt ueber den Druckdialog drucken.");
  };

  const handleTemplateSave = async () => {
    if (!templateRepository) return;
    try {
      const created = await saveTemplate(templateRepository, { name: templateName, layout: getValues("layout") });
      await refreshTemplates();
      setSelectedTemplateId(created.id);
      setActiveLayoutId(created.id);
      setTemplateName(created.name);
      setTemplateMessage(`Template \"${created.name}\" wurde gespeichert und ist jetzt aktiv.`);
    } catch (error) {
      setTemplateMessage(error instanceof Error ? error.message : "Template konnte nicht gespeichert werden.");
    }
  };

  const handleTemplateUpdate = async () => {
    if (!templateRepository || !selectedTemplateId) return;
    try {
      const updated = await saveTemplate(templateRepository, {
        id: selectedTemplateId,
        name: templateName,
        layout: getValues("layout")
      });
      await refreshTemplates();
      setTemplateName(updated.name);
      setActiveLayoutId(updated.id);
      setTemplateMessage(`Template \"${updated.name}\" wurde aktualisiert.`);
    } catch (error) {
      setTemplateMessage(error instanceof Error ? error.message : "Template konnte nicht aktualisiert werden.");
    }
  };

  const handleTemplateLoad = () => {
    const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
    if (!selectedTemplate) {
      setTemplateMessage("Bitte zuerst ein Template auswaehlen.");
      return;
    }
    applyLayout(selectedTemplate.layout);
    setActiveLayoutId(selectedTemplate.id);
    setTemplateName(selectedTemplate.name);
    setTemplateMessage(`Template \"${selectedTemplate.name}\" wurde in den Layout-Konfigurator geladen und ist aktiv.`);
  };

  const handleTemplateDelete = async () => {
    if (!templateRepository || !selectedTemplateId) return;
    const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
    if (!selectedTemplate) return;
    await deleteTemplate(templateRepository, selectedTemplate.id);
    await refreshTemplates();
    setSelectedTemplateId("");
    setTemplateName("");
    if (activeLayoutId === selectedTemplate.id) {
      setActiveLayoutId(layoutPresets[0].id);
      applyLayout(layoutPresets[0].layout);
    }
    setTemplateMessage(`Template \"${selectedTemplate.name}\" wurde geloescht.`);
  };

  const handleTemplateReset = () => {
    applyLayout(defaultLayout);
    setActiveLayoutId(layoutPresets[0].id);
    setSelectedTemplateId("");
    setTemplateName("");
    setTemplateMessage("Standardlayout wurde geladen.");
  };

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
    const selectedTemplate = templates.find((template) => template.id === id);
    setTemplateName(selectedTemplate?.name ?? "");
    setTemplateMessage("");
  };

  const handleDraftChange = (field: "name" | "sku" | "ean", value: string) => {
    setArticleDraft((current) => ({ ...current, [field]: value }));
  };

  const handleArticleSelectForEdit = (articleId: string) => {
    setEditingArticleId(articleId);
    const selectedArticleForEdit = articles.find((article) => article.articleId === articleId);
    if (!selectedArticleForEdit) {
      setArticleDraft({ name: "", sku: "", ean: "" });
      return;
    }
    setArticleDraft({
      name: selectedArticleForEdit.name,
      sku: selectedArticleForEdit.sku ?? "",
      ean: selectedArticleForEdit.ean ?? ""
    });
    setArticleMessage("");
  };

  const handleArticleSave = async () => {
    if (!articleRepository) return;
    try {
      const saved = await saveArticle(articleRepository, {
        articleId: editingArticleId || undefined,
        name: articleDraft.name,
        sku: articleDraft.sku || undefined,
        ean: articleDraft.ean || undefined
      });
      await refreshArticles();
      setEditingArticleId("");
      setArticleDraft({ name: "", sku: "", ean: "" });
      setArticleMessage(`Artikel \"${saved.name}\" wurde gespeichert. Formular ist bereit fuer den naechsten Artikel.`);
    } catch (error) {
      setArticleMessage(error instanceof Error ? error.message : "Artikel konnte nicht gespeichert werden.");
    }
  };

  const handleArticleDelete = async () => {
    if (!articleRepository || !editingArticleId) return;
    const selectedArticleForEdit = articles.find((article) => article.articleId === editingArticleId);
    await deleteArticle(articleRepository, editingArticleId);
    await refreshArticles();
    if (selectedArticleForEdit && selectedArticleForEdit.articleId === selectedArticleId) {
      setSelectedArticleId("");
      setArticleSearch("");
    }
    setEditingArticleId("");
    setArticleDraft({ name: "", sku: "", ean: "" });
    setArticleMessage(selectedArticleForEdit ? `Artikel \"${selectedArticleForEdit.name}\" wurde geloescht.` : "Artikel wurde geloescht.");
  };

  const handleArticleReset = () => {
    setEditingArticleId("");
    setArticleDraft({ name: "", sku: "", ean: "" });
    setArticleMessage("");
  };

  const handleImportFile = async (file: File) => {
    try {
      const xlsx = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = xlsx.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const result = importArticleRows(rows);
      setImportBuffer({
        sourceName: file.name,
        validRows: result.validRows,
        previewRows: result.previewRows,
        errorMessages: result.errors.map((error) => `Zeile ${error.rowNumber}: ${error.message}`)
      });
      setImportMessage("");
    } catch (error) {
      setImportBuffer(null);
      setImportMessage(error instanceof Error ? error.message : "Importdatei konnte nicht gelesen werden.");
    }
  };

  const handleImportConfirm = async () => {
    if (!articleRepository || !importBuffer) return;
    let imported = 0;
    const errors: string[] = [];

    for (const row of importBuffer.validRows) {
      try {
        await saveArticle(articleRepository, row);
        imported += 1;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Import fehlgeschlagen.");
      }
    }

    await refreshArticles();
    setImportMessage(
      errors.length === 0
        ? `${imported} Artikel wurden importiert.`
        : `${imported} Artikel importiert, ${errors.length} Fehler beim Speichern.`
    );
    setImportBuffer(null);
  };

  const activeLayoutLabel = layoutOptions.find((option) => option.id === activeLayoutId)?.name ?? layoutPresets[0].name;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Label Composer</p>
          <h1 className="mt-2 font-serif text-3xl text-slate-900">EAN-Label MVP</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Lokale Artikeldatenbasis, Layout-Templates und Labeldruck in einer kleinen, sauberen internen Anwendung.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 rounded-full bg-slate-100 p-1">
          <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>Etikett erstellen</TabButton>
          <TabButton active={activeTab === "articles"} onClick={() => setActiveTab("articles")}>Artikel</TabButton>
          <TabButton active={activeTab === "layout"} onClick={() => setActiveTab("layout")}>Layout konfigurieren</TabButton>
        </div>

        {activeTab === "create" ? (
          <>
            <ValidationSummary issues={allIssues} />
            <div className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[1fr_1fr]">
              <Field label="Layout / Etikettenformat">
                <select className={inputClassName} onChange={(event) => handleLayoutSelection(event.target.value)} value={activeLayoutId}>
                  <optgroup label="Standardlayouts">
                    {layoutOptions.filter((option) => option.source === "preset").map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Gespeicherte Layouts">
                    {layoutOptions.filter((option) => option.source === "template").map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </optgroup>
                </select>
              </Field>
              <div className="space-y-2">
                <div className="relative">
                  <Field label="Artikel aus lokaler Datenbasis suchen">
                    <input
                      aria-controls="article-search-results"
                      aria-expanded={showArticleSearchResults}
                      aria-haspopup="listbox"
                      className={inputClassName}
                      onBlur={() => window.setTimeout(() => setIsArticleSearchOpen(false), 120)}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setArticleSearch(nextValue);
                        setIsArticleSearchOpen(nextValue.trim().length > 0);
                      }}
                      onFocus={() => setIsArticleSearchOpen(articleSearch.trim().length > 0)}
                      placeholder="Suche nach SKU, Artikelname oder EAN"
                      value={articleSearch}
                    />
                  </Field>

                  {showArticleSearchResults ? (
                    <div
                      className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                      id="article-search-results"
                      role="listbox"
                    >
                      {filteredArticles.length === 0 ? (
                        <p className="px-2 py-2 text-sm text-slate-500">Keine passenden Artikel gefunden.</p>
                      ) : (
                        <div className="max-h-56 space-y-1 overflow-auto">
                          {filteredArticles.map((article) => (
                            <button
                              key={article.articleId}
                              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${selectedArticleId === article.articleId ? "bg-teal-50 text-teal-900 ring-1 ring-teal-200" : "text-slate-700 hover:bg-slate-50"}`}
                              onClick={() => handleArticleSelectionForLabel(article)}
                              onMouseDown={(event) => handleArticleResultMouseDown(event, article)}
                              type="button"
                            >
                              <div className="font-medium">{article.name}</div>
                              <div className="mt-1 text-xs text-slate-500">
                                {article.sku ? `SKU: ${article.sku}` : "ohne SKU"}
                                {article.ean ? ` | EAN: ${article.ean}` : " | ohne EAN"}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">
                  {articleSearchHasQuery
                    ? "Treffer erscheinen direkt unter dem Suchfeld und werden per Klick uebernommen."
                    : `${articles.length} lokale Artikel verfuegbar. Suche nach Name, SKU oder EAN.`}
                </p>
              </div>
            </div>

            {selectedArticle ? (
              <div className="rounded-[24px] border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm text-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Ausgewaehlter Artikel</p>
                    <p className="mt-1">{selectedArticle.name}</p>
                    <p className="mt-1 text-slate-500">
                      {selectedArticle.sku ? `SKU ${selectedArticle.sku}` : "ohne SKU"}
                      {selectedArticle.ean ? ` | EAN ${selectedArticle.ean}` : " | ohne EAN"}
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-semibold text-teal-800 transition hover:bg-teal-100"
                    onClick={handleSelectedArticleClear}
                    type="button"
                  >
                    Auswahl loesen
                  </button>
                </div>
              </div>
            ) : null}

            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Aktives Layout</p>
              <p className="mt-1">{activeLayoutLabel}</p>
              <p className="mt-2 text-slate-500">Layoutwechsel wirkt sofort auf Vorschau und PDF. Die Artikelsuche arbeitet als direktes Suchfeld mit eingeblendeten Treffern.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Field label="EAN">
                <input {...register("ean")} className={inputClassName} />
              </Field>
              <Field label="SKU optional">
                <input {...register("sku")} className={inputClassName} />
              </Field>
              <Field label="Artikelname">
                <input {...register("articleName")} className={inputClassName} />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300" disabled={allIssues.length > 0 || preview === null} onClick={handlePdf} type="button">
                PDF erzeugen
              </button>
              <p className="text-sm text-slate-600">Druckpfad in V1: PDF im neuen Fenster oeffnen und auf Windows ueber den lokalen Druckdialog drucken.</p>
            </div>

            {pdfMessage ? <p className="text-sm text-teal-800">{pdfMessage}</p> : null}
          </>
        ) : null}

        {activeTab === "articles" ? (
          <ArticleManager
            articleDraft={articleDraft}
            articleMessage={articleMessage}
            articles={articles}
            importMessage={importMessage}
            importPreview={
              importBuffer
                ? {
                    sourceName: importBuffer.sourceName,
                    validCount: importBuffer.validRows.length,
                    previewRows: importBuffer.previewRows,
                    errorMessages: importBuffer.errorMessages
                  }
                : null
            }
            onArticleSelect={handleArticleSelectForEdit}
            onDeleteArticle={handleArticleDelete}
            onDraftChange={handleDraftChange}
            onImportConfirm={handleImportConfirm}
            onImportFile={handleImportFile}
            onResetArticle={handleArticleReset}
            onSaveArticle={handleArticleSave}
            selectedArticleId={editingArticleId}
          />
        ) : null}

        {activeTab === "layout" ? (
          <>
            <TemplateManager
              disabled={!templateRepository}
              message={templateMessage}
              onDelete={handleTemplateDelete}
              onLoad={handleTemplateLoad}
              onReset={handleTemplateReset}
              onSave={handleTemplateSave}
              onTemplateNameChange={setTemplateName}
              onTemplateSelect={handleTemplateSelect}
              onUpdate={handleTemplateUpdate}
              selectedTemplateId={selectedTemplateId}
              templateName={templateName}
              templates={templates}
            />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Layout</h2>
              <div className="grid grid-cols-2 gap-3">
                {numericFieldNames.map((name) => (
                  <Field key={name} label={layoutLabels[name]}>
                    <input {...register(`layout.${name}`, { valueAsNumber: true })} className={inputClassName} step="0.1" type="number" />
                  </Field>
                ))}
              </div>

              <Field label="Ausrichtung">
                <select {...register("layout.textAlign")} className={inputClassName}>
                  <option value="left">Links</option>
                  <option value="center">Zentriert</option>
                  <option value="right">Rechts</option>
                </select>
              </Field>

              <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                <label className="inline-flex items-center gap-2">
                  <input {...register("layout.showSku")} type="checkbox" />
                  SKU anzeigen
                </label>
                <label className="inline-flex items-center gap-2">
                  <input {...register("layout.showHumanReadableEan")} type="checkbox" />
                  EAN-Klarschrift anzeigen
                </label>
              </div>
            </div>
          </>
        ) : null}
      </section>

      <div>{preview ? <LabelPreview spec={preview} /> : null}</div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

const TabButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

const inputClassName =
  "w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white";

const layoutLabels: Record<keyof LabelFormValues["layout"], string> = {
  widthMm: "Breite mm",
  heightMm: "Hoehe mm",
  marginTopMm: "Rand oben mm",
  marginRightMm: "Rand rechts mm",
  marginBottomMm: "Rand unten mm",
  marginLeftMm: "Rand links mm",
  articleNameFontSizePt: "Name pt",
  skuFontSizePt: "SKU pt",
  barcodeHeightMm: "Barcodehoehe mm",
  barcodeScale: "Barcode-Skalierung",
  textAlign: "Ausrichtung",
  showSku: "SKU anzeigen",
  showHumanReadableEan: "EAN-Klarschrift"
};



