/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {};

// Injected content via Sentry wizard below
import { withSentryConfig } from "@sentry/nextjs";

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(config, {
  org: "macintushar",
  project: "simpli-fi",

  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
