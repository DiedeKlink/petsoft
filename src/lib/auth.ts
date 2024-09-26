import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { GetUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

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

      if (!isLoggedIn && isTryingToAccesApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccesApp && auth?.user.hasAccess) {
        return true;
      }
      if (isLoggedIn && !isTryingToAccesApp) {
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
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

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
