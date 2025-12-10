import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { db } from ".";

const removeMemoryImages = functions.https.onCall(
  async (request) => {
    try {
      const { memoryId, imageUrls, adminUsername } = request.data;

    // Validate required fields
    if (!memoryId || typeof memoryId !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Memory ID is required"
      );
    }

    if (!adminUsername || typeof adminUsername !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Admin username is required"
      );
    }

    if (!imageUrls || !Array.isArray(imageUrls)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Image URLs array is required"
      );
    }

    // Get the memory document
    const memoryRef = db.collection("memories").doc(memoryId);
    const memoryDoc = await memoryRef.get();

    if (!memoryDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Memory not found"
      );
    }

    const memoryData = memoryDoc.data();
    const currentImageUrls: string[] = (memoryData?.imageUrls as string[]) || [];
    const currentImageUrl: string | undefined = memoryData?.imageUrl as string | undefined;

    // Validate imageUrls array contains strings
    if (!imageUrls.every((url) => typeof url === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "All image URLs must be strings"
      );
    }

    // Get storage bucket
    const bucket = admin.storage().bucket();

    // Delete images from storage
    const deletePromises = (imageUrls as string[]).map(async (imageUrl: string) => {
      try {
        // Extract file path from URL
        // Firebase Storage URLs format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media
        // Or: gs://bucket/path or https://storage.googleapis.com/bucket/path
        let filePath: string | null = null;

        if (imageUrl.startsWith("gs://")) {
          // Direct gs:// URL
          const gsMatch = imageUrl.match(/gs:\/\/[^/]+\/(.+)/);
          if (gsMatch) {
            filePath = gsMatch[1];
          }
        } else if (imageUrl.includes("firebasestorage.googleapis.com")) {
          // Firebase Storage URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media&token=...
          try {
            const urlObj = new URL(imageUrl);
            // Extract the path after /o/
            const pathMatch = urlObj.pathname.match(/\/o\/(.+?)(\?|$)/);
            if (pathMatch) {
              filePath = decodeURIComponent(pathMatch[1]);
            }
          } catch (urlError) {
            console.error(`Invalid URL format: ${imageUrl}`, urlError);
          }
        } else if (imageUrl.includes("storage.googleapis.com")) {
          // Google Cloud Storage URL
          try {
            const urlObj = new URL(imageUrl);
            // Remove bucket name from path if present
            const pathParts = urlObj.pathname.split("/").filter((p) => p);
            if (pathParts.length > 1) {
              // Skip bucket name (first part)
              filePath = pathParts.slice(1).join("/");
            } else {
              filePath = urlObj.pathname.substring(1); // Remove leading /
            }
          } catch (urlError) {
            console.error(`Invalid URL format: ${imageUrl}`, urlError);
          }
        }

        if (filePath) {
          const file = bucket.file(filePath);
          const [exists] = await file.exists();
          if (exists) {
            await file.delete();
            console.log(`Deleted image: ${filePath}`);
          } else {
            console.log(`Image not found in storage: ${filePath}`);
          }
        } else {
          console.warn(`Could not extract file path from URL: ${imageUrl}`);
        }
      } catch (error) {
        console.error(`Error deleting image ${imageUrl}:`, error);
        // Continue with other deletions even if one fails
      }
    });

    await Promise.all(deletePromises);

    // Update memory document - remove deleted images
    const updatedImageUrls = currentImageUrls.filter(
      (url: string) => !(imageUrls as string[]).includes(url)
    );

    const updateData: any = {};
    
    if (updatedImageUrls.length > 0) {
      updateData.imageUrls = updatedImageUrls;
    } else {
      updateData.imageUrls = FieldValue.delete();
    }

    // Also handle single imageUrl for backward compatibility
    if (currentImageUrl && imageUrls.includes(currentImageUrl)) {
      updateData.imageUrl = FieldValue.delete();
    }

    await memoryRef.update(updateData);

      return {
        message: "Images removed successfully",
        id: memoryId,
        remainingImages: updatedImageUrls.length,
      };
    } catch (error) {
      console.error("Error in removeMemoryImages:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to remove images: " + (error instanceof Error ? error.message : String(error))
      );
    }
  }
);

export default removeMemoryImages;

