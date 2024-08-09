import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";
const runtimeConfig = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: runtimeConfig.apiSecretKey,
  providers: [
    CredentialsProvider.default({
      name: "Credentials",

      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        
        const user = {};

        if (credentials.password == runtimeConfig.password && user) {
          return {
            ...credentials,
            user,
          };
        }
        return null;
      },
    }),
  ],
  pages: {},
  theme: {
    logo: "/logo/logo-short.png",
  },
});
