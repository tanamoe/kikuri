import { defineContentConfig, defineCollection } from "@nuxt/content";
import * as z from "zod/v3";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      source: "**/*.md",
      type: "page",
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string().optional(),
        slug: z.string(),
        date: z.date(),
      }),
    }),
  },
});
