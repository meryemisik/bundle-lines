// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/assets/css/main.scss"],
  modules: [
    "nuxt-icon",
    "@nuxt/content",
    "nuxt-tiptap-editor",
    "@sidebase/nuxt-auth",
  ],

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
  },
  nitro: {
    plugins: ["@/server/db/index.ts"],
  },
  tiptap: {
    prefix: "Tiptap",
  },
  auth: {
    provider: {
      type: "authjs",
      trustHost: false,
      addDefaultCallbackUrl: true,
    },
  },
});
