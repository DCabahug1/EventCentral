# EventCentral Test Results

Run via `pnpm test` (Vitest 4.1.5, Node environment).

---

## utils.test.ts

| # | Test | Expected | Actual |
|---|------|----------|--------|
| 1 | `cn` — merges class strings | `"a b"` | `"a b"` ✅ |
| 2 | `cn` — deduplicates conflicting Tailwind classes | `"p-8"` | `"p-8"` ✅ |
| 3 | `cn` — ignores falsy values | `"a b"` | `"a b"` ✅ |
| 4 | `formatCount` — formats zero | `"0"` | `"0"` ✅ |
| 5 | `formatCount` — formats thousands with comma | `"1,500"` | `"1,500"` ✅ |
| 6 | `formatCount` — formats millions | `"1,000,000"` | `"1,000,000"` ✅ |
| 7 | `imageSizeError` — returns null for file under 5 MB | `null` | `null` ✅ |
| 8 | `imageSizeError` — returns null for file exactly at 5 MB | `null` | `null` ✅ |
| 9 | `imageSizeError` — returns error string for file over 5 MB | `"Image must be 5MB or smaller."` | `"Image must be 5MB or smaller."` ✅ |
| 10 | `todayDateString` — returns YYYY-MM-DD matching today's UTC date | Matches `/^\d{4}-\d{2}-\d{2}$/` and equals `new Date().toISOString().split("T")[0]` | ✅ |
| 11 | `daysFromNowDateString` — zero days returns today | Equals today's UTC date string | ✅ |
| 12 | `daysFromNowDateString` — positive days returns a later date | `daysFromNowDateString(10) > daysFromNowDateString(0)` | `true` ✅ |
| 13 | `addOneYear` — adds exactly one year | `"2025-03-15"` | `"2025-03-15"` ✅ |
| 14 | `addOneYear` — handles Feb 28 → Feb 28 next year | `"2025-02-28"` | `"2025-02-28"` ✅ |
| 15 | `distanceBetweenLocations` — same point returns 0 | `0` | `0` ✅ |
| 16 | `distanceBetweenLocations` — NYC → LA approx 2445 miles | Between `2430` and `2460` | `~2445` ✅ |
| 17 | `phoneDigitsForTel` — strips formatting | `"5551234567"` | `"5551234567"` ✅ |
| 18 | `phoneDigitsForTel` — strips country code 1 from 11-digit | `"5551234567"` | `"5551234567"` ✅ |
| 19 | `formatUsPhoneDisplay` — formats 10-digit string | `"(555) 123-4567"` | `"(555) 123-4567"` ✅ |

---

## events-status.test.ts

| # | Test | Expected | Actual |
|---|------|----------|--------|
| 1 | `getEventStatus` — CANCELLED=true | `"CANCELLED"` | `"CANCELLED"` ✅ |
| 2 | `getEventStatus` — future start | `"UPCOMING"` | `"UPCOMING"` ✅ |
| 3 | `getEventStatus` — past start, future end | `"STARTED"` | `"STARTED"` ✅ |
| 4 | `getEventStatus` — both start and end in past | `"ENDED"` | `"ENDED"` ✅ |
| 5 | `getEventStatus` — CANCELLED=true overrides past times | `"CANCELLED"` | `"CANCELLED"` ✅ |
| 6 | `EVENT_STATUS_CONFIG` — has all four status keys | `["CANCELLED","ENDED","STARTED","UPCOMING"]` | ✅ |
| 7 | `EVENT_STATUS_CONFIG` — UPCOMING label | `"Upcoming"` | `"Upcoming"` ✅ |
| 8 | `EVENT_STATUS_CONFIG` — STARTED label | `"Live"` | `"Live"` ✅ |
| 9 | `EVENT_STATUS_CONFIG` — every entry has non-empty className | `length > 0` for all 4 | ✅ |

---

## events-categories.test.ts

| # | Test | Expected | Actual |
|---|------|----------|--------|
| 1 | `DEFAULT_EVENT_CATEGORY` — equals `"Other"` | `"Other"` | `"Other"` ✅ |
| 2 | `CATEGORY_CONFIG` — contains 8 entries | `8` | `8` ✅ |
| 3 | `CATEGORY_CONFIG` — first entry is the default category | `"Other"` | `"Other"` ✅ |
| 4 | `CATEGORY_CONFIG` — every entry has non-empty label, colorClass, and truthy icon | All truthy | ✅ |
| 5 | `SEARCH_CATEGORY_CONFIG` — excludes `"Other"` | No entry with label `"Other"` | ✅ |
| 6 | `SEARCH_CATEGORY_CONFIG` — contains exactly 7 entries | `7` | `7` ✅ |
| 7 | `getCategoryConfig` — returns matching config for `"Music"` | `{ label: "Music", ... }` | ✅ |
| 8 | `getCategoryConfig` — returns undefined for unknown label | `undefined` | `undefined` ✅ |

---

## events-page.test.ts

| # | Test | Expected | Actual |
|---|------|----------|--------|
| 1 | `isEvent` — true for numeric id + string title | `true` | `true` ✅ |
| 2 | `isEvent` — true for numeric-string id + string title | `true` | `true` ✅ |
| 3 | `isEvent` — false for null | `false` | `false` ✅ |
| 4 | `isEvent` — false for object missing id | `false` | `false` ✅ |
| 5 | `isEvent` — false for non-string title | `false` | `false` ✅ |
| 6 | `isEvent` — false for empty-string id | `false` | `false` ✅ |
| 7 | `isEvent` — false for plain string primitive | `false` | `false` ✅ |

---

## Summary

| File | Tests | Passed | Failed |
|---|---|---|---|
| utils.test.ts | 19 | 19 | 0 |
| events-status.test.ts | 9 | 9 | 0 |
| events-categories.test.ts | 8 | 8 | 0 |
| events-page.test.ts | 7 | 7 | 0 |
| **Total** | **43** | **43** | **0** |

Run duration: ~225ms
