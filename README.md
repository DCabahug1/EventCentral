# EventCentral

## Prerequisites

Install the following in order before anything else:

1. **Git** — [git-scm.com/downloads](https://git-scm.com/downloads)
2. **Node.js** (v20 LTS) — [nodejs.org](https://nodejs.org)
3. **pnpm** — open a terminal and run:
   ```bash
   npm install -g pnpm
   ```
4. **GitHub Desktop** — [desktop.github.com](https://desktop.github.com)

## Clone & Install

1. Open GitHub Desktop, sign in, and clone the EventCentral repository.
2. Once cloned, open a terminal in the project folder and run:
   ```bash
   pnpm install
   ```

## Environment Variables

Create a file named `.env.local` in the root of the project and fill in the values below. The actual values can be found in the **#documentation** channel on the team Discord.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

> `.env.local` is gitignored and will never be committed — do not share these values outside of Discord.

## Running the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page will hot-reload as you make edits.

## Branching Conventions

We use two permanent branches:

| Branch | Purpose |
| --- | --- |
| `main` | Public-facing — what users see |
| `production/main` | Team integration branch — all work merges here first |

When starting new work, always branch off of `production/main`:

| Type | Branch name |
| --- | --- |
| New feature | `feature/<name>` |
| Bug fix | `fix/<name>` |

### Workflow (GitHub Desktop)

1. Switch to `production/main` and click **Fetch origin** / **Pull** to get the latest.
2. Click **Current Branch → New Branch** and name it `feature/<name>` or `fix/<name>`.
3. Do your work, commit with a clear message, and push to origin.
4. Open a pull request on GitHub targeting `production/main`.

## TODOs

### Map View — Supabase Integration

When the map view is connected to a Supabase table, move the following filters
into the database query instead of filtering the client-side array in `lib/events.ts`:

- **Date range** — use `.gte("start_time", startDate).lte("start_time", endDate)`
- **Event type** — use `.contains("tags", [eventType])` (skip when `"all"`)

**Distance (radius) filtering stays client-side** using `distanceBetweenLocations`
in `lib/utils.ts`. A bounding-box pre-filter can optionally be added to the query
to reduce the result set before the JS distance check.
