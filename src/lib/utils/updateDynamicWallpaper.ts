import { wallpaperColors } from "./dynamicColors";
import { interpolateColor } from "./interpolateColor";

export function updateDynamicWallpaper() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const colors = wallpaperColors;
  const segment = 24 / colors.length; // 6 for 4 colors

  const index1 = Math.floor(hour / segment);
  const index2 = (index1 + 1) % colors.length;

  const factor = ((hour % segment) + minute / 60) / segment;

  // const interpolated = interpolateColor(colors[index1], colors[index2], factor);
  const interpolated = colors[index1];

  document.documentElement.style.setProperty("--background", interpolated);
  document.querySelectorAll<HTMLElement>(".glass").forEach(el => {
    el.style.background = interpolated;
  });
}
