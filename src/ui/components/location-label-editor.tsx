import { type LocationArrow } from "@/domain/location-label/entities/location-label";
import { type LabelLayoutProps } from "@/domain/label/entities/label-layout";

type LayoutOption = {
  id: string;
  name: string;
  source: "preset" | "template";
};

type LocationDraft = {
  aisle: string;
  block: string;
  level: string;
  bin: string;
  arrow: LocationArrow;
};

type LocationLabelEditorProps = {
  locationDraft: LocationDraft;
  activeLayoutId: string;
  layoutOptions: LayoutOption[];
  onDraftChange: (field: keyof LocationDraft, value: string) => void;
  onLayoutSelect: (layoutId: string) => void;
};

export const LocationLabelEditor = ({
  locationDraft,
  activeLayoutId,
  layoutOptions,
  onDraftChange,
  onLayoutSelect
}: LocationLabelEditorProps) => {
  const locationCode = [locationDraft.aisle, locationDraft.block, locationDraft.level, locationDraft.bin]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("-");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[1fr_1fr]">
        <Field label="Layout / Etikettenformat">
          <SelectControl onChange={(event) => onLayoutSelect(event.target.value)} value={activeLayoutId}>
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

        <Field label="Pfeilrichtung">
          <SelectControl onChange={(event) => onDraftChange("arrow", event.target.value as LocationArrow)} value={locationDraft.arrow}>
            <option value="none">Kein Pfeil</option>
            <option value="up">Pfeil oben</option>
            <option value="down">Pfeil unten</option>
          </SelectControl>
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Regal">
          <input className={inputClassName} onChange={(event) => onDraftChange("aisle", event.target.value)} value={locationDraft.aisle} />
        </Field>
        <Field label="Block">
          <input className={inputClassName} onChange={(event) => onDraftChange("block", event.target.value)} value={locationDraft.block} />
        </Field>
        <Field label="Ebene">
          <input className={inputClassName} onChange={(event) => onDraftChange("level", event.target.value)} value={locationDraft.level} />
        </Field>
        <Field label="Fach">
          <input className={inputClassName} onChange={(event) => onDraftChange("bin", event.target.value)} value={locationDraft.bin} />
        </Field>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Stellplatzcode</p>
        <p className="mt-2 text-lg font-semibold tracking-[0.08em] text-slate-900">{locationCode || "-"}</p>
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
