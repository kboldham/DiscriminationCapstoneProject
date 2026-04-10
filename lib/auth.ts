
import { compare } from "bcryptjs";
import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { checkLoginRateLimit } from "@/lib/ratelimit";

// Extend the built-in session/token types to carry the user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip =
          (req?.headers?.["x-forwarded-for"] as string | undefined)?.split(",")[0].trim()
          ?? (req?.headers?.["x-real-ip"] as string | undefined)
          ?? "unknown";

        const rl = checkLoginRateLimit(ip);
        if (!rl.allowed) return null; // NextAuth surfaces this as "CredentialsSignin"

        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValid = await compare(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          // Include role so chat API can gate admin-only report review features
          role: user.role ?? "user",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in `user` is populated; persist the id into the JWT.
      if (user) {
        token.id = user.id;
      }

      // Re-fetch the role from the database on every token refresh so that
      // role changes (promotion / demotion) take effect without requiring a
      // sign-out. The extra query is lightweight — id is the primary key.
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where:  { id: token.id as string },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "user";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Make id and role available in every useSession() / getServerSession() call
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
