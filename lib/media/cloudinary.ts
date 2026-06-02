import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function buildVariantUrls(publicId: string) {
  const base = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  return {
    mobile: `${base}/w_480,q_auto,f_auto/${publicId}`,
    tablet: `${base}/w_768,q_auto,f_auto/${publicId}`,
    desktop: `${base}/w_1280,q_auto,f_auto/${publicId}`,
    retina: `${base}/w_2560,q_auto,f_auto/${publicId}`,
  };
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; filename?: string; mimeType?: string }
) {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    const id = `local/${Date.now()}-${options.filename ?? "file"}`;
    const placeholder = `https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80`;
    const asset = await prisma.mediaAsset.create({
      data: {
        publicId: id,
        url: placeholder,
        secureUrl: placeholder,
        filename: options.filename ?? "placeholder.jpg",
        mimeType: options.mimeType ?? "image/jpeg",
        folder: options.folder ?? "general",
        variants: buildVariantUrls("photo-1551434678-e076c223a692"),
      },
    });
    return asset;
  }

  return new Promise<Awaited<ReturnType<typeof prisma.mediaAsset.create>>>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder ?? "digital-growth",
          resource_type: "auto",
        },
        async (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"));
            return;
          }

          const variants = buildVariantUrls(result.public_id);
          const asset = await prisma.mediaAsset.create({
            data: {
              publicId: result.public_id,
              url: result.url,
              secureUrl: result.secure_url,
              filename: options.filename ?? result.original_filename ?? "file",
              mimeType: options.mimeType ?? `${result.resource_type}/${result.format}`,
              size: result.bytes,
              width: result.width,
              height: result.height,
              folder: options.folder ?? "general",
              variants,
            },
          });
          resolve(asset);
        }
      );
      uploadStream.end(buffer);
    }
  );
}

export async function deleteFromCloudinary(publicId: string) {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
  }
  await prisma.mediaAsset.delete({ where: { publicId } }).catch(() => null);
}
