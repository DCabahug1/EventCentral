## EventCentral

EventCentral is a Next.js application for browsing and managing events locally during development.

Follow these instructions to set up the project locally and complete the exercise.

> Note: This project uses the Next.js App Router and TypeScript.

## Instructions

1. Set up the project on your machine by following the steps in **Getting Started** below.
2. Implement the event card UI in `components/event/EventCard.tsx` using the existing imports and the provided `formatDate` helper.
3. Implement the events listing page in `app/test/page.tsx`:
   - Fetch events using `getEvents` from `lib/events`.
   - Store the events in React state.
   - Render a list of `EventCard` components.
4. Run the app on `http://localhost:3000` and verify that the events page behaves as expected.

## Prerequisites

- Node.js (LTS version recommended)
- npm, pnpm, yarn, or bun (choose one package manager)
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url> EventCentral
cd EventCentral
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or with your preferred package manager (pnpm, yarn, or bun).

### 3. Configure environment variables

1. Create a `.env.local` file in the project root (or copy from any example env file, if present).
2. Add any required keys and configuration values (e.g. API URLs, auth secrets, database URLs).
3. Do **not** commit `.env.local` or any `.env.*` files to version control.

> If the app fails to start, double-check that all required environment variables are present.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will start on `http://localhost:3000` by default.

Open `http://localhost:3000` in your browser to view the app.

### 5. Local development tips

- **Main entry points**:
  - `app/page.tsx` – main application entry.
  - `app/test/page.tsx` – test page for listing events.
- **Event UI**:
  - `components/event/EventCard.tsx` – card UI for individual events.
- **Data and types**:
  - `lib/events.ts` – event-related types and data fetching helpers.

Changes to files in the `app` and `components` directories will hot-reload automatically in the browser.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
