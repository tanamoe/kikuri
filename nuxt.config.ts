// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      pocketbase_url: process.env.POCKETBASE_URL,
      search_endpoint: process.env.SEARCH_ENDPOINT,
      search_token: process.env.SEARCH_TOKEN,
    },
  },
  modules: [
    "@nuxthq/ui",
    "@nuxt/image",
    "nuxt-icon",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "nuxt-swiper",
  ],
  // https://nuxt.com/docs/getting-started/installation#prerequisites
  typescript: {
    shim: false,
    typeCheck: true,
  },
  image: {
    providers: {
      imagor: {
        provider: "~/providers/imagor",
        options: {
          baseURL: "https://apps.glhf.vn/imagor",
        },
      },
    },
  },
  googleFonts: {
    families: {
      Inter: [400, 700],
      Lexend: [700, 900],
    },
  },
  swiper: {
    modules: ["autoplay", "effect-creative"],
  },
  // TODO: remove this in the future after Netlify done fixing.
  // ref: https://answers.netlify.com/t/javascript-heap-out-of-memory-when-trying-to-build-a-nuxt-app/93138/13
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano:
        process.env.NODE_ENV === "production"
          ? { preset: ["default", { discardComments: { removeAll: true } }] }
          : false, // disable cssnano when not in production
    },
  },
  ui: {
    icons: ["fluent"],
  },
});
