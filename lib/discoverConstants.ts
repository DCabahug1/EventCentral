/** Fixed radius (miles) for discover "Near me" — not exposed in the UI. */
export const DISCOVER_NEAR_ME_RADIUS_MILES = 10;

/** Client-side pagination: Happening Now horizontal rail. */
export const DISCOVER_PAGE_SIZE_HAPPENING = 4;

/** Client-side pagination: All Events grid (Upcoming / Past tabs). */
export const DISCOVER_PAGE_SIZE_GRID = 8;

export type DiscoverRegionBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};
