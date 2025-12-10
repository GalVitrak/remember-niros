import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db } from ".";

const rejectMemory = functions.https.onCall(
  async (request) => {
    const { memoryId, adminUsername } = request.data;

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

    // Get the memory document
    const memoryRef = db.collection("memories").doc(memoryId);
    const memoryDoc = await memoryRef.get();

    if (!memoryDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Memory not found"
      );
    }

    // Update memory status to rejected (keep images)
    await memoryRef.update({
      status: "rejected",
      ApprovedAt: FieldValue.serverTimestamp(),
      ApprovedBy: adminUsername,
    });

    return {
      message: "Memory rejected successfully",
      id: memoryId,
    };
  }
);

export default rejectMemory;

