import { type LabelTemplate } from "@/domain/templates/entities/label-template";

type TemplateManagerProps = {
  templates: LabelTemplate[];
  selectedTemplateId: string;
  templateName: string;
  disabled?: boolean;
  message: string;
  onTemplateSelect: (id: string) => void;
  onTemplateNameChange: (value: string) => void;
  onLoad: () => void;
  onSave: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onReset: () => void;
};

export const TemplateManager = ({
  templates,
  selectedTemplateId,
  templateName,
  disabled = false,
  message,
  onTemplateSelect,
  onTemplateNameChange,
  onLoad,
  onSave,
  onUpdate,
  onDelete,
  onReset
}: TemplateManagerProps) => (
  <div className="rounded-[24px] border border-amber-200 bg-amber-50/70 p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Layout-Konfigurator</p>
        <p className="mt-1 text-sm text-slate-700">
          Templates speichern nur Layout und Anzeige, niemals EAN, SKU oder Artikelname.
        </p>
      </div>
      <button
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
        disabled={disabled}
        onClick={onReset}
        type="button"
      >
        Auf Standard zur\u00FCcksetzen
      </button>
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Gespeichertes Template laden</span>
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600"
          disabled={disabled}
          onChange={(event) => onTemplateSelect(event.target.value)}
          value={selectedTemplateId}
        >
          <option value="">Bitte w\u00E4hlen</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Template-Name</span>
        <input
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600"
          disabled={disabled}
          onChange={(event) => onTemplateNameChange(event.target.value)}
          placeholder="z. B. A6 Regal oder Promo klein"
          value={templateName}
        />
      </label>
    </div>

    <div className="mt-4 flex flex-wrap gap-3">
      <button
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={disabled || !selectedTemplateId}
        onClick={onLoad}
        type="button"
      >
        In Layout laden
      </button>
      <button
        className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={disabled}
        onClick={onSave}
        type="button"
      >
        Als neues Template speichern
      </button>
      <button
        className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={disabled || !selectedTemplateId}
        onClick={onUpdate}
        type="button"
      >
        Bestehendes aktualisieren
      </button>
      <button
        className="rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={disabled || !selectedTemplateId}
        onClick={onDelete}
        type="button"
      >
        L\u00F6schen
      </button>
    </div>

    {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
  </div>
);
