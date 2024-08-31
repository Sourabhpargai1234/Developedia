"use server";

import { connectDB } from "@/libs/mongodb";
import { User } from "@/models/User";

export async function fetchUser(email: string) {
  try {
    const db = await connectDB();
    const user = await User.find({ email });
    return user;
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw new Error("Failed to fetch feed");
  }
}
