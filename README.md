# Samboard — Privacy-First Custom Homepage

A personal, offline-first dashboard built for speed, intentionality, and user autonomy.

Samboard is a cross-device, privacy-centric homepage designed to replace noisy browser start pages with a clean, customizable, and distraction-free interface. Built with Next.js, TypeScript, Zustand, Tailwind CSS, and DaisyUI, it serves as a fast daily-driver tool that adapts to your workflow without tracking or external dependencies.

---

## Features

### Privacy-First Architecture

* Fully offline; no backend services, analytics, or trackers
* All data stored locally using browser storage
* Cross-device portability through bookmark export/import

### Smart Bookmark Manager

* Add, edit, delete, and reorder bookmarks
* Automatic favicon fetching
* Instant filtering and smart search
* Paginated grid layout for organized navigation
* Supports keyboard-driven workflows

### Keyboard-First Search

* Global search bar filters bookmarks in real time
* Enter key executes a Google search when no bookmark matches
* Auto-focus on load for rapid navigation

### Modular Widget System

* Clean digital clock widget (HH:MM, 24-hour format)
* Typography tuned for clarity with tabular numerals
* Architecture ready for additional widgets

### Custom Theming

* Light and dark themes using CSS variables
* Theme persisted locally through user preference
* Appearance settings structured for future wallpaper modes

### Export/Import Ready

* JSON-based data portability (in progress)
* Enables consistent state across multiple devices

---

## Tech Stack

| Layer            | Tools                                       |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js (App Router), TypeScript            |
| Styling          | Tailwind CSS, DaisyUI, custom CSS variables |
| State Management | Zustand                                     |
| Icons            | Heroicons                                   |
| Fonts            | Inter / Geist                               |
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

## Origin and Purpose

Samboard is designed around the idea of Ikigai, the intersection of what you love, what you are good at, what the world needs, and what provides value.

Typical browser homepages are filled with ads, recommendations, and noise. Samboard takes the opposite approach:

* No news feeds
* No tracking
* No suggestions
* No algorithmic clutter

The goal is a fast, intentional, personal homepage that prioritizes privacy and user autonomy. It acts as a stable alternative to fragile device-based customizations, ensuring your preferred UI persists across environments.

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

## Core Principles

### Minimalism

Interfaces should be intentional; unnecessary elements are avoided.

### Performance

No network calls, low re-render overhead, and instant interactions.

### Privacy

A homepage should belong to the user, not third-party systems.

### Customizability

The foundation supports expansion through widgets, appearance themes, and power-user features.

---

## Roadmap

* JSON export and import
* Global command palette (Ctrl + K)
* Keyboard shortcuts throughout the interface
* Dynamic wallpapers (plain, image, gradient, time-based)
* Additional widgets

---

## License

MIT License.
