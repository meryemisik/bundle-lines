import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  providers: [
    CredentialsProvider.default({
      name: "Credentials",

      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        const formattedDate = `${day}${month}${year}`;
        const user = {};

        if (credentials.password == formattedDate && user) {
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
    logo: "/logo/logo.png",
  },
});
