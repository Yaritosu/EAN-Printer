"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { filterArticles } from "@/application/articles/filter-articles";
import { importArticleRows } from "@/application/articles/import-article-rows";
import { listArticles } from "@/application/articles/list-articles";
import { saveArticle } from "@/application/articles/save-article";
import { loadShopifyConfig } from "@/application/shopify/load-shopify-config";
import { saveShopifyConfig } from "@/application/shopify/save-shopify-config";
import { deleteTemplate } from "@/application/templates/delete-template";
import { listTemplates } from "@/application/templates/list-templates";
import { saveTemplate } from "@/application/templates/save-template";
import { buildLocationLabelPreview } from "@/application/use-cases/build-location-label-preview";
import { buildPreview } from "@/application/use-cases/build-preview";
import { type Article } from "@/domain/articles/entities/article";
import { type LocationArrow } from "@/domain/location-label/entities/location-label";
import { type LabelLayoutProps } from "@/domain/label/entities/label-layout";
import { type ShopifyConfig } from "@/domain/shopify/entities/shopify-config";
import { type LabelTemplate } from "@/domain/templates/entities/label-template";
import { LocalStorageArticleRepository } from "@/infrastructure/storage/local-storage-article-repository";
import { LocalStorageShopifyConfigRepository } from "@/infrastructure/storage/local-storage-shopify-config-repository";
import { LocalStorageTemplateRepository } from "@/infrastructure/storage/local-storage-template-repository";
import { ImportApiPanel } from "@/ui/components/import-api-panel";
import { LabelPreview } from "@/ui/components/label-preview";
import { LocationLabelEditor } from "@/ui/components/location-label-editor";
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
    heightMm: z.number().positive("Höhe muss positiv sein."),
    marginMm: z.number().min(0, "Rand darf nicht negativ sein."),
    articleNameFontSizePt: z.number().positive("Textgröße muss positiv sein."),
    skuFontSizePt: z.number().positive("SKU-Größe muss positiv sein."),
    barcodeHeightMm: z.number().positive("Barcode-Größe muss positiv sein."),
    orientation: z.enum(["landscape", "portrait"])
  })
});

type LabelFormValues = z.infer<typeof labelSchema>;
type EditorTab = "create" | "location" | "importApi" | "layout";

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

type ShopifyDraft = {
  shopDomain: string;
  adminApiToken: string;
  apiVersion: string;
};

type LocationDraft = {
  aisle: string;
  block: string;
  level: string;
  bin: string;
  arrow: LocationArrow;
};

const numericFieldNames: Array<keyof LabelFormValues["layout"]> = [
  "widthMm",
  "heightMm",
  "marginMm",
  "articleNameFontSizePt",
  "skuFontSizePt",
  "barcodeHeightMm"
];

export const LabelEditor = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>("create");
  const [pdfMessage, setPdfMessage] = useState("");
  const [locationPdfMessage, setLocationPdfMessage] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");
  const [shopifyMessage, setShopifyMessage] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [activeLayoutId, setActiveLayoutId] = useState<string>(layoutPresets[0].id);
  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [shopifyConfig, setShopifyConfig] = useState<ShopifyConfig | null>(null);
  const [shopifyDraft, setShopifyDraft] = useState<ShopifyDraft>({
    shopDomain: "",
    adminApiToken: "",
    apiVersion: "2026-01"
  });
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [articleSearch, setArticleSearch] = useState("");
  const [isArticleSearchOpen, setIsArticleSearchOpen] = useState(false);
  const [importBuffer, setImportBuffer] = useState<ImportBuffer | null>(null);
  const [locationDraft, setLocationDraft] = useState<LocationDraft>({
    aisle: "",
    block: "",
    level: "",
    bin: "",
    arrow: "none"
  });
  const articleSearchInputRef = useRef<HTMLInputElement | null>(null);

  const templateRepository = useMemo(
    () => (typeof window === "undefined" ? null : new LocalStorageTemplateRepository(window.localStorage)),
    []
  );
  const articleRepository = useMemo(
    () => (typeof window === "undefined" ? null : new LocalStorageArticleRepository(window.localStorage)),
    []
  );
  const shopifyRepository = useMemo(
    () => (typeof window === "undefined" ? null : new LocalStorageShopifyConfigRepository(window.localStorage)),
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
      articleName: "",
      sku: "",
      ean: "",
      layout: defaultLayout
    }
  });

  const focusArticleSearch = () => {
    window.setTimeout(() => articleSearchInputRef.current?.focus(), 0);
  };

  const refreshTemplates = async () => {
    if (!templateRepository) return;
    setTemplates(await listTemplates(templateRepository));
  };

  const refreshArticles = async () => {
    if (!articleRepository) return;
    setArticles(await listArticles(articleRepository));
  };

  const refreshShopifyConfig = async () => {
    if (!shopifyRepository) return;
    const config = await loadShopifyConfig(shopifyRepository);
    setShopifyConfig(config);
    if (config) {
      setShopifyDraft({
        shopDomain: config.shopDomain,
        adminApiToken: config.adminApiToken,
        apiVersion: config.apiVersion
      });
    }
  };

  useEffect(() => {
    void refreshTemplates();
    void refreshArticles();
    void refreshShopifyConfig();
  }, [templateRepository, articleRepository, shopifyRepository]);

  useEffect(() => {
    if (activeTab === "create") {
      focusArticleSearch();
    }
  }, [activeTab]);

  const layoutOptions = useMemo<LayoutOption[]>(() => {
    return [
      ...layoutPresets.map((preset) => ({ id: preset.id, name: preset.name, layout: preset.layout, source: "preset" as const })),
      ...templates.map((template) => ({ id: template.id, name: template.name, layout: template.layout, source: "template" as const }))
    ];
  }, [templates]);

  const activeLayoutOption = useMemo(
    () => layoutOptions.find((option) => option.id === activeLayoutId) ?? layoutOptions[0],
    [activeLayoutId, layoutOptions]
  );

  const filteredArticles = useMemo(() => filterArticles(articles, articleSearch).slice(0, 8), [articles, articleSearch]);
  const articleSearchHasQuery = articleSearch.trim().length > 0;
  const showArticleSearchResults = isArticleSearchOpen && articleSearchHasQuery;
  const selectedArticle = useMemo(
    () => articles.find((article) => article.articleId === selectedArticleId) ?? null,
    [articles, selectedArticleId]
  );

  const values = watch();
  const createDomainIssues = useMemo(() => {
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

  const createIssues = [...fieldIssues, ...createDomainIssues];
  const preview = useMemo(() => {
    try {
      return buildPreview(values);
    } catch {
      return null;
    }
  }, [values]);

  const locationIssues = useMemo(() => {
    try {
      buildLocationLabelPreview({
        aisle: locationDraft.aisle,
        block: locationDraft.block,
        level: locationDraft.level,
        bin: locationDraft.bin,
        arrow: locationDraft.arrow,
        layout: values.layout
      });
      return [];
    } catch (error) {
      return [error instanceof Error ? error.message : "Stellplatz-Vorschau konnte nicht erzeugt werden."];
    }
  }, [locationDraft, values.layout]);

  const locationPreview = useMemo(() => {
    try {
      return buildLocationLabelPreview({
        aisle: locationDraft.aisle,
        block: locationDraft.block,
        level: locationDraft.level,
        bin: locationDraft.bin,
        arrow: locationDraft.arrow,
        layout: values.layout
      });
    } catch {
      return null;
    }
  }, [locationDraft, values.layout]);

  const applyLayout = (layout: LabelLayoutProps) => {
    setValue("layout", { ...layout }, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleLayoutSelection = (layoutId: string) => {
    setActiveLayoutId(layoutId);
    const selectedOption = layoutOptions.find((option) => option.id === layoutId);
    if (!selectedOption) return;
    applyLayout(selectedOption.layout);
    if (activeTab === "create") {
      focusArticleSearch();
    }
  };

  const handleConfiguratorLayoutSelect = (layoutId: string) => {
    setActiveLayoutId(layoutId);
    const selectedOption = layoutOptions.find((option) => option.id === layoutId);
    if (!selectedOption) return;
    applyLayout(selectedOption.layout);
    setTemplateName(selectedOption.source === "template" ? selectedOption.name : "");
    setTemplateMessage("");
  };

  const handleArticleSelectionForLabel = (article: Article) => {
    setSelectedArticleId(article.articleId);
    setArticleSearch(article.sku ? `${article.name} (${article.sku})` : article.name);
    setIsArticleSearchOpen(false);
    setValue("articleName", article.name, { shouldValidate: true, shouldDirty: true });
    setValue("sku", article.sku ?? "", { shouldValidate: true, shouldDirty: true });
    setValue("ean", article.ean ?? "", { shouldValidate: true, shouldDirty: true });
    focusArticleSearch();
  };

  const handleArticleResultMouseDown = (event: React.MouseEvent<HTMLButtonElement>, article: Article) => {
    event.preventDefault();
    handleArticleSelectionForLabel(article);
  };

  const handleSelectedArticleClear = () => {
    setSelectedArticleId("");
    setArticleSearch("");
    setValue("articleName", "", { shouldValidate: true, shouldDirty: true });
    setValue("sku", "", { shouldValidate: true, shouldDirty: true });
    setValue("ean", "", { shouldValidate: true, shouldDirty: true });
    setIsArticleSearchOpen(false);
    focusArticleSearch();
  };

  const handleCreateFieldBlur = () => {
    focusArticleSearch();
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
      focusArticleSearch();
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setPdfMessage("PDF wurde in einem neuen Fenster geöffnet.");
    focusArticleSearch();
  };

  const handleLocationPdf = async () => {
    setLocationPdfMessage("");
    const payload = {
      aisle: locationDraft.aisle,
      block: locationDraft.block,
      level: locationDraft.level,
      bin: locationDraft.bin,
      arrow: locationDraft.arrow,
      layout: values.layout
    };
    const response = await fetch("/api/location-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const payloadError = (await response.json().catch(() => null)) as { error?: string } | null;
      setLocationPdfMessage(payloadError?.error ?? "Stellplatz-PDF konnte nicht erzeugt werden.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setLocationPdfMessage("Stellplatz-PDF wurde in einem neuen Fenster geöffnet.");
  };

  const handleTemplateSave = async () => {
    if (!templateRepository) return;
    try {
      const activeTemplate = activeLayoutOption?.source === "template" ? templates.find((template) => template.id === activeLayoutId) ?? null : null;
      const shouldUpdateActiveTemplate = activeTemplate !== null && activeTemplate.name.trim() === templateName.trim();
      const saved = await saveTemplate(templateRepository, {
        id: shouldUpdateActiveTemplate ? activeTemplate.id : undefined,
        name: templateName,
        layout: getValues("layout")
      });
      await refreshTemplates();
      setActiveLayoutId(saved.id);
      setTemplateName(saved.name);
      setTemplateMessage(`Layout "${saved.name}" wurde gespeichert.`);
    } catch (error) {
      setTemplateMessage(error instanceof Error ? error.message : "Layout konnte nicht gespeichert werden.");
    }
  };

  const handleTemplateDelete = async () => {
    if (!templateRepository || activeLayoutOption?.source !== "template") return;
    const activeTemplate = templates.find((template) => template.id === activeLayoutId);
    if (!activeTemplate) return;
    await deleteTemplate(templateRepository, activeTemplate.id);
    await refreshTemplates();
    setActiveLayoutId(layoutPresets[0].id);
    applyLayout(layoutPresets[0].layout);
    setTemplateName("");
    setTemplateMessage(`Layout "${activeTemplate.name}" wurde gelöscht.`);
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

  const handleShopifyDraftChange = (field: keyof ShopifyDraft, value: string) => {
    setShopifyDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSaveShopifyConfig = async () => {
    if (!shopifyRepository) return;
    try {
      const saved = await saveShopifyConfig(shopifyRepository, shopifyDraft);
      setShopifyConfig(saved);
      setShopifyMessage(`Shopify-Konfiguration für ${saved.shopDomain} wurde gespeichert.`);
    } catch (error) {
      setShopifyMessage(error instanceof Error ? error.message : "Shopify-Konfiguration konnte nicht gespeichert werden.");
    }
  };

  const handleLocationDraftChange = (field: keyof LocationDraft, value: string) => {
    setLocationDraft((current) => ({ ...current, [field]: value as LocationDraft[keyof LocationDraft] }));
  };

  const activeLayoutLabel = activeLayoutOption?.name ?? layoutPresets[0].name;
  const canDeleteLayout = activeLayoutOption?.source === "template";
  const orientationField = register("layout.orientation");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Elvent Tools</p>
          <h1 className="mt-2 font-serif text-3xl text-slate-900">Label Manager</h1>
        </div>

        <div className="flex flex-wrap gap-3 rounded-full bg-slate-100 p-1">
          <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>Etikett drucken</TabButton>
          <TabButton active={activeTab === "location"} onClick={() => setActiveTab("location")}>Stellplatz-Label</TabButton>
          <TabButton active={activeTab === "importApi"} onClick={() => setActiveTab("importApi")}>Import/API</TabButton>
          <TabButton active={activeTab === "layout"} onClick={() => setActiveTab("layout")}>Layout konfigurieren</TabButton>
        </div>

        {activeTab === "create" ? (
          <>
            <ValidationSummary issues={createIssues} />

            <div className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[1fr_1fr]">
              <Field label="Layout / Etikettenformat">
                <SelectControl onChange={(event) => handleLayoutSelection(event.target.value)} value={activeLayoutId}>
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
                </SelectControl>
              </Field>

              <div className="space-y-2">
                <div className="relative">
                  <Field label="Artikel suchen">
                    <input
                      ref={articleSearchInputRef}
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
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg" id="article-search-results" role="listbox">
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
              </div>
            </div>

            {selectedArticle ? (
              <div className="rounded-[24px] border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm text-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Ausgewählter Artikel</p>
                    <p className="mt-1">{selectedArticle.name}</p>
                    <p className="mt-1 text-slate-500">
                      {selectedArticle.sku ? `SKU ${selectedArticle.sku}` : "ohne SKU"}
                      {selectedArticle.ean ? ` | EAN ${selectedArticle.ean}` : " | ohne EAN"}
                    </p>
                  </div>
                  <button className="rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-semibold text-teal-800 transition hover:bg-teal-100" onClick={handleSelectedArticleClear} type="button">
                    Auswahl lösen
                  </button>
                </div>
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-3">
              <Field label="EAN">
                <input {...register("ean", { onBlur: handleCreateFieldBlur })} className={inputClassName} />
              </Field>
              <Field label="Artikelname">
                <input {...register("articleName", { onBlur: handleCreateFieldBlur })} className={inputClassName} />
              </Field>
              <Field label="SKU (optional)">
                <input {...register("sku", { onBlur: handleCreateFieldBlur })} className={inputClassName} />
              </Field>
            </div>
          </>
        ) : null}

        {activeTab === "location" ? (
          <>
            <ValidationSummary issues={locationIssues} />
            <LocationLabelEditor
              activeLayoutId={activeLayoutId}
              layoutOptions={layoutOptions.map((option) => ({ id: option.id, name: option.name, source: option.source }))}
              locationDraft={locationDraft}
              onDraftChange={handleLocationDraftChange}
              onLayoutSelect={handleLayoutSelection}
            />
          </>
        ) : null}

        {activeTab === "importApi" ? (
          <ImportApiPanel
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
            localArticleCount={articles.length}
            onImportConfirm={handleImportConfirm}
            onImportFile={handleImportFile}
            onSaveShopifyConfig={handleSaveShopifyConfig}
            onShopifyDraftChange={handleShopifyDraftChange}
            shopifyConfig={shopifyConfig}
            shopifyDraft={shopifyDraft}
            shopifyMessage={shopifyMessage}
          />
        ) : null}

        {activeTab === "layout" ? (
          <>
            <TemplateManager
              canDelete={canDeleteLayout}
              disabled={!templateRepository}
              layoutOptions={layoutOptions.map((option) => ({ id: option.id, name: option.name, source: option.source }))}
              message={templateMessage}
              onDelete={handleTemplateDelete}
              onLayoutSelect={handleConfiguratorLayoutSelect}
              onSave={handleTemplateSave}
              onTemplateNameChange={setTemplateName}
              selectedLayoutId={activeLayoutId}
              templateName={templateName}
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

              <Field label="Layout-Ausrichtung">
                <SelectControl {...orientationField}>
                  <option value="landscape">Querformat</option>
                  <option value="portrait">Hochformat</option>
                </SelectControl>
              </Field>
            </div>
          </>
        ) : null}
      </section>

      <div className="space-y-4">
        {activeTab === "location" ? (
          <>
            {locationPreview ? (
              <LabelPreview spec={locationPreview} />
            ) : (
              <PlaceholderPreview label={activeLayoutLabel} message="Gib Regal, Block, Ebene und Fach ein, um das Stellplatz-Label zu sehen." />
            )}
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-panel">
              <button
                className="w-full rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={locationIssues.length > 0 || locationPreview === null}
                onClick={handleLocationPdf}
                type="button"
              >
                Stellplatz-PDF erzeugen
              </button>
              {locationPdfMessage ? <p className="mt-3 text-sm text-teal-800">{locationPdfMessage}</p> : null}
            </div>
          </>
        ) : activeTab === "importApi" ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
              <span>Import/API</span>
              <span>Shopify + CSV/XLSX</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Shopify-Verbindung und Import werden hier vorbereitet. Produktabruf und Verbindungstest folgen im nächsten Schritt.
            </div>
          </div>
        ) : (
          <>
            {preview ? (
              <LabelPreview spec={preview} />
            ) : (
              <PlaceholderPreview label={activeLayoutLabel} message="Wähle einen Artikel aus oder erfasse EAN, Artikelname und SKU." />
            )}

            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-panel">
              <button
                className="w-full rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={createIssues.length > 0 || preview === null}
                onClick={handlePdf}
                type="button"
              >
                PDF erzeugen
              </button>
              {pdfMessage ? <p className="mt-3 text-sm text-teal-800">{pdfMessage}</p> : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PlaceholderPreview = ({ label, message }: { label: string; message: string }) => (
  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel">
    <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
      <span>Live-Vorschau</span>
      <span>{label}</span>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">{message}</div>
  </div>
);

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

const SelectControl = ({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 pr-10 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white ${className}`.trim()}
    >
      {children}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500" aria-hidden="true">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 8L10 12L14 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </span>
  </div>
);

const inputClassName =
  "w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white";

const layoutLabels: Record<keyof LabelFormValues["layout"], string> = {
  widthMm: "Breite mm",
  heightMm: "Höhe mm",
  marginMm: "Rand mm",
  articleNameFontSizePt: "Textgröße",
  skuFontSizePt: "SKU-Größe",
  barcodeHeightMm: "Barcode-Größe",
  orientation: "Layout-Ausrichtung"
};
