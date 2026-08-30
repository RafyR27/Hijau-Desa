import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export async function uploadImageToCloudinary(
  fileStr: string,
  folder: string = "hijau-desa"
): Promise<string> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: "auto",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}
