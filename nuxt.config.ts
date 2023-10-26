// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL,
      pocketbaseUrl: process.env.POCKETBASE_URL,
      blogUrl: process.env.BLOG_URL,
      ogUrl: process.env.OG_URL,
      imageUrl: process.env.IMAGE_URL,
      fbAppId: process.env.FB_APP_ID,
      umamiUrl: process.env.UMAMI_URL,
      umamiSiteId: process.env.UMAMI_SITE_ID,
    },
  },
  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-swiper",
    "@nuxt/content",
  ],
  // https://nuxt.com/docs/getting-started/installation#prerequisites
  typescript: {
    strict: true,
    shim: false,
    typeCheck: true,
  },
  routeRules: {
    "/": { prerender: true, isr: 3600 },
    "/calendar": { prerender: true, isr: 3600 },
    "/title/*": { isr: 3600 },
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
});
