/** Fixed radius in miles for discover near me searches. */
export const DISCOVER_NEAR_ME_RADIUS_MILES = 10;

/** Client side pagination for the happening now rail. */
export const DISCOVER_PAGE_SIZE_HAPPENING = 4;

/** Client side pagination for the all events grid tabs. */
export const DISCOVER_PAGE_SIZE_GRID = 8;

export type DiscoverRegionBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};
