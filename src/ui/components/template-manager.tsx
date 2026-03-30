type LayoutChoice = {
  id: string;
  name: string;
  source: "preset" | "template";
};

type TemplateManagerProps = {
  layoutOptions: LayoutChoice[];
  selectedLayoutId: string;
  templateName: string;
  disabled?: boolean;
  canDelete: boolean;
  message: string;
  onLayoutSelect: (id: string) => void;
  onTemplateNameChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
};

export const TemplateManager = ({
  layoutOptions,
  selectedLayoutId,
  templateName,
  disabled = false,
  canDelete,
  message,
  onLayoutSelect,
  onTemplateNameChange,
  onSave,
  onDelete
}: TemplateManagerProps) => (
  <div className="rounded-[24px] border border-amber-200 bg-amber-50/70 p-4">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Layout-Konfigurator</p>
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Layout auswählen</span>
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600"
          disabled={disabled}
          onChange={(event) => onLayoutSelect(event.target.value)}
          value={selectedLayoutId}
        >
          <optgroup label="Standardlayouts">
            {layoutOptions
              .filter((layoutOption) => layoutOption.source === "preset")
              .map((layoutOption) => (
                <option key={layoutOption.id} value={layoutOption.id}>
                  {layoutOption.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Gespeicherte Layouts">
            {layoutOptions
              .filter((layoutOption) => layoutOption.source === "template")
              .map((layoutOption) => (
                <option key={layoutOption.id} value={layoutOption.id}>
                  {layoutOption.name}
                </option>
              ))}
          </optgroup>
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Template-Name</span>
        <input
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600"
          disabled={disabled}
          onChange={(event) => onTemplateNameChange(event.target.value)}
          placeholder="z. B. Regal Standard oder Promo Klein"
          value={templateName}
        />
      </label>
    </div>

    <div className="mt-4 flex flex-wrap gap-3">
      <button
        className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={disabled}
        onClick={onSave}
        type="button"
      >
        Layout speichern
      </button>
      <button
        className="rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={disabled || !canDelete}
        onClick={onDelete}
        type="button"
      >
        Löschen
      </button>
    </div>

    {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
  </div>
);
