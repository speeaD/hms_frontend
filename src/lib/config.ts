
// Same env var as the guest-facing confirmation page — one Express API
// base URL for the whole app. Server-side only, never sent to the browser.
export const API_BASE_URL = process.env.BACKEND_URL;

export function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL is not configured. Set it in your environment — see .env.example."
    );
  }
  return API_BASE_URL;
}

// Route mount points on your Express API. Adjust here if yours differ —
// everything else references these constants rather than hardcoding paths.
export const RESERVATIONS_PATH = "v1/reservation/";
// ASSUMPTION: reservationController.js doesn't include a rooms listing
// endpoint, so this assumes a conventional `GET /rooms` route exists.
// Update this if your actual mount point is different.
export const ROOMS_PATH = "v1/room/";
