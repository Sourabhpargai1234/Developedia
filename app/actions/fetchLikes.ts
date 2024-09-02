"use server";

import { connectDB } from "@/libs/mongodb";
import { Like } from "@/models/Likes";

  

  export async function fetchLikes(id: string): Promise<Record<string, any> | null> {
    try {
      await connectDB();  // Ensure the database connection is established
  
      // Query to find the document where the 'liked' field matches the given ID
      const feed = await Like.find({feed: id}).populate('user', 'username profilePicture').lean(); // Use .lean() to get a plain JavaScript object
  
      console.log("Feed found =", feed);
      return feed || null;
    } catch (error) {
      console.error("Error fetching likes:", error);
      throw new Error("Failed to fetch likes");
    }
  }
