import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export type SkyColorConfig = {
    top: string;
    bottom: string;
    accent: string;
};

// Realistic sky color pairs over a 24h cycle
// const DEFAULT_SKY_COLORS: SkyColorConfig[] = [
//     { top: "#030B1C", bottom: "#081023", accent: "#3B82F6" }, // Midnight (Deep blues)
//     { top: "#081023", bottom: "#0B1D3A", accent: "#3B82F6" }, // Late Night
//     { top: "#0B1D3A", bottom: "#1A2A42", accent: "#60A5FA" }, // Pre-dawn
//     { top: "#1A2A42", bottom: "#28385E", accent: "#60A5FA" }, // Dawn
//     { top: "#28385E", bottom: "#D77B5D", accent: "#F59E0B" }, // Sunrise (Blue to Orange)
//     { top: "#4A6CA3", bottom: "#EDAE7A", accent: "#F59E0B" }, // Early Morning
//     { top: "#3B82F6", bottom: "#6AB1E7", accent: "#3B82F6" }, // Morning
//     { top: "#2563EB", bottom: "#4A90E2", accent: "#2563EB" }, // Noon
//     { top: "#1D4ED8", bottom: "#2B73C4", accent: "#2563EB" }, // Afternoon
//     { top: "#1E3A8A", bottom: "#4A6CA3", accent: "#3B82F6" }, // Late Afternoon
//     { top: "#28385E", bottom: "#E28E46", accent: "#F97316" }, // Sunset (Dark blue to warm orange)
//     { top: "#1A2A42", bottom: "#A35A4D", accent: "#EF4444" }, // Dusk
//     { top: "#0B1D3A", bottom: "#3A3B5E", accent: "#8B5CF6" }, // Evening
//     { top: "#081023", bottom: "#1F253E", accent: "#6366F1" }, // Night
// ];

const DEFAULT_SKY_COLORS: SkyColorConfig[] = [

/* Midnight → Late Night */
{ top:"#030B1C", bottom:"#081023", accent:"#3B82F6" },
{ top:"#040C1E", bottom:"#091229", accent:"#3B82F6" },
{ top:"#060E21", bottom:"#0A1630", accent:"#3B82F6" },
{ top:"#081023", bottom:"#0B1D3A", accent:"#3B82F6" },

/* Late Night → Pre-dawn */
{ top:"#081023", bottom:"#0B1D3A", accent:"#3B82F6" },
{ top:"#09132C", bottom:"#142241", accent:"#60A5FA" },
{ top:"#0A1733", bottom:"#172646", accent:"#60A5FA" },
{ top:"#0B1D3A", bottom:"#1A2A42", accent:"#60A5FA" },

/* Pre-dawn → Dawn */
{ top:"#0B1D3A", bottom:"#1A2A42", accent:"#60A5FA" },
{ top:"#122347", bottom:"#1F304E", accent:"#60A5FA" },
{ top:"#162851", bottom:"#24365A", accent:"#60A5FA" },
{ top:"#1A2A42", bottom:"#28385E", accent:"#60A5FA" },

/* Dawn → Sunrise */
{ top:"#1A2A42", bottom:"#28385E", accent:"#60A5FA" },
{ top:"#22315A", bottom:"#7B5B58", accent:"#F59E0B" },
{ top:"#26356B", bottom:"#B86B5A", accent:"#F59E0B" },
{ top:"#28385E", bottom:"#D77B5D", accent:"#F59E0B" },

/* Sunrise → Early Morning */
{ top:"#28385E", bottom:"#D77B5D", accent:"#F59E0B" },
{ top:"#385181", bottom:"#E18F6B", accent:"#F59E0B" },
{ top:"#436297", bottom:"#E8A076", accent:"#F59E0B" },
{ top:"#4A6CA3", bottom:"#EDAE7A", accent:"#F59E0B" },

/* Early Morning → Morning */
{ top:"#4A6CA3", bottom:"#EDAE7A", accent:"#F59E0B" },
{ top:"#4A7ACF", bottom:"#9FC3E0", accent:"#3B82F6" },
{ top:"#4381E8", bottom:"#7DBAE4", accent:"#3B82F6" },
{ top:"#3B82F6", bottom:"#6AB1E7", accent:"#3B82F6" },

/* Morning → Noon */
{ top:"#3B82F6", bottom:"#6AB1E7", accent:"#3B82F6" },
{ top:"#3578F1", bottom:"#5DA3E4", accent:"#2563EB" },
{ top:"#2F6EEB", bottom:"#5297E3", accent:"#2563EB" },
{ top:"#2563EB", bottom:"#4A90E2", accent:"#2563EB" },

/* Noon → Afternoon */
{ top:"#2563EB", bottom:"#4A90E2", accent:"#2563EB" },
{ top:"#235BE2", bottom:"#3F86D9", accent:"#2563EB" },
{ top:"#214FD9", bottom:"#357BD0", accent:"#2563EB" },
{ top:"#1D4ED8", bottom:"#2B73C4", accent:"#2563EB" },

/* Afternoon → Late Afternoon */
{ top:"#1D4ED8", bottom:"#2B73C4", accent:"#2563EB" },
{ top:"#1E47C3", bottom:"#3C70B5", accent:"#3B82F6" },
{ top:"#1E41A5", bottom:"#436BAA", accent:"#3B82F6" },
{ top:"#1E3A8A", bottom:"#4A6CA3", accent:"#3B82F6" },

/* Late Afternoon → Sunset */
{ top:"#1E3A8A", bottom:"#4A6CA3", accent:"#3B82F6" },
{ top:"#243F7D", bottom:"#A97A6D", accent:"#F97316" },
{ top:"#273F6F", bottom:"#C98455", accent:"#F97316" },
{ top:"#28385E", bottom:"#E28E46", accent:"#F97316" },

/* Sunset → Dusk */
{ top:"#28385E", bottom:"#E28E46", accent:"#F97316" },
{ top:"#22325A", bottom:"#C77248", accent:"#EF4444" },
{ top:"#1E2E4F", bottom:"#B56549", accent:"#EF4444" },
{ top:"#1A2A42", bottom:"#A35A4D", accent:"#EF4444" },

/* Dusk → Evening */
{ top:"#1A2A42", bottom:"#A35A4D", accent:"#EF4444" },
{ top:"#16253F", bottom:"#6E5060", accent:"#8B5CF6" },
{ top:"#10203D", bottom:"#514567", accent:"#8B5CF6" },
{ top:"#0B1D3A", bottom:"#3A3B5E", accent:"#8B5CF6" },

/* Evening → Night */
{ top:"#0B1D3A", bottom:"#3A3B5E", accent:"#8B5CF6" },
{ top:"#091936", bottom:"#2F3254", accent:"#6366F1" },
{ top:"#081431", bottom:"#252B49", accent:"#6366F1" },
{ top:"#081023", bottom:"#1F253E", accent:"#6366F1" },

/* Night → Midnight Loop */
{ top:"#081023", bottom:"#1F253E", accent:"#6366F1" },
{ top:"#060E28", bottom:"#182037", accent:"#3B82F6" },
{ top:"#050D22", bottom:"#10182E", accent:"#3B82F6" },
{ top:"#030B1C", bottom:"#081023", accent:"#3B82F6" }

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
