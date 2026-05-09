import { describe, it, expect } from "vitest";
import {
  cn,
  formatCount,
  imageSizeError,
  todayDateString,
  daysFromNowDateString,
  addOneYear,
  distanceBetweenLocations,
  phoneDigitsForTel,
  formatUsPhoneDisplay,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("formatCount", () => {
  it("formats zero", () => {
    expect(formatCount(0)).toBe("0");
  });

  it("formats thousands with comma", () => {
    expect(formatCount(1500)).toBe("1,500");
  });

  it("formats millions", () => {
    expect(formatCount(1000000)).toBe("1,000,000");
  });
});

describe("imageSizeError", () => {
  const MB5 = 5 * 1024 * 1024;

  it("returns null for file under 5 MB", () => {
    const file = new File([new Uint8Array(1)], "small.jpg");
    expect(imageSizeError(file)).toBeNull();
  });

  it("returns null for file exactly at 5 MB", () => {
    const file = new File([new Uint8Array(MB5)], "exact.jpg");
    expect(imageSizeError(file)).toBeNull();
  });

  it("returns error string for file over 5 MB", () => {
    const file = new File([new Uint8Array(MB5 + 1)], "big.jpg");
    expect(imageSizeError(file)).toBe("Image must be 5MB or smaller.");
  });
});

describe("todayDateString", () => {
  it("returns a YYYY-MM-DD string equal to today's UTC date", () => {
    const result = todayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe(new Date().toISOString().split("T")[0]);
  });
});

describe("daysFromNowDateString", () => {
  it("zero days returns today's UTC date string", () => {
    expect(daysFromNowDateString(0)).toBe(new Date().toISOString().split("T")[0]);
  });

  it("positive days returns a later date string", () => {
    expect(daysFromNowDateString(10) > daysFromNowDateString(0)).toBe(true);
  });
});

describe("addOneYear", () => {
  it("adds exactly one year to a date", () => {
    expect(addOneYear("2024-03-15")).toBe("2025-03-15");
  });

  it("handles Feb 28 → Feb 28 next year", () => {
    expect(addOneYear("2024-02-28")).toBe("2025-02-28");
  });
});

describe("distanceBetweenLocations", () => {
  it("returns 0 for identical coordinates", () => {
    expect(distanceBetweenLocations(0, 0, 0, 0)).toBe(0);
  });

  it("returns approx correct distance between NYC and LA", () => {
    const miles = distanceBetweenLocations(40.7128, -74.006, 34.0522, -118.2437);
    expect(miles).toBeGreaterThan(2430);
    expect(miles).toBeLessThan(2460);
  });
});

describe("phoneDigitsForTel", () => {
  it("strips formatting and returns 10 digits", () => {
    expect(phoneDigitsForTel("(555) 123-4567")).toBe("5551234567");
  });

  it("strips country code 1 from 11-digit number", () => {
    expect(phoneDigitsForTel("15551234567")).toBe("5551234567");
  });
});

describe("formatUsPhoneDisplay", () => {
  it("formats a 10-digit string as (XXX) XXX-XXXX", () => {
    expect(formatUsPhoneDisplay("5551234567")).toBe("(555) 123-4567");
  });
});
