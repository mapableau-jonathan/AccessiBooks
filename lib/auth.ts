import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, sessions } from "../shared/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        
        if (dbUser[0]) {
          (session.user as any).subscriptionTier = dbUser[0].subscriptionTier || "free";
          (session.user as any).firstName = dbUser[0].firstName;
          (session.user as any).lastName = dbUser[0].lastName;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (user.id) {
        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1);
          
          if (existingUser[0]) {
            await db
              .update(users)
              .set({
                updatedAt: new Date(),
                profileImageUrl: user.image || existingUser[0].profileImageUrl,
              })
              .where(eq(users.id, user.id));
          }
        } catch (error) {
          console.error("Error updating user on sign in:", error);
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
