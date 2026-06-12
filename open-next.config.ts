// OpenNext Cloudflare adapter config.
// Incremental cache is left at the default (no R2 bucket required for first deploy).
// To enable R2-backed ISR caching later, add the NEXT_INC_CACHE_R2_BUCKET binding in
// wrangler.jsonc and wire r2IncrementalCache here. See https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
