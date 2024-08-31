import { v2 as cloudinary } from 'cloudinary';
import { Readable } from "stream";

export const uploadToCloudinary = (buffer: Buffer, resourceType: "image" | "video") => {
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