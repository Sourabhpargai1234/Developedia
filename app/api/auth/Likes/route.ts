import { getServerSession } from "next-auth";
import { Like } from "@/models/Like";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Ensure the user is authenticated
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json(); // Use `json()` to parse request body
    const liked = body.liked;
    const likedBy = body.likedBy;

    // Validate that the necessary data is provided
    if (!liked || !likedBy) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const existingLike = await Like.findOne({ feed: liked, user: likedBy });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return NextResponse.json(
        { message: "Like deleted successfully" },
        { status: 200 }
      );
    } else {
      const Likes = new Like({
        feed: liked,
        user: likedBy,
      });
      const savedLike = await Likes.save();
      return NextResponse.json(
        {
          feed: savedLike.feed,
          user: savedLike.user,
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
