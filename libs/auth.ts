import { connectDB } from "@/libs/mongodb";
import { User } from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
        },
      },
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
    async signIn({ user, account, profile }) {
      try {
        const db = await connectDB(); // Get the mongoose connection
        const usersCollection = db.collection('users'); // Access the 'users' collection
    
        // Check if the user already exists in the database
        const existingUser = await usersCollection.findOne({ email: user.email });
    
        if (!existingUser) {
          // Insert the user details into the database if the user does not exist
          const insertResult=await usersCollection.insertOne({
            username: user.name,
            email: user.email,  // Correct email field
            password: "",       // Password is empty as it's a Google signup
            profilePicture: user.image,
            bio: "",            // Default bio, can be updated later
            likedPost: new Array(),
            subscribers: new Array(),
            subscribedTo: new Array(),
            createdAt: new Date(),
          });
        }

        if (existingUser && existingUser._id) {
          user.id = existingUser._id.toString();
        } else {
          throw new Error("Failed to retrieve MongoDB _id for the user");
        }
    
        return true; // Continue the sign-in process
      } catch (error) {
        console.error("Error during signIn:", error);
        return false; // Optionally handle the sign-in error
      }
    },
    
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
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string, // Assert as string
          username: token.username as string, // Assert as string
          email: token.email as string | null | undefined, // Match Session type
          image: token.image as string | null | undefined, // Match Session type
          bio: token.bio as string | null | undefined, // Match Session type
        },
      };
    },
  },
};
