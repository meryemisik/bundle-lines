// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/assets/css/main.scss"],
  modules: [ "nuxt-icon", "@nuxt/content"],

  build: {
    transpile: ["vuetify"],
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    mongoUrl: process.env.NUXT_MONGO_URI,
    measurementId: process.env.NUXT_MEASUREMENT_ID,
    apiSecretKey: process.env.NUXT_API_SECRET_KEY,
  },
  nitro: {
    plugins: ["@/server/db/index.ts"],
  },
});
