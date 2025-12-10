import * as functions from "firebase-functions";
import { db } from ".";
import cyber from "./cyber";

const changeUserPassword = functions.https.onCall(
  async (request) => {
    const { userId, newPassword, adminUsername } = request.data;

    // Validate required fields
    if (!userId || typeof userId !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "User ID is required"
      );
    }

    if (!newPassword || typeof newPassword !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "New password is required"
      );
    }

    if (newPassword.length < 6) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Password must be at least 6 characters"
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

    // Hash the new password
    const hashedPassword = await cyber.hashPassword(newPassword);

    // Update the user's password
    await userRef.update({
      password: hashedPassword,
    });

    return {
      message: "Password changed successfully",
      id: userId,
    };
  }
);

export default changeUserPassword;

