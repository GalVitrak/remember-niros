import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

interface UploadImagesData {
  images: string[]; // Array of base64 encoded images
}

const uploadImages = functions.https.onCall(
  async (request) => {
    const { images } = request.data as UploadImagesData;

    // Validate required fields
    if (!images || !Array.isArray(images)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Images array is required"
      );
    }

    if (images.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "At least one image is required"
      );
    }

    if (images.length > 5) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Maximum 5 images allowed"
      );
    }

    // Get storage bucket
    const bucket = admin.storage().bucket();

    // Upload all images
    const uploadPromises = images.map(
      async (base64Image: string, index: number) => {
        try {
          // Validate base64 format
          if (
            !base64Image.startsWith("data:image/")
          ) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              `Image ${index + 1} is not a valid base64 image`
            );
          }

          // Extract mime type and base64 data
          const matches = base64Image.match(
            /^data:image\/([a-zA-Z]+);base64,(.+)$/
          );
          if (!matches) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              `Image ${index + 1} has invalid format`
            );
          }

          const mimeType = matches[1];
          const base64Data = matches[2];

          // Validate mime type
          const allowedTypes = [
            "jpeg",
            "jpg",
            "png",
            "gif",
            "webp",
          ];
          if (!allowedTypes.includes(mimeType.toLowerCase())) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              `Image ${index + 1} has unsupported format. Allowed: ${allowedTypes.join(", ")}`
            );
          }

          // Convert base64 to buffer
          const imageBuffer = Buffer.from(
            base64Data,
            "base64"
          );

          // Validate file size (max 5MB per image)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (imageBuffer.length > maxSize) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              `Image ${index + 1} exceeds maximum size of 5MB`
            );
          }

          // Generate unique filename
          const timestamp = Date.now();
          const filename = `memories/${timestamp}_${index}.${mimeType}`;

          // Upload to Storage
          const file = bucket.file(filename);
          await file.save(imageBuffer, {
            metadata: {
              contentType: `image/${mimeType}`,
              metadata: {
                uploadedAt: new Date().toISOString(),
              },
            },
          });

          // Make file publicly readable
          await file.makePublic();

          // Get download URL
          // Filename is safe (timestamp_index.extension format)
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

          return publicUrl;
        } catch (error) {
          console.error(
            `Error uploading image ${index + 1}:`,
            error
          );
          if (
            error instanceof
            functions.https.HttpsError
          ) {
            throw error;
          }
          throw new functions.https.HttpsError(
            "internal",
            `Failed to upload image ${index + 1}: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    );

    try {
      const uploadedUrls = await Promise.all(
        uploadPromises
      );

      return {
        imageUrls: uploadedUrls,
        message: "Images uploaded successfully",
      };
    } catch (error) {
      console.error("Error in uploadImages:", error);
      throw error;
    }
  }
);

export default uploadImages;

