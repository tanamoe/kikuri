// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      search_endpoint: process.env.SEARCH_ENDPOINT,
      search_token: process.env.SEARCH_TOKEN,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image-edge",
    "nuxt-icon",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
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
});
