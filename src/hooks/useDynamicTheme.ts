import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

// Example realistic sky color progression
// You can expand this array to have as many colors as you want.
// The time gap between colors is automatically calculated: 24h / array.length
const DEFAULT_SKY_COLORS = [
    "#081023", // Midnight
    "#0b1d3a", // Late Night
    "#1a2a42", // Pre-dawn
    "#28385e", // Dawn
    "#d77b5d", // Sunrise
    "#edae7a", // Early Morning
    "#6ab1e7", // Morning
    "#4a90e2", // Noon
    "#2b73c4", // Afternoon
    "#4a6ca3", // Late Afternoon
    "#e28e46", // Sunset
    "#a35a4d", // Dusk
    "#3a3b5a", // Evening
    "#1f253e", // Night
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
    const [currentColor, setCurrentColor] = useState("");

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return;

        if (!isDynamicTheme) {
            document.documentElement.removeAttribute("data-dynamic-theme");
            document.documentElement.style.removeProperty("--dynamic-bg");
            document.documentElement.style.removeProperty("--dynamic-fg");
            setCurrentColor("");
            return;
        }

        const updateDynamicColor = () => {
            const getCurrentSkyColor = (colors: string[]) => {
                const now = new Date();
                const totalMinutes = now.getHours() * 60 + now.getMinutes();
                const minutesPerColor = (24 * 60) / colors.length;

                let index = Math.floor(totalMinutes / minutesPerColor);
                if (index >= colors.length) index = colors.length - 1; // safety fallback

                return colors[index];
            };

            const bgColor = getCurrentSkyColor(skyColors);
            const fgColor = getContrastColor(bgColor);

            document.documentElement.setAttribute("data-dynamic-theme", "true");
            document.documentElement.style.setProperty("--dynamic-bg", bgColor);
            document.documentElement.style.setProperty("--dynamic-fg", fgColor);
            setCurrentColor(bgColor);
        };

        // Run initially
        updateDynamicColor();

        // Check every minute
        const interval = setInterval(updateDynamicColor, 60 * 1000);

        return () => clearInterval(interval);
    }, [isDynamicTheme, skyColors]);

    return { currentColor };
}
