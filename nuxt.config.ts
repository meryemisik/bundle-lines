// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/assets/css/main.scss"],
  modules: [ "nuxt-icon", "@pinia/nuxt"],

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
    MONGO_URI: process.env.MONGO_URI,
  },
  nitro: {
    plugins: ["@/server/db/index.ts"],
  },
});
