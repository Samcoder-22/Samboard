# Samboard — Privacy-First Custom Homepage

Samboard is an offline-first browser homepage built with Next.js and TypeScript.  
It replaces default start pages with a fast, minimal, and fully local dashboard.

All data is stored in the browser. No backend, no analytics, no external services.

Live: https://samboard.vercel.app/

---

## Features

### Offline-First Architecture

- Fully client-side application
- No backend services or network calls
- All data persisted using localStorage

### Bookmark Management

- Add, edit, delete, and reorder bookmarks
- Automatic favicon fetching
- Instant search and filtering
- Paginated grid layout (handles 100+ bookmarks)
- Keyboard-friendly navigation (shortcuts like `/` to focus search)

### Personalized Search

- **Search History**: Local storage of past queries
- **Smart Suggestions**: Fastest access to frequent searches (requires 3+ characters)
- **Incognito Mode**: Toggle to disable history tracking for private sessions
- **Direct Navigation**: Type `.com` to jump straight to a website

### Theming

- **Light and Dark Themes**: Classic toggleable modes
- **Dynamic Sky Theme**: Interactive background that changes color based on the time of day (24h cycle)
- **Automatic Contrast**: Text colors adjust dynamically for readability against sky gradients

### Data Portability

- **JSON Export**: Download your bookmarks as a structured JSON file
- **Local Persistence**: All settings and history are stored safely in your browser

---

## Engineering Decisions

- Used **Zustand** for predictable, centralized state management without prop drilling
- **Time-based Gradient Engine**: Implemented a custom hook to calculate sky colors and contrast ratios in real-time
- **Privacy-First Search**: Implemented a local-only search history store with incognito support
- Separated UI components from state logic for maintainability
- Implemented pagination to prevent performance degradation with large bookmark sets
- Designed stores to remain serializable for future export/import support
- Avoided external APIs to maintain zero-dependency architecture

---

## Tech Stack

| Layer            | Tools                                       |
|------------------|---------------------------------------------|
| Framework        | Next.js (App Router), TypeScript            |
| Styling          | Tailwind CSS, DaisyUI, CSS variables        |
| State Management | Zustand                                     |
| Icons            | Heroicons                                   |
| Storage          | localStorage                                |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── grid/
│   │   ├── BookmarkGrid.tsx
│   │   └── BookmarkPagination.tsx
│   ├── layout/
│   │   └── MainLayout.tsx
│   ├── modals/
│   │   ├── AddBookmarkModal.tsx
│   │   ├── EditBookmarkModal.tsx
│   │   └── SettingsModal.tsx
│   └── widgets/
│       ├── ClockWidget.tsx
│       └── SearchBar.tsx
├── hooks/
│   └── useDynamicTheme.ts
├── lib/
│   ├── bookmarkIO.ts
│   └── storage.ts
├── stores/
│   ├── bookmarkStore.ts
│   ├── settingsStore.ts
│   └── useSearchHistoryStore.ts
└── styles/
    └── globals.css
```

---

## Running Locally

```bash
git clone https://github.com/Samcoder-22/Samboard.git
cd Samboard
npm install
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## Roadmap

- [x] JSON Export
- [ ] JSON Import
- [ ] Additional widgets (Weather, RSS)
- [ ] Dynamic wallpapers (User uploads)
- [ ] Extended keyboard shortcuts

---

## License

MIT License
