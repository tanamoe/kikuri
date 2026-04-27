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
    "@nuxthub/core",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "nuxt-swiper",
  ],

  devtools: {
    enabled: true,
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  css: ["~/assets/css/main.css"],

  ssr: false,

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

  fonts: {
    defaults: {
      weights: [400, 700, 900],
      styles: ["normal", "italic"],
      subsets: ["vietnamese", "latin"],
    },
  },

  i18n: {
    detectBrowserLanguage: false,
    defaultLocale: "vi",
  },

  nitro: {
    compatibilityDate: "2024-09-19",
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    devStorage: { cache: { driver: "memory" } },
  },

  compatibilityDate: "2024-07-06",
});
