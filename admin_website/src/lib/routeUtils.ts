export function extractRouteId(paramId: any, segmentName: string): string {
  if (typeof window !== "undefined") {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const idx = segments.indexOf(segmentName);
    if (idx !== -1 && segments[idx + 1] && segments[idx + 1] !== "preview") {
      return decodeURIComponent(segments[idx + 1]);
    }
    // Also check last segment if segmentName is not found or matches URL pattern
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      if (last !== "preview" && last !== segmentName && last !== "edit" && last !== "add") {
        return decodeURIComponent(last);
      }
    }
  }
  const clean = typeof paramId === "string" ? paramId : Array.isArray(paramId) ? paramId[0] : "";
  return clean && clean !== "preview" ? clean : "";
}
