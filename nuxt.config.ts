// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  // https://nuxt.com/docs/getting-started/installation#prerequisites
  typescript: {
    shim: false,
    typeCheck: true,
  },
});
