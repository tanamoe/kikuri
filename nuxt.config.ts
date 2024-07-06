// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL,
      pocketbaseUrl: process.env.POCKETBASE_URL,
      ogUrl: process.env.OG_URL,
      imageUrl: process.env.IMAGE_URL,
      fbAppId: process.env.FB_APP_ID,
      umamiUrl: process.env.UMAMI_URL,
      umamiSiteId: process.env.UMAMI_SITE_ID,
    },
  },

  modules: [
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "nuxt-swiper",
  ],

  // https://nuxt.com/docs/getting-started/installation#prerequisites
  typescript: {
    strict: true,
    shim: false,
    typeCheck: true,
  },

  css: [
    "~/assets/fonts/inter.css",
    "~/assets/fonts/ibm-plex.css",
    "~/assets/fonts/lexend.css",
  ],

  routeRules: {
    "/": { prerender: true, isr: 3600 },
    "/calendar": { prerender: true, isr: 3600 },
    "/title/*": { isr: 3600 },
    "/library/*": { ssr: false },
  },

  image: {
    provider: "imagor",
    providers: {
      imagor: {
        provider: "~/providers/imagor",
        options: {
          baseURL: "https://image.tana.moe/unsafe",
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

  swiper: {
    modules: ["autoplay", "effect-creative", "mousewheel"],
  },

  ui: {
    icons: ["fluent", "simple-icons"],
  },

  i18n: {
    detectBrowserLanguage: false,
  },

  content: {
    locales: ["vi"],
    defaultLocale: "vi",
    markdown: {
      anchorLinks: false,
    },
  },

  experimental: { appManifest: false },
  compatibilityDate: "2024-07-06",
});
