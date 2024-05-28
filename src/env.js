import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    GOOGLE_CONTACT_FORM_URL: z.string().url(),
    CONTENTFUL_API_BASE_URL: z.string().url(),
    CONTENTFUL_API_SPACE_ID: z.string(),
    CONTENTFUL_API_ENVIRONMENT: z.string(),
    CONTENTFUL_API_ACCESS_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CONTACT_FORM_URL: process.env.GOOGLE_CONTACT_FORM_URL,
    CONTENTFUL_API_BASE_URL: process.env.CONTENTFUL_API_BASE_URL,
    CONTENTFUL_API_SPACE_ID: process.env.CONTENTFUL_API_SPACE_ID,
    CONTENTFUL_API_ENVIRONMENT: process.env.CONTENTFUL_API_ENVIRONMENT,
    CONTENTFUL_API_ACCESS_TOKEN: process.env.CONTENTFUL_API_ACCESS_TOKEN,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
