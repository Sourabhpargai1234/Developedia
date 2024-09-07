import { getServerSession } from "next-auth";
import { Like } from "@/models/Like";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json(); // Change to json() to handle JSON data
    console.log("Data received:", data);

    const { liked, likedBy } = data;

    if (!liked || !likedBy) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const existingLike = await Like.findOne({ feed: liked, user: likedBy });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return NextResponse.json({ message: "Like deleted successfully" }, { status: 200 });
    } else {
      const newLike = new Like({ feed: liked, user: likedBy });
      const savedLike = await newLike.save();
      return NextResponse.json({ feed: savedLike.feed, user: savedLike.user }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json({ message: "Error saving like", error: error.message }, { status: 500 });
  }
}

