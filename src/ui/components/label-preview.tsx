"use client";

import { useState } from "react";

import { buildLayoutMetrics } from "@/domain/label/services/build-layout-metrics";
import { type RenderSpec } from "@/domain/label/services/build-render-spec";

type LabelPreviewProps = {
  spec: RenderSpec;
};

const scale = 3.5;

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
      <div className="overflow-auto rounded-2xl p-6">
        <div className="flex min-h-[220px] items-center justify-center" data-testid="preview-stage">
          <div
            className="relative border border-slate-300 bg-white"
            data-testid="preview-label"
            style={{ width: labelWidth, height: labelHeight }}
          >
            {metrics.textRows.map((row) => {
              const isStrongRow = row.kind === "articleName" || row.kind === "locationCode";
              return (
                <div
                  key={`${row.kind}-${row.value}`}
                  className={isStrongRow ? "absolute whitespace-nowrap font-semibold text-slate-900" : "absolute whitespace-nowrap text-slate-700"}
                  style={{
                    left: `${row.x * scale}px`,
                    top: `${row.y * scale}px`,
                    width: `${Math.max(row.estimatedWidthMm, 1) * scale}px`,
                    fontSize: `${row.fontSizePt * (96 / 72)}px`,
                    lineHeight: `${row.lineHeightMm * scale}px`
                  }}
                >
                  {row.value}
                </div>
              );
            })}

            {barcodeFailed ? (
              <div
                className="absolute flex items-center justify-center border border-rose-200 bg-rose-50 text-[11px] text-rose-700"
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
                className="absolute whitespace-nowrap text-slate-700"
                style={{
                  left: `${metrics.humanReadableRow.x * scale}px`,
                  top: `${metrics.humanReadableRow.y * scale}px`,
                  width: `${Math.max(metrics.humanReadableRow.estimatedWidthMm, 1) * scale}px`,
                  fontSize: `${metrics.humanReadableRow.fontSizePt * (96 / 72)}px`,
                  lineHeight: `${metrics.humanReadableRow.lineHeightMm * scale}px`
                }}
              >
                {metrics.humanReadableRow.value}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
