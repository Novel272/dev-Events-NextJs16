import posthog from "posthog-js"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (!POSTHOG_KEY) {
  console.warn(
    'NEXT_PUBLIC_POSTHOG_KEY is not set; PostHog analytics will be disabled.',
  );
} else {
  posthog.init(POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking
    debug: process.env.NODE_ENV === "development",
  });
}
