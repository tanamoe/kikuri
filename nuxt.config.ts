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
    "@nuxtjs/sitemap",
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
    // "/": { prerender: true, isr: 3600 },
    // "/calendar": { prerender: true, isr: 3600 },
    // "/title/*": { isr: 3600 },
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

  site: {
    name: "Tana.moe",
    description:
      "Tana.moe là một tủ truyện trực tuyến giúp theo dõi các tựa truyện sắp ra mắt dễ dàng hơn và khám phá những bộ truyện bạn có thể đã bỏ lỡ!",
  },

  sitemap: {
    sitemaps: {
      titles: {
        sources: ["/api/__sitemap__/titles"],
        defaults: { priority: 0.3 },
      },
      releases: {
        sources: ["/api/__sitemap__/releases"],
        defaults: { priority: 0.7 },
      },
      books: {
        sources: ["/api/__sitemap__/books"],
        defaults: { priority: 0.5 },
      },
    },
    autoI18n: true,
  },

  experimental: { appManifest: false },
  compatibilityDate: "2024-07-06",
});
