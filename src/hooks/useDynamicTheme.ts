import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export type SkyColorConfig = {
    top: string;
    bottom: string;
    accent: string;
};

// Realistic sky color pairs over a 24h cycle
const DEFAULT_SKY_COLORS: SkyColorConfig[] = [
    { top: "#030B1C", bottom: "#081023", accent: "#3B82F6" }, // Midnight (Deep blues)
    { top: "#081023", bottom: "#0B1D3A", accent: "#3B82F6" }, // Late Night
    { top: "#0B1D3A", bottom: "#1A2A42", accent: "#60A5FA" }, // Pre-dawn
    { top: "#1A2A42", bottom: "#28385E", accent: "#60A5FA" }, // Dawn
    { top: "#28385E", bottom: "#D77B5D", accent: "#F59E0B" }, // Sunrise (Blue to Orange)
    { top: "#4A6CA3", bottom: "#EDAE7A", accent: "#F59E0B" }, // Early Morning
    { top: "#3B82F6", bottom: "#6AB1E7", accent: "#3B82F6" }, // Morning
    { top: "#2563EB", bottom: "#4A90E2", accent: "#2563EB" }, // Noon
    { top: "#1D4ED8", bottom: "#2B73C4", accent: "#2563EB" }, // Afternoon
    { top: "#1E3A8A", bottom: "#4A6CA3", accent: "#3B82F6" }, // Late Afternoon
    { top: "#28385E", bottom: "#E28E46", accent: "#F97316" }, // Sunset (Dark blue to warm orange)
    { top: "#1A2A42", bottom: "#A35A4D", accent: "#EF4444" }, // Dusk
    { top: "#0B1D3A", bottom: "#3A3B5E", accent: "#8B5CF6" }, // Evening
    { top: "#081023", bottom: "#1F253E", accent: "#6366F1" }, // Night
];

// Calculate relative luminance.
function getLuminance(hex: string) {
    // Convert hex to RGB
    const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(x => {
        const v = parseInt(x, 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Get appropriate text color for the background
function getContrastColor(hexBg: string) {
    const luminance = getLuminance(hexBg);
    return luminance > 0.179 ? "#171717" : "#ededed"; // Dark text for light bg, light text for dark bg
}

export function useDynamicTheme(skyColors = DEFAULT_SKY_COLORS) {
    const isDynamicTheme = useSettingsStore((s) => s.isDynamicTheme);
    const [currentConfig, setCurrentConfig] = useState<SkyColorConfig | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return;

        if (!isDynamicTheme) {
            document.documentElement.removeAttribute("data-dynamic-theme");
            document.documentElement.style.removeProperty("--dynamic-bg-top");
            document.documentElement.style.removeProperty("--dynamic-bg-bottom");
            document.documentElement.style.removeProperty("--dynamic-accent");
            document.documentElement.style.removeProperty("--dynamic-fg");
            setCurrentConfig(null);
            return;
        }

        const updateDynamicColor = () => {
            const getCurrentSkyConfig = (colors: SkyColorConfig[]) => {
                const now = new Date();
                const totalMinutes = now.getHours() * 60 + now.getMinutes();
                const minutesPerColor = (24 * 60) / colors.length;

                let index = Math.floor(totalMinutes / minutesPerColor);
                if (index >= colors.length) index = colors.length - 1; // safety fallback

                return colors[index];
            };

            const config = getCurrentSkyConfig(skyColors);
            const fgColor = getContrastColor(config.top);

            document.documentElement.setAttribute("data-dynamic-theme", "true");
            document.documentElement.style.setProperty("--dynamic-bg-top", config.top);
            document.documentElement.style.setProperty("--dynamic-bg-bottom", config.bottom);
            document.documentElement.style.setProperty("--dynamic-accent", config.accent);
            document.documentElement.style.setProperty("--dynamic-fg", fgColor);
            setCurrentConfig(config);
        };

        // Run initially
        updateDynamicColor();

        // Check every minute
        const interval = setInterval(updateDynamicColor, 60 * 1000);

        return () => clearInterval(interval);
    }, [isDynamicTheme, skyColors]);

    return { currentConfig };
}
