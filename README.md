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
- Keyboard-friendly navigation

### Theming

- Light and dark themes
- Theme preference persisted locally

### Widgets

- Digital clock (24-hour format)
- Modular structure for additional widgets

### Data Portability

- JSON-based export/import structure (planned)

---

## Engineering Decisions

- Used **Zustand** for predictable, centralized state management without prop drilling
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
├── components/
│   ├── widgets/
│   │   ├── ClockWidget.tsx
│   │   └── SearchBar.tsx
│   ├── grid/
│   │   ├── BookmarkGrid.tsx
│   │   └── BookmarkPagination.tsx
│   └── modals/
│       ├── AddBookmarkModal.tsx
│       ├── EditBookmarkModal.tsx
│       └── SettingsModal.tsx
├── stores/
│   ├── bookmarkStore.ts
│   └── settingsStore.ts
├── app/
│   ├── page.tsx
│   └── layout.tsx
└── styles/
    └── globals.css
```

---

## Running Locally

```bash
git clone https://github.com/Samcoder-22/Samboard.git
cd samboard
npm install
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## Roadmap

- JSON export and import
- Additional widgets
- Dynamic wallpapers
- Extended keyboard shortcuts

---

## License

MIT License
