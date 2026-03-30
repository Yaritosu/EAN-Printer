import { type ShopifyConfig } from "@/domain/shopify/entities/shopify-config";

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

type ShopifyDraft = {
  shopDomain: string;
  adminApiToken: string;
  apiVersion: string;
};

type ImportApiPanelProps = {
  localArticleCount: number;
  shopifyDraft: ShopifyDraft;
  shopifyConfig: ShopifyConfig | null;
  shopifyMessage: string;
  importMessage: string;
  importPreview: ImportPreview | null;
  onShopifyDraftChange: (field: keyof ShopifyDraft, value: string) => void;
  onSaveShopifyConfig: () => void;
  onImportFile: (file: File) => void;
  onImportConfirm: () => void;
};

export const ImportApiPanel = ({
  localArticleCount,
  shopifyDraft,
  shopifyConfig,
  shopifyMessage,
  importMessage,
  importPreview,
  onShopifyDraftChange,
  onSaveShopifyConfig,
  onImportFile,
  onImportConfirm
}: ImportApiPanelProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Shopify-Verbindung</p>
        <p className="mt-1 text-sm text-slate-600">
          Bereitet die spätere Shopify-Anbindung vor. Verbindungstest und Produktabruf folgen im nächsten Schritt.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Field label="Shop-Domain">
            <input className={inputClassName} onChange={(event) => onShopifyDraftChange("shopDomain", event.target.value)} placeholder="z. B. elvent-3.myshopify.com" value={shopifyDraft.shopDomain} />
          </Field>
          <Field label="Admin API Token">
            <input className={inputClassName} onChange={(event) => onShopifyDraftChange("adminApiToken", event.target.value)} placeholder="shpat_..." type="password" value={shopifyDraft.adminApiToken} />
          </Field>
          <Field label="API-Version">
            <input className={inputClassName} onChange={(event) => onShopifyDraftChange("apiVersion", event.target.value)} placeholder="2026-01" value={shopifyDraft.apiVersion} />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white" onClick={onSaveShopifyConfig} type="button">
            Verbindung speichern
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Verbindung vorbereitet</p>
          <p className="mt-2 text-slate-500">
            {shopifyConfig
              ? `Konfiguration gespeichert für ${shopifyConfig.shopDomain}. Test und Abruf werden im nächsten Schritt ergänzt.`
              : "Noch keine gespeicherte Shopify-Konfiguration vorhanden."}
          </p>
        </div>

        {shopifyMessage ? <p className="mt-3 text-sm text-slate-700">{shopifyMessage}</p> : null}
      </div>

      <div className="rounded-[24px] border border-indigo-200 bg-indigo-50/70 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">Import CSV / Excel</p>
        <p className="mt-1 text-sm text-slate-600">
          Unterstützt CSV und XLSX. Erwartete Spalten: `name`, `sku`, `ean` oder entsprechende Varianten.
        </p>
        <p className="mt-2 text-xs text-slate-500">Aktuell lokal verfügbare Artikel: {localArticleCount}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            Datei auswählen
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
            Import bestätigen
          </button>
        </div>

        {importPreview ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Importvorschau: {importPreview.sourceName}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="font-medium text-slate-900">Gültige Zeilen: {importPreview.validCount}</p>
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
                  <p className="mt-2 text-slate-500">Keine gültigen Zeilen erkannt.</p>
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

const inputClassName =
  "w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600";
