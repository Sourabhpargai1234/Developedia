import { getServerSession } from "next-auth";
import Likes from "@/models/Likes";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Ensure the user is authenticated
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const liked = formData.get("liked") as string;
  const likedBy = formData.get("likedBy") as string;


  // Validate that the necessary data is provided
  if (!liked || !likedBy) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    const existingLike = await Likes.findOne({ liked, likedBy });
    if (existingLike) {
      await Likes.deleteOne({ _id: existingLike._id });
      return NextResponse.json(
        { message: "Like deleted successfully" },
        { status: 200 }
      );
    } 

    else{
      const Like = new Likes({
        liked,
        likedBy,
      });
      const savedLike = await Like.save();
      return NextResponse.json(
        {
          liked: savedLike.liked,
          likedBy: savedLike.likedBy,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error saving like:", error);
    return NextResponse.json(
      { message: "Error saving like" },
      { status: 500 }
    );
  }
}
