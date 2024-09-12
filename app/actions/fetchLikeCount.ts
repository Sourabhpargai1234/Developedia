"use server"

import { Like } from "@/models/Like";
import { revalidatePath } from "next/cache";
const path = 'http://localhost:3000/dashboard/feeds'

export const fetchLikeCount = async(formData: FormData) => {
    console.log("Raw formData: ", formData);
    const liked = formData.get("liked");
    const likedBy = formData.get("likedBy");

    if (!liked || !likedBy) {
        console.log("Invalid data: liked or likedBy is missing.");
        return ({ message: "Invalid data", status: 400 });
    }

    try {
        const existingLike = await Like.findOne({ feed: liked, user: likedBy });
        if (existingLike) {
          console.log("Like already exists, deleting it.");
          await Like.deleteOne({ _id: existingLike._id });
    
          console.log("Revalidating path...");
          console.log("path",path)
          if (path) {
            revalidatePath(path)
          }
          console.log("Revalidation attempt done.");
    
          return { message: "Like deleted successfully", status: 200 };

        } else {
          console.log("Like not found, creating new one.");
          const Likes = new Like({
            feed: liked,
            user: likedBy,
          });
          const savedLike = await Likes.save();
          
          console.log("Revalidating path...");
          console.log("path",path)
          if (path) {
            revalidatePath(path)
          }
          console.log("Revalidation attempt done.");
          console.log("New like saved:", savedLike);
          
          return (
            {
              feed: savedLike.feed,
              user: savedLike.user,
              status: 201
            }
          );
        }
    }
    catch (error: any) {
        console.error("Error in like handling:", error);
        return(
          { message: "Error saving like", error: error.message ,status: 500}
        );
    }

}