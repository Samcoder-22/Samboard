// Helper: interpolate two hex colors
export function interpolateColor(color1: string, color2: string, factor: number) {
  if (factor === undefined) factor = 0.5;
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r = ((c2 >> 16) - (c1 >> 16)) * factor + (c1 >> 16);
  const g = (((c2 >> 8) & 0xff) - ((c1 >> 8) & 0xff)) * factor + ((c1 >> 8) & 0xff);
  const b = ((c2 & 0xff) - (c1 & 0xff)) * factor + (c1 & 0xff);

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
