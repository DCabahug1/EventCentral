export const PROFILE_UPDATED_EVENT = "eventcentral:profile-updated";

export function dispatchProfileUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}
