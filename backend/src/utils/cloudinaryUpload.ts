// src/utils/cloudinaryUpload.ts
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export async function uploadToCloudinary(
  filePath: string,
  folder: string = 'default',
  prefix: string = 'file'
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        public_id: `${prefix}_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}`,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result!);
      }
    );
  });
}
