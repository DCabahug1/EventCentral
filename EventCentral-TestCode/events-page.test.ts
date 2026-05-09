import { describe, it, expect } from "vitest";
import { isEvent } from "@/lib/events/page";

describe("isEvent", () => {
  it("returns true for object with numeric id and string title", () => {
    expect(isEvent({ id: 1, title: "Concert" })).toBe(true);
  });

  it("returns true for object with numeric-string id and string title", () => {
    expect(isEvent({ id: "42", title: "Festival" })).toBe(true);
  });

  it("returns false for null", () => {
    expect(isEvent(null)).toBe(false);
  });

  it("returns false for object missing id", () => {
    expect(isEvent({ title: "No Id" })).toBe(false);
  });

  it("returns false for object with non-string title", () => {
    expect(isEvent({ id: 1, title: 99 })).toBe(false);
  });

  it("returns false for object with empty-string id", () => {
    expect(isEvent({ id: "", title: "Empty" })).toBe(false);
  });

  it("returns false for a plain string", () => {
    expect(isEvent("event")).toBe(false);
  });
});
