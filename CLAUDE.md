# EventCentral – Coding Rules

## Layout Spacing

- Prefer **flex/grid `gap`** (and container padding) for space **between** siblings.
- Minimize directional margin and padding (`mt-*`, `mb-*`, `ml-*`, `mr-*`, `pt-*`, `pb-*`, `pl-*`, `pr-*`). Use them only when necessary, for example one-off offsets, overlapping layers, or markup you cannot wrap in a flex/grid parent.
- When spacing belongs on the **container** (padding on all sides or symmetric horizontal/vertical), prefer **`p-*`**, **`px-*`**, or **`py-*`** on the container instead of per-child directional margins.

**Prefer**

```tsx
<div className="flex flex-col gap-4">
  <Card />
  <Card />
</div>
```

**Avoid (for spacing between siblings)**

```tsx
<div className="flex flex-col">
  <Card className="mb-4" />
  <Card />
</div>
```

---

## Page Structure and Reorganization

### Next.js async `params` / `searchParams`

In Next.js 15+, `params` and `searchParams` on pages/layouts are **Promises**. **Server Components:** `await params`. **`"use client"` pages:** unwrap with **`use(params)`** from React, type props as `params: Promise<{ ... }>` and do not read properties synchronously (avoids sync dynamic API / enumeration warnings).

### Goals

- **Route files** (`app/**/page.tsx`, `layout.tsx`) stay **readable**: routing, data loading, URL/search params, client state, and wiring handlers, not long JSX trees or repeated markup.
- **UI and layout** for a feature live under **`components/<feature>/`** with **one main concern per file** (e.g. `OrganizationBanner.tsx`, `OrganizationProfileHeader.tsx`).
- **Reusable logic** that is not UI (constants, pure helpers, type guards) belongs in **`lib/`**, co-located by domain when it only serves one feature.

### When a page file grows

1. Extract **presentational sections** into `components/<feature>/<Name>.tsx`. Pass data and callbacks as props; avoid fetching inside leaf components unless that fetch is truly local and reusable.
2. Extract **dialogs and modals** (including `AlertDialog` for destructive confirms) into their own components in the same folder.
3. Extract **loading skeletons** that mirror the page layout into `<Feature>PageSkeleton.tsx` (or similar) in the same folder.
4. Keep **page-level** concerns in the page: route params via **`use(params)`** or `await params`, `useRouter`, `useState` for resource IDs and mutation state, `useEffect` for load/sync, submit/delete handlers, and composition of the extracted components.

### Naming

- Use **PascalCase** filenames matching the default export: `OrganizationEventsTabs.tsx` exports `OrganizationEventsTabs`.
- Prefer a **clear prefix** shared by the feature (`Organization*`) so imports stay obvious in large apps.

### Imports

- Pages import from `@/components/<feature>/...` and `@/lib/...`.
- Do not re-export large chunks of UI from `page.tsx` inline; move them to `components/` instead.

### Checklist before merging a split

- No duplicate helpers between `page.tsx` and `lib/` (single source of truth).
- `pnpm exec tsc --noEmit` passes.
- Loading and error states still render the same skeletons/messages as before.
