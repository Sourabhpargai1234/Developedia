// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      email?: string;
      image?: string;  // Ensure this is defined as string or undefined
      bio?: string;
      // Add other properties here if needed
    };
  }
}
