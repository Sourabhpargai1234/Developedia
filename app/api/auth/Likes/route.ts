import { getServerSession } from "next-auth";
import { Like } from "@/models/Like";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";

export async function POST(request: Request) {
  // Step 1: Log the session check
  const session = await getServerSession(authOptions);
  console.log("Session: ", session);

  // Ensure the user is authenticated
  if (!session) {
    console.log("Unauthorized access attempt.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 2: Log the request headers to ensure `Content-Type` is correct
    console.log("Request Headers: ", request.headers.get("content-type"));

    // Step 3: Attempt to parse formData
    const formData = await request.formData();
    console.log("Raw formData: ", formData);

    // Log individual fields
    const liked = formData.get("liked") as string;
    const likedBy = formData.get("likedBy") as string;
    console.log("liked:", liked);
    console.log("likedBy:", likedBy);

    // Step 4: Validate that the necessary data is provided
    if (!liked || !likedBy) {
      console.log("Invalid data: liked or likedBy is missing.");
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Step 5: Check if like already exists
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

      return NextResponse.json(
        {
          feed: savedLike.feed,
          user: savedLike.user,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    // Step 6: Log any errors that occur during execution
    console.error("Error in like handling:", error);
    return NextResponse.json(
      { message: "Error saving like", error: error.message },
      { status: 500 }
    );
  }
}
