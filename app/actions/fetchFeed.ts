"use server";

import { connectDB } from "@/libs/mongodb";
import Feed from "@/models/Feed";

export async function fetchFeed(email: string) {
  try {
    const db = await connectDB();
    const feeds = await Feed.find({ email });
    return feeds;
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw new Error("Failed to fetch feed");
  }
}
