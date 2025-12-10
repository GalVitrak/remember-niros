import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db } from ".";

interface MemoryData {
  memory: string;
  writer?: string;
  imageUrl?: string; // For backward compatibility
  imageUrls?: string[]; // Array of image URLs (max 5)
}

const addMemory = functions.https.onCall(
  async (request) => {
    const {
      memory,
      writer,
      imageUrl,
      imageUrls,
    } = request.data as MemoryData;

    // Validate required fields
    if (
      !memory ||
      typeof memory !== "string" ||
      memory.trim().length === 0
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Memory text is required"
      );
    }

    // Validate imageUrls array if provided
    if (imageUrls) {
      if (!Array.isArray(imageUrls)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "imageUrls must be an array"
        );
      }
      if (imageUrls.length > 5) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Maximum 5 images allowed"
        );
      }
      // Validate each URL is a string
      for (const url of imageUrls) {
        if (typeof url !== "string") {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "All image URLs must be strings"
          );
        }
      }
    }

    // Validate imageUrl (backward compatibility) if provided
    if (
      imageUrl &&
      typeof imageUrl !== "string"
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid image URL"
      );
    }

    // Validate writer name
    const finalWriter =
      writer?.trim() || "אנונימי";

    // Create memory document
    // Use imageUrls if provided, otherwise fall back to imageUrl for backward compatibility
    const memoryDoc: any = {
      memory: memory.trim(),
      writer: finalWriter,
      createdAt: FieldValue.serverTimestamp(),
      status: "pending", // All memories start as pending for moderation
    };

    if (imageUrls && imageUrls.length > 0) {
      memoryDoc.imageUrls = imageUrls;
    } else if (imageUrl) {
      memoryDoc.imageUrl = imageUrl;
    }

    const docRef = await db
      .collection("memories")
      .add(memoryDoc);

    return {
      id: docRef.id,
      message: "Memory added successfully",
    };
  }
);

export default addMemory;
