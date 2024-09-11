import { getServerSession } from "next-auth";
import { Like } from "@/models/Like";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import { revalidatePath } from "next/cache";
export const revalidate = true;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  console.log("Session: ", session);

  if (!session) {
    console.log("Unauthorized access attempt.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const formData = await request.formData();
    console.log("Raw formData: ", formData);
    const liked = formData.get("liked") as string;
    const likedBy = formData.get("likedBy") as string;
    console.log("liked:", liked);
    console.log("likedBy:", likedBy);

    if (!liked || !likedBy) {
      console.log("Invalid data: liked or likedBy is missing.");
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const existingLike = await Like.findOne({ feed: liked, user: likedBy });
    if (existingLike) {
      console.log("Like already exists, deleting it.");
      await Like.deleteOne({ _id: existingLike._id });
      return NextResponse.json(
        { message: "Like deleted successfully" },
        { status: 200 }
      );
    } else {
      console.log("Like not found, creating new one.");
      const Likes = new Like({
        feed: liked,
        user: likedBy,
      });
      const savedLike = await Likes.save();
      console.log("New like saved:", savedLike);

      console.log("Revalidating path...");
      revalidatePath('/dashboard/feeds', 'page');
      console.log("Revalidation attempt done.");
      
      return NextResponse.json(
        {
          feed: savedLike.feed,
          user: savedLike.user,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error in like handling:", error);
    return NextResponse.json(
      { message: "Error saving like", error: error.message },
      { status: 500 }
    );
  }
}
