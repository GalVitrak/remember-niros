import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { db } from ".";

const deleteMemory = functions.https.onCall(
  async (request) => {
    const { memoryId, adminUsername } =
      request.data;

    // Validate required fields
    if (
      !memoryId ||
      typeof memoryId !== "string"
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Memory ID is required"
      );
    }

    if (
      !adminUsername ||
      typeof adminUsername !== "string"
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Admin username is required"
      );
    }

    // Get the memory document
    const memoryRef = db
      .collection("memories")
      .doc(memoryId);
    const memoryDoc = await memoryRef.get();

    if (!memoryDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Memory not found"
      );
    }

    const memoryData = memoryDoc.data();

    // Only allow deletion of rejected memories
    if (memoryData?.status !== "rejected") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Only rejected memories can be deleted"
      );
    }

    // Get storage bucket
    const bucket = admin.storage().bucket();

    // Delete all images from storage if they exist
    const imageUrls: string[] =
      (memoryData?.imageUrls as string[]) || [];
    const imageUrl: string | undefined =
      memoryData?.imageUrl as string | undefined;
    const imagesToDelete: string[] = imageUrl
      ? [...imageUrls, imageUrl]
      : imageUrls;
    const uniqueImages: string[] = [
      ...new Set(imagesToDelete),
    ];

    const deletePromises = uniqueImages.map(
      async (imgUrl: string) => {
        try {
          // Extract file path from URL
          let filePath: string | null = null;

          if (imgUrl.startsWith("gs://")) {
            // Direct gs:// URL
            const gsMatch = imgUrl.match(
              /gs:\/\/[^/]+\/(.+)/
            );
            if (gsMatch) {
              filePath = gsMatch[1];
            }
          } else if (
            imgUrl.includes(
              "firebasestorage.googleapis.com"
            )
          ) {
            // Firebase Storage URL
            const urlObj = new URL(imgUrl);
            const pathMatch =
              urlObj.pathname.match(
                /\/o\/(.+?)(\?|$)/
              );
            if (pathMatch) {
              filePath = decodeURIComponent(
                pathMatch[1]
              );
            }
          } else if (
            imgUrl.includes(
              "storage.googleapis.com"
            )
          ) {
            // Google Cloud Storage URL
            const urlObj = new URL(imgUrl);
            const pathParts = urlObj.pathname
              .split("/")
              .filter((p) => p);
            if (pathParts.length > 1) {
              // Skip bucket name (first part)
              filePath = pathParts
                .slice(1)
                .join("/");
            } else {
              filePath =
                urlObj.pathname.substring(1); // Remove leading /
            }
          }

          if (filePath) {
            const file = bucket.file(filePath);
            const [exists] = await file.exists();
            if (exists) {
              await file.delete();
              console.log(
                `Deleted image: ${filePath}`
              );
            } else {
              console.log(
                `Image not found in storage: ${filePath}`
              );
            }
          }
        } catch (error) {
          console.error(
            `Error deleting image ${imgUrl}:`,
            error
          );
          // Continue with other deletions even if one fails
        }
      }
    );

    await Promise.all(deletePromises);

    // Delete the memory document
    await memoryRef.delete();

    return {
      message: "Memory deleted successfully",
      id: memoryId,
    };
  }
);

export default deleteMemory;
