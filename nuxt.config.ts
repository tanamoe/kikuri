// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    ghost: {
      url: process.env.GHOST_URL,
      key: process.env.GHOST_KEY,
    },
    public: {
      pocketbase_url: process.env.POCKETBASE_URL,
      search_endpoint: process.env.SEARCH_ENDPOINT,
      search_token: process.env.SEARCH_TOKEN,
      image_endpoint: process.env.IMAGE_ENDPOINT,
      blog_url: process.env.BLOG_URL,
    },
  },
  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "@nuxthq/ui",
    "nuxt-swiper",
  ],
  // https://nuxt.com/docs/getting-started/installation#prerequisites
  typescript: {
    strict: true,
    shim: false,
    typeCheck: true,
  },
  routeRules: {
    "/": { prerender: true, isr: 3600 },
    "/calendar": { prerender: true, isr: true },
  },
  image: {
    provider: "pocketbase",
    providers: {
      imagor: {
        provider: "~/providers/imagor",
        options: {
          baseURL: "https://apps.glhf.vn/imagor",
        },
      },
      pocketbase: {
        provider: "~/providers/pocketbase",
        options: {
          baseURL: "https://pb.tana.moe/api/files",
        },
      },
    },
  },
  googleFonts: {
    families: {
      Inter: [400, 700],
      Lexend: [700, 900],
      "IBM+Plex+Sans+Condensed": [700, 900],
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
    icons: ["fluent", "simple-icons"],
  },
  i18n: {
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    locales: [
      {
        code: "vi",
        icon: "🇻🇳",
        iso: "vi-VN",
        name: "Tiếng Việt",
        file: "vi-VN.json",
      },
      {
        code: "en",
        icon: "🇺🇸",
        iso: "en-US",
        name: "English (US)",
        file: "en-US.json",
      },
    ],
    lazy: true,
    langDir: "locales",
    defaultLocale: "vi",
  },
});
