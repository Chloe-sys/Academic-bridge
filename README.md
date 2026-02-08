# Klaboard — Task Manager Application

A modern, responsive task management application built with **React 19**, **TypeScript**, and **Tailwind CSS**. Designed to demonstrate front-end mastery across UI design, state management, data fetching, testing, and deployment.

---

## Live Demo

> _Deploy link will be added after deployment to Netlify._

---

## Screenshots

The application faithfully follows the provided design mockups with three task views (Kanban, List, Timeline), a collapsible sidebar, settings page, dark theme support, and full i18n.

image.png 
image.png
image.png
---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS v4, tailwindcss-animate, class-variance-authority |
| **UI Components** | Radix UI (Shadcn-style) — Dialog, Select, Dropdown, Avatar, Tooltip, etc. |
| **State Management** | Zustand (with localStorage persistence) |
| **Server State** | TanStack Query (React Query) v5 |
| **Table** | TanStack Table v8 |
| **Routing** | React Router DOM v7 |
| **Forms** | React Hook Form |
| **Drag & Drop** | dnd-kit |
| **Icons** | Lucide React |
| **Dates** | date-fns |
| **i18n** | i18next + react-i18next (English & French) |
| **API** | [DummyJSON Todos](https://dummyjson.com/docs/todos) for all CRUD operations |
| **Unit Testing** | Vitest + React Testing Library + jest-dom |
| **E2E Testing** | Playwright |

---

## Features

### Core
- **Kanban Board** — Drag-and-drop cards between columns (To-do, On Progress, Need Review, Done)
- **List View** — Grouped table with checkboxes, status badges, attachment pills, and avatars
- **Timeline/Calendar View** — Weekly grid with row-packed task cards, priority-coloured borders, and a "today" indicator
- **CRUD Operations** — Create, read, update, and delete tasks via DummyJSON API
- **Search & Filter** — Real-time search across task titles and descriptions
- **Responsive Design** — Works on mobile (360px), tablet, and desktop

### Bonus
- **Dark Theme** — Full dark mode with a designer colour palette (Light / Dark / System)
- **i18n** — English and French translations
- **Shadcn-style UI** — Built on Radix UI primitives with tailwind-merge
- **Drag & Drop** — Kanban cards with optimistic status updates
- **GitHub Actions** — CI pipeline that runs unit tests, E2E tests, lint, and build on PR events

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Academic_bridge

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server (default: http://localhost:5173)
npm run dev
```

### Build for Production

```bash
# Type-check + build
npm run build

# Preview the production build locally
npm run preview
```

---

## Running Tests

### Unit & Component Tests (Vitest)

```bash
# Run all unit tests in watch mode
npm test

# Run once with coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui
```

---

## Project Structure

```
src/
├── api/
│   └── taskApi.ts          # DummyJSON API integration + in-memory cache
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Breadcrumb bar, view tabs, search, filters
│   │   ├── Layout.tsx       # Shell with collapsible sidebar + outlet
│   │   └── Sidebar.tsx      # Navigation, shared pages, upgrade card
│   ├── tasks/
│   │   ├── CalendarView.tsx # Weekly timeline with row-packed cards
│   │   ├── KanbanBoard.tsx  # Drag-and-drop board with dnd-kit
│   │   ├── KanbanColumn.tsx # Individual Kanban column
│   │   ├── ListView.tsx     # Grouped table view
│   │   ├── TaskCard.tsx     # Kanban card with checklist progress
│   │   ├── TaskForm.tsx     # Create/Edit modal (react-hook-form)
│   │   └── SortableTaskCard.tsx # dnd-kit sortable wrapper
│   └── ui/                  # Shadcn-style base components (button, input, etc.)
├── hooks/
│   └── useTasks.ts          # TanStack Query hooks for CRUD + optimistic updates
├── i18n/
│   ├── index.ts             # i18next configuration
│   └── locales/
│       ├── en.json          # English translations
│       └── fr.json          # French translations
├── lib/
│   └── utils.ts             # cn(), formatDate(), generateId()
├── pages/
│   ├── TasksPage.tsx        # Main page — renders Header + active view
│   └── SettingsPage.tsx     # Theme + Language settings
├── store/
│   ├── taskStore.ts         # Zustand store for tasks, view mode, search
│   └── themeStore.ts        # Zustand store for theme preference
├── test/
│   ├── setup.ts             # Vitest setup (jest-dom matchers)
│   └── utils.tsx            # Render helper with providers
├── types/
│   └── index.ts             # TypeScript interfaces and type aliases
├── App.tsx                  # Root component (providers + routes)
├── main.tsx                 # Entry point (ReactDOM.createRoot)
└── index.css                # Tailwind imports + CSS custom properties
```

---

## API Integration

All CRUD operations use the [DummyJSON Todos API](https://dummyjson.com/docs/todos):

| Operation | Endpoint | Method |
|---|---|---|
| Fetch all | `GET /todos?limit=15` | GET |
| Create | `POST /todos/add` | POST |
| Update | `PUT /todos/:id` | PUT |
| Delete | `DELETE /todos/:id` | DELETE |

> **Note:** DummyJSON simulates responses but doesn't persist data server-side. An in-memory cache layer keeps mutations consistent within a session.

---

## Deployment (Netlify)

1. Push to GitHub
2. Connect the repo on [Netlify](https://app.netlify.com)
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. A `netlify.toml` file is included for SPA redirect support.

---

## Design Decisions

- **Zustand over Redux** — Minimal boilerplate for a project this size; persists view mode only
- **TanStack Query** — Handles caching, refetching, and optimistic mutations cleanly
- **In-memory API cache** — DummyJSON doesn't persist, so local cache bridges the gap
- **Row-packing algorithm** — Custom layout logic in CalendarView prevents overlapping task cards
- **Class-based dark mode** — `@custom-variant dark` in Tailwind v4 for reliable theming

---

## License

This project was built as a technical assessment and is not licensed for production use.
