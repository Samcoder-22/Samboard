<img width="4606" height="2416" alt="image" src="https://github.com/user-attachments/assets/8a332998-3161-47f4-91bc-3c81a728d29d" />

# Samboard — Privacy-First Custom Homepage

Samboard is an local first browser homepage built with Next.js and TypeScript  
It replaces default start pages with a minimal and fully minimal and fully local homepage

All data is stored in the browser. No backend, no analytics, no external services.

Live: https://samboard.vercel.app/

---

## Features

### Local-First Architecture

- Fully client-side application
- No backend services or network calls
- All data persisted using localStorage

### Bookmark Management

- Add, edit, delete, and reorder bookmarks
- Automatic favicon fetching
- Instant search and filtering
- Paginated grid layout (handles 100+ bookmarks)
- Keyboard-friendly navigation (shortcuts like '/' to focus search, shift + enter for first bookmark)

### Personalized Search

- **Search History**: Local storage of past queries
- **Smart Suggestions**: Suggestions from locally stored history (3+ chars)
- **Incognito Mode**: Toggle to disable history tracking 
- **Direct Navigation**: Type '.com' or 'https://' to jump straight to a website

### Theming

- **Light and Dark Themes**: Classic toggleable modes
- **Dynamic Sky Theme**: Interactive background that changes color based on the time of day (24h cycle)
- **Automatic Contrast**: Text colors adjust dynamically for readability against sky gradients

### Data Portability

- **JSON Export**: Download your bookmarks as a structured JSON file, planning for import as well
- **Local Persistence**: All settings and history are stored safely in your browser

---

## Engineering Decisions

- Used Zustand to keep bookmarks, search history and settings modular without Redux overhead.
- **Time-based Gradient Engine**: Implemented custom hook to calculate sky colors and contrast ratios in realtime
- **Privacy-First Search**: Implemented local only search history store with incognito (see the left icon to 3 dots)
- Separated UI components from state logic for maintainability
- Implemented pagination to prevent performance degradation with large bookmark sets
- Designed stores to remain serializable for future export/import support
- Avoided external APIs to keep everything local and portable.

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
├── components/
├── hooks/
├── lib/
├── stores/
└── styles/
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

## License

MIT License
