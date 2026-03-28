export const mmToPoints = (mm: number): number => (mm * 72) / 25.4;

export const roundTo = (value: number, digits = 2): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};
