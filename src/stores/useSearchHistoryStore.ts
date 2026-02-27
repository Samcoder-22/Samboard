import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SearchHistoryItem {
    id: string; // uuid or query-timestamp
    query: string;
    timestamp: number;
}

interface SearchHistoryState {
    history: SearchHistoryItem[];
    addSearchRecord: (query: string) => void;
    clearHistory: () => void;
    removeSearchRecord: (id: string) => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
    persist(
        (set) => ({
            history: [],
            addSearchRecord: (query) =>
                set((state) => {
                    const trimmedQuery = query.trim();
                    if (!trimmedQuery) return state;

                    // Check if an identical query already exists
                    const existingIndex = state.history.findIndex(
                        (item) => item.query.toLowerCase() === trimmedQuery.toLowerCase()
                    );

                    const newItem: SearchHistoryItem = {
                        id: existingIndex !== -1 ? state.history[existingIndex].id : crypto.randomUUID(),
                        query: trimmedQuery,
                        timestamp: Date.now(),
                    };

                    const newHistory = [...state.history];

                    if (existingIndex !== -1) {
                        // Update timestamp of existing and move it to "top" visually by just updating the array
                        newHistory[existingIndex] = newItem;
                    } else {
                        // Add new
                        newHistory.push(newItem);
                    }

                    return { history: newHistory };
                }),
            clearHistory: () => set({ history: [] }),
            removeSearchRecord: (id) =>
                set((state) => ({
                    history: state.history.filter((item) => item.id !== id)
                })),
        }),
        {
            name: "search-history-storage",
        }
    )
);
