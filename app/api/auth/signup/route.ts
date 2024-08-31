import { connectDB } from "@/libs/mongodb";
import { User, IUser } from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../Cloudinary";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const bio = formData.get("bio") as string;
    const pic = formData.get("pic") as File | null;

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const userFound = await User.findOne({ name });

    if (userFound) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
    }

    let uploadedImageUrl = "";

    // Handle image file upload
    if (pic) {
      const arrayBuffer = await pic.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadedImageUrl = await uploadToCloudinary(buffer, "image");
      console.log("ImageURL", uploadedImageUrl);
    }

    const user = new User({
      username: name,
      email: email,
      password: hashedPassword,
      profilePicture: uploadedImageUrl || "",
      bio: bio || "",
    });

    const savedUser = await user.save();

    return NextResponse.json(
      {
        name: savedUser.username,
        email: savedUser.email,
        profilePicture: savedUser.profilePicture,
        bio: savedUser.bio,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    } else {
      console.error("Error during signup:", error);
      return NextResponse.error();
    }
  }
}
