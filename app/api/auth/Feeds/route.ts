import Feed from "@/models/Feed";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from "stream";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("cloudinary", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const formData = await request.formData();

    const email = formData.get("email") as string;
    console.log("Email:", email)
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as Blob | null;
    const videofile = formData.get("videofile") as Blob | null;

    const SessionEmail = session?.user?.email || null;
    const InputEmail = email || null;

    const emailFromSessionString = SessionEmail ? String(SessionEmail).trim().toLowerCase() : '';
    const emailFromInputString = InputEmail ? String(InputEmail).trim().toLowerCase() : '';

    console.log(emailFromSessionString);
    console.log(emailFromInputString);

    if (emailFromSessionString !== emailFromInputString) {
      return NextResponse.json(
        { message: "Couldn't validate your identity, check your name carefully" },
        { status: 403 }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
    }

    const uploadToCloudinary = (buffer: Buffer, resourceType: "image" | "video") => {
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType },
          (error, result) => {
            if (error) {
              reject(new Error(`${resourceType} upload failed: ${error.message}`));
            } else {
              resolve(result?.secure_url || "");
            }
          }
        );

        // Create a readable stream from the buffer and pipe it to the Cloudinary upload stream
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null); // End of the stream
        readableStream.pipe(uploadStream);
      });
    };

    let uploadedImageUrl = "";
    let uploadedVideoUrl = "";

    // Handle image file upload
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadedImageUrl = await uploadToCloudinary(buffer, "image");
      console.log("ImageURL",uploadedImageUrl);
    }

    // Handle video file upload
    if (videofile) {    
      const arrayBuffer = await videofile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadedVideoUrl = await uploadToCloudinary(buffer, "video");
    }

    console.log("description",description);

    const feed = new Feed({
      email,
      title,
      desc: description,
      image: uploadedImageUrl,
      video: uploadedVideoUrl || " ",
    });

    const savedFeed = await feed.save();

    revalidatePath('/')

    return NextResponse.json(
      {
        name: savedFeed.name,
        email: savedFeed.email,
        title: savedFeed.title,
        desc: savedFeed.desc,
        image: savedFeed.image,
        video: savedFeed.video,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Validation error
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { message: error.message, errors: error.errors },
        { status: 400 }
      );
    }  else {
      console.error("Error during feed creation:", error);
      return NextResponse.error();
    }
  }
}
