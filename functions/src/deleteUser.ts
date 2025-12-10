import * as functions from "firebase-functions";
import { db } from ".";

const deleteUser = functions.https.onCall(
  async (request) => {
    const { userId, adminUsername } = request.data;

    // Validate required fields
    if (!userId || typeof userId !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "User ID is required"
      );
    }

    if (!adminUsername || typeof adminUsername !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Admin username is required"
      );
    }

    // Get the user document
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "User not found"
      );
    }

    const userData = userDoc.data();
    
    // Prevent deleting yourself
    if (userData?.username === adminUsername) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Cannot delete your own account"
      );
    }

    // Delete the user document
    await userRef.delete();

    return {
      message: "User deleted successfully",
      id: userId,
    };
  }
);

export default deleteUser;

