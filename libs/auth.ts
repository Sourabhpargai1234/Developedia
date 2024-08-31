import { connectDB } from "@/libs/mongodb";
import { User } from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials) {
          throw new Error("No credentials provided");
        }
        const { email, password } = credentials;
        // Find the user in the database
        const userFound = await User.findOne({ email }).select("+password");
        if (!userFound) {
          throw new Error("Invalid email or password");
        }
        // Compare the password
        const passwordMatch = await bcrypt.compare(password, userFound.password);
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }
        // Create a plain object that aligns with NextAuth's expected user type
        const user = {
          id: userFound._id.toString(), // convert ObjectId to string
          email: userFound.email,
          username: userFound.username,
          image: userFound.profilePicture,
          bio: userFound.bio,
          likedPosts: userFound.likedPosts,
          subscribers: userFound.subscribers,
          subscribedTo: userFound.subscribedTo,
          createdAt: userFound.createdAt,
          updatedAt: userFound.updatedAt,
        };
        return user as any; // Assert the type to be compatible with NextAuth
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      // Keep your existing jwt logic
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
  
      if (trigger === "update" && session?.email) {
        token.email = session.email;
      }
  
      if (user) {
        const u=user as unknown as any;
        console.log("User profilePicture in jwt:", u.profilePicture);
        return {
          ...token,
          id: u.id,
          email: u.email,
          username: u.username,
          image: u.image,
          bio: u.bio
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email,
          image: token.image,
          bio: token.bio
        },
      };
    },
  },
};
