import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { GetUserByEmail } from "./server-utils";
import { authSchema } from "./validations";
import { sleep } from "./utils";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        //runs on login

        // validation
        const validatedFormData = authSchema.safeParse(credentials);

        if (!validatedFormData.success) {
          return null;
        }
        // runs on login
        const { email, password } = validatedFormData.data;

        const user = await GetUserByEmail(email);
        if (!user) {
          console.log("User not found");
          return null;
        }

        const passwordsMath = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordsMath) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      //runs on every quest with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccesApp = request.nextUrl.pathname.includes("/app");

      console.log(
        isLoggedIn,
        isTryingToAccesApp,
        auth?.user.hasAccess,
        request.nextUrl.pathname
      );

      if (!isLoggedIn && isTryingToAccesApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccesApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccesApp && auth?.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        auth?.user.hasAccess
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }
      if (isLoggedIn && !isTryingToAccesApp && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }

        return true;
      }

      if (!isLoggedIn && !isTryingToAccesApp) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === "update") {
        // on every request
        const userFromDb = await GetUserByEmail(token.email);
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
