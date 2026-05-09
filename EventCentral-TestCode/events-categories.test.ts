import { describe, it, expect } from "vitest";
import {
  DEFAULT_EVENT_CATEGORY,
  CATEGORY_CONFIG,
  SEARCH_CATEGORY_CONFIG,
  getCategoryConfig,
} from "@/lib/events/categories";

describe("DEFAULT_EVENT_CATEGORY", () => {
  it("equals 'Other'", () => {
    expect(DEFAULT_EVENT_CATEGORY).toBe("Other");
  });
});

describe("CATEGORY_CONFIG", () => {
  it("contains 8 entries", () => {
    expect(CATEGORY_CONFIG.length).toBe(8);
  });

  it("first entry is the default category", () => {
    expect(CATEGORY_CONFIG[0].label).toBe(DEFAULT_EVENT_CATEGORY);
  });

  it("every entry has non-empty label, colorClass, and an icon function", () => {
    for (const { label, colorClass, icon } of CATEGORY_CONFIG) {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
      expect(typeof colorClass).toBe("string");
      expect(colorClass.length).toBeGreaterThan(0);
      expect(icon).toBeTruthy();
    }
  });
});

describe("SEARCH_CATEGORY_CONFIG", () => {
  it("excludes the default 'Other' category", () => {
    expect(SEARCH_CATEGORY_CONFIG.some((c) => c.label === DEFAULT_EVENT_CATEGORY)).toBe(false);
  });

  it("contains exactly 7 entries", () => {
    expect(SEARCH_CATEGORY_CONFIG.length).toBe(7);
  });
});

describe("getCategoryConfig", () => {
  it("returns matching config for known label 'Music'", () => {
    const config = getCategoryConfig("Music");
    expect(config?.label).toBe("Music");
  });

  it("returns undefined for unknown label", () => {
    expect(getCategoryConfig("Unknown")).toBeUndefined();
  });
});
