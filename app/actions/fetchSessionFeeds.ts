"use server";

import { connectDB } from "@/libs/mongodb";
import { Feed,IFeed } from "@/models/Feed";

export async function fetchFeed(id: string) {
  try {
    const db = await connectDB();
    const feeds = await Feed.find({user : id });
    return feeds;
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw new Error("Failed to fetch feed");
  }
}
