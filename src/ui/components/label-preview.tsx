"use client";

import { useState } from "react";

import { buildLayoutMetrics } from "@/domain/label/services/build-layout-metrics";
import { type RenderSpec } from "@/domain/label/services/build-render-spec";

type LabelPreviewProps = {
  spec: RenderSpec;
};

const scale = 3.2;

export const LabelPreview = ({ spec }: LabelPreviewProps) => {
  const [barcodeFailed, setBarcodeFailed] = useState(false);
  const metrics = buildLayoutMetrics(spec);
  const labelWidth = spec.widthMm * scale;
  const labelHeight = spec.heightMm * scale;
  const barcodeUrl = `/api/barcode?value=${encodeURIComponent(spec.barcode.value)}&scale=${encodeURIComponent(String(spec.barcode.scale))}&heightMm=${encodeURIComponent(String(spec.barcode.heightMm))}`;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
        <span>Live-Vorschau</span>
        <span>
          {spec.widthMm} x {spec.heightMm} mm
        </span>
      </div>
      <div className="overflow-auto rounded-2xl bg-slate-100 p-6">
        <div className="relative rounded-xl border border-slate-300 bg-white" style={{ width: labelWidth, height: labelHeight }}>
          <div
            className="absolute border border-dashed border-slate-300"
            style={{
              left: metrics.contentBox.x * scale,
              top: metrics.contentBox.y * scale,
              width: metrics.contentBox.width * scale,
              height: metrics.contentBox.height * scale
            }}
          />

          {metrics.textRows.map((row) => (
            <div
              key={`${row.kind}-${row.value}`}
              className={row.kind === "articleName" ? "absolute font-semibold text-slate-900" : "absolute text-slate-700"}
              style={{
                left: `${metrics.contentBox.x * scale}px`,
                top: `${row.y * scale}px`,
                width: `${metrics.contentBox.width * scale}px`,
                fontSize: `${row.fontSizePt * (96 / 72)}px`,
                lineHeight: `${row.lineHeightMm * scale}px`,
                textAlign: row.align
              }}
            >
              {row.value}
            </div>
          ))}

          {barcodeFailed ? (
            <div
              className="absolute flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-[11px] text-rose-700"
              style={{
                left: `${metrics.barcodeBox.x * scale}px`,
                top: `${metrics.barcodeBox.y * scale}px`,
                width: `${metrics.barcodeBox.width * scale}px`,
                height: `${metrics.barcodeBox.height * scale}px`
              }}
            >
              Barcode-Vorschau konnte nicht geladen werden
            </div>
          ) : (
            <img
              alt="Barcode preview"
              className="absolute object-fill"
              onError={() => setBarcodeFailed(true)}
              onLoad={() => setBarcodeFailed(false)}
              src={barcodeUrl}
              style={{
                left: `${metrics.barcodeBox.x * scale}px`,
                top: `${metrics.barcodeBox.y * scale}px`,
                width: `${metrics.barcodeBox.width * scale}px`,
                height: `${metrics.barcodeBox.height * scale}px`
              }}
            />
          )}

          {metrics.humanReadableRow ? (
            <div
              className="absolute text-slate-700"
              style={{
                left: `${metrics.contentBox.x * scale}px`,
                top: `${metrics.humanReadableRow.y * scale}px`,
                width: `${metrics.contentBox.width * scale}px`,
                fontSize: `${metrics.humanReadableRow.fontSizePt * (96 / 72)}px`,
                lineHeight: `${metrics.humanReadableRow.lineHeightMm * scale}px`,
                textAlign: metrics.humanReadableRow.align
              }}
            >
              {metrics.humanReadableRow.value}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
