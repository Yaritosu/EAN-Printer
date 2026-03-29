"use client";

import { useMemo, useState } from "react";

import { filterArticles } from "@/application/articles/filter-articles";
import { type Article } from "@/domain/articles/entities/article";

type ImportPreview = {
  validCount: number;
  errorMessages: string[];
  previewRows: Array<{
    rowNumber: number;
    name: string;
    sku?: string;
    ean?: string;
  }>;
  sourceName: string;
};

type ArticleManagerProps = {
  articles: Article[];
  articleDraft: {
    name: string;
    sku: string;
    ean: string;
  };
  selectedArticleId: string;
  articleMessage: string;
  importMessage: string;
  importPreview: ImportPreview | null;
  onDraftChange: (field: "name" | "sku" | "ean", value: string) => void;
  onArticleSelect: (articleId: string) => void;
  onSaveArticle: () => void;
  onDeleteArticle: () => void;
  onResetArticle: () => void;
  onImportFile: (file: File) => void;
  onImportConfirm: () => void;
};

export const ArticleManager = ({
  articles,
  articleDraft,
  selectedArticleId,
  articleMessage,
  importMessage,
  importPreview,
  onDraftChange,
  onArticleSelect,
  onSaveArticle,
  onDeleteArticle,
  onResetArticle,
  onImportFile,
  onImportConfirm
}: ArticleManagerProps) => {
  const [articleSearch, setArticleSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredArticles = useMemo(() => filterArticles(articles, articleSearch).slice(0, 8), [articles, articleSearch]);
  const articleSearchHasQuery = articleSearch.trim().length > 0;
  const showSearchResults = searchOpen && articleSearchHasQuery;
  const isEditing = Boolean(selectedArticleId);

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Artikel suchen und pflegen</p>
            <p className="mt-1 text-sm text-slate-600">Bestehende Artikel per Suche laden oder direkt einen neuen Artikel anlegen.</p>
          </div>
          <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700" onClick={onResetArticle} type="button">
            Neuer Artikel
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Artikel suchen</span>
              <input
                aria-controls="article-manager-search-results"
                aria-expanded={showSearchResults}
                aria-haspopup="listbox"
                className={inputClassName}
                onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setArticleSearch(nextValue);
                  setSearchOpen(nextValue.trim().length > 0);
                }}
                onFocus={() => setSearchOpen(articleSearch.trim().length > 0)}
                placeholder="Suche nach Name, SKU oder EAN"
                value={articleSearch}
              />
            </label>

            {showSearchResults ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" id="article-manager-search-results" role="listbox">
                {filteredArticles.length === 0 ? (
                  <p className="px-2 py-2 text-sm text-slate-500">Keine passenden Artikel gefunden.</p>
                ) : (
                  <div className="max-h-56 space-y-1 overflow-auto">
                    {filteredArticles.map((article) => (
                      <button
                        key={article.articleId}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${selectedArticleId === article.articleId ? "bg-teal-50 text-teal-900 ring-1 ring-teal-200" : "text-slate-700 hover:bg-slate-50"}`}
                        onClick={() => {
                          onArticleSelect(article.articleId);
                          setArticleSearch(article.sku ? `${article.name} (${article.sku})` : article.name);
                          setSearchOpen(false);
                        }}
                        onMouseDown={(event) => event.preventDefault()}
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

            <p className="text-xs text-slate-500">
              {articleSearchHasQuery
                ? "Treffer erscheinen direkt unter dem Suchfeld und laden den Artikel in die Bearbeitung."
                : `${articles.length} lokale Artikel verf\u00FCgbar. Suche nach Name, SKU oder EAN.`}
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{isEditing ? "Artikel bearbeiten" : "Neuer Artikel"}</p>
            <p className="mt-2 text-slate-500">
              {isEditing
                ? "Du bearbeitest gerade einen vorhandenen lokalen Artikel. Speichern aktualisiert denselben Datensatz."
                : "Leeres Formular f\u00FCr einen neuen Artikel. Nach dem Speichern springt das Formular wieder in einen frischen Erfassungszustand."}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Artikelname</span>
            <input className={inputClassName} onChange={(event) => onDraftChange("name", event.target.value)} value={articleDraft.name} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">SKU (optional)</span>
            <input className={inputClassName} onChange={(event) => onDraftChange("sku", event.target.value)} value={articleDraft.sku} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">EAN (optional)</span>
            <input className={inputClassName} onChange={(event) => onDraftChange("ean", event.target.value)} value={articleDraft.ean} />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white" onClick={onSaveArticle} type="button">
            Artikel speichern
          </button>
          <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700" onClick={onResetArticle} type="button">
            Neu beginnen
          </button>
          <button className="rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300" disabled={!selectedArticleId} onClick={onDeleteArticle} type="button">
            Artikel l\u00F6schen
          </button>
        </div>

        {articleMessage ? <p className="mt-3 text-sm text-slate-700">{articleMessage}</p> : null}
      </div>

      <div className="rounded-[24px] border border-indigo-200 bg-indigo-50/70 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">Import CSV / Excel</p>
        <p className="mt-1 text-sm text-slate-600">Unterst\u00FCtzt CSV und XLSX. Erwartete Spalten: `name`, `sku`, `ean` oder entsprechende Varianten.</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            Datei ausw\u00E4hlen
            <input
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onImportFile(file);
                }
                event.currentTarget.value = "";
              }}
              type="file"
            />
          </label>
          <button className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300" disabled={!importPreview} onClick={onImportConfirm} type="button">
            Import best\u00E4tigen
          </button>
        </div>

        {importPreview ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Importvorschau: {importPreview.sourceName}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="font-medium text-slate-900">G\u00FCltige Zeilen: {importPreview.validCount}</p>
                {importPreview.previewRows.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {importPreview.previewRows.slice(0, 5).map((row) => (
                      <li key={`${row.rowNumber}-${row.name}`}>
                        Zeile {row.rowNumber}: {row.name}
                        {row.sku ? ` | SKU ${row.sku}` : ""}
                        {row.ean ? ` | EAN ${row.ean}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-slate-500">Keine g\u00FCltigen Zeilen erkannt.</p>
                )}
              </div>
              <div>
                <p className="font-medium text-slate-900">Fehlerhafte Zeilen: {importPreview.errorMessages.length}</p>
                {importPreview.errorMessages.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm text-rose-700">
                    {importPreview.errorMessages.slice(0, 5).map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-emerald-700">Keine Fehler in der Vorschau gefunden.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {importMessage ? <p className="mt-3 text-sm text-slate-700">{importMessage}</p> : null}
      </div>
    </div>
  );
};

const inputClassName =
  "w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600";
