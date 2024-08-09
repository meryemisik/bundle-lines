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
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsBucketName: process.env.AWS_BUCKET_NAME,
    awsRegion: process.env.AWS_REGION,
    password: process.env.PASSWORD,
    apiSecretKey: process.env.NUXT_API_SECRET_KEY,
    measurementId: process.env.NUXT_MEASUREMENT_ID,
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

  hooks: {
    close: () => {
      process.exit();
    },
  },
});
