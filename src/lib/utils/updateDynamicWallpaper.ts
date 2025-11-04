import { wallpaperColors } from "./dynamicColors";
import { interpolateColor } from "./interpolateColor";

/** Helper: Convert hex → RGB */
function hexToRgb(hex: string) {
  const parsed = hex.replace("#", "");
  const bigint = parseInt(parsed, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/** Helper: Compute brightness (0–255 scale) */
function getBrightness(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** Helper: choose text color based on background brightness */
function getTextColorForBackground(bgHex: string) {
  const brightness = getBrightness(bgHex);
  if (brightness < 80) {
    // very dark background → use bright text
    return {
      primary: "#f5f5f5",
      secondary: "#bbbbbb",
    };
  } else if (brightness < 180) {
    // medium tone → balanced
    return {
      primary: "#f0f0f0",
      secondary: "#d0d0d0",
    };
  } else {
    // bright background → dark text
    return {
      primary: "#171717",
      secondary: "#555555",
    };
  }
}

export function updateDynamicWallpaper() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const colors = wallpaperColors;
  const segment = 24 / colors.length;

  const index1 = Math.floor(hour / segment);
  const index2 = (index1 + 1) % colors.length;
  const factor = ((hour % segment) + minute / 60) / segment;

  const interpolated = interpolateColor(colors[index1], colors[index2], factor);

  // ✅ Apply background
  document.documentElement.style.setProperty("--background", interpolated);

  // ✅ Compute and apply text color based on wallpaper brightness
  const textColors = getTextColorForBackground(interpolated);
  document.documentElement.style.setProperty("--text-primary", textColors.primary);
  document.documentElement.style.setProperty("--text-secondary", textColors.secondary);
}
