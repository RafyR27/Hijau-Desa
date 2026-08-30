import { auth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          status: 401,
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let imageStr = "";
    let folder = "hijau-desa";

    if (contentType.includes("application/json")) {
      const body = await req.json();

      imageStr = body.image || body.file || "";

      if (body.folder) folder = body.folder;

    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const file = formData.get("file") as File | null;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mime = file.type || "image/jpeg";
        imageStr = `data:${mime};base64,${buffer.toString("base64")}`;
      }

      const folderParam = formData.get("folder") as string | null;
      if (folderParam) folder = folderParam;
    }

    if (!imageStr) {
      return NextResponse.json(
        {
          status: 400,
          code: "BAD_REQUEST",
          message: "File gambar wajib diunggah.",
          data: null,
        },
        { status: 400 }
      );
    }

    if (imageStr.startsWith("http://") || imageStr.startsWith("https://")) {
      return NextResponse.json(
        {
          status: 200,
          code: "SUCCESS_UPLOAD",
          message: "URL gambar valid",
          data: { url: imageStr },
        },
        { status: 200 }
      );
    }

    const secureUrl = await uploadImageToCloudinary(imageStr, folder);

    return NextResponse.json(
      {
        status: 200,
        code: "SUCCESS_UPLOAD_IMAGE",
        message: "Berhasil mengunggah gambar ke Cloudinary",
        data: { url: secureUrl },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan saat mengunggah gambar",
        data: null,
      },
      { status: 500 }
    );
  }
}
