import { Feed, IFeed } from "@/models/Feed";
import mongoose from "mongoose";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "../api/auth/Cloudinary";
import { v2 as cloudinary } from 'cloudinary';
import { User } from "@/models/User";
import { useRouter } from "next/navigation";
const path = '/dashboard/profile'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("cloudinary", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)

export async function fetchAllFeeds(formData: FormData) {
    const router = useRouter();
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    console.log(User);
    console.log("formData at backend= ",formData);
    const user = formData.get("user") as string;

 
    const content = formData.get("content") as string;
    const desc = formData.get("desc") as string;
    const file = formData.get("file") as Blob | null;
    const videofile = formData.get("videofile") as Blob | null;

    const email = formData.get("email") as string;
    const SessionEmail = session?.user?.email || null;
    const InputEmail = email || null;

    const emailFromSessionString = SessionEmail ? String(SessionEmail).trim().toLowerCase() : '';
    const emailFromInputString = InputEmail ? String(InputEmail).trim().toLowerCase() : '';


    if (emailFromSessionString !== emailFromInputString) {
      return (
        { message: "Couldn't validate your identity, check your name carefully", status: 403}
      );
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return ({ error: "Cloudinary credentials not found", status: 400});
    }


    let uploadedImageUrl = "";
    let uploadedVideoUrl = "";

    // Handle image file upload
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadedImageUrl = await uploadToCloudinary(buffer, "image");
    }

    // Handle video file upload
    if (videofile) {    
      const arrayBuffer = await videofile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadedVideoUrl = await uploadToCloudinary(buffer, "video");
    }

    const feed = new Feed({
      user,
      content,
      desc,
      file: uploadedImageUrl,
      videofile: uploadedVideoUrl || " ",
    });

    const savedFeed = await feed.save();

    console.log("Revalidating path...");

    if (path) {
      revalidatePath(path)
    }
    router.push("/dashboard/profile");

    return (
      {
        id: savedFeed.user,
        content: savedFeed.content,
        desc: savedFeed.desc,
        file: savedFeed.file,
        videofile: savedFeed.videofile,
        status: 201
      }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Validation error
      console.error("Validation error:", error.errors);
      return (
        { message: error.message, errors: error.errors, status: 400}
      );
    }  else {
      console.error("Error during feed creation:", error);
      return (
        { message: "Error during feed creation"}
        );
    }
  }
}
