import NextAuth, { NextAuthConfig } from "next-auth";
const config = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized: ({ request }) => {
      const isTryingToAccesApp = request.nextUrl.pathname.includes("/app");

      if (isTryingToAccesApp) {
        return false;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth } = NextAuth(config);
