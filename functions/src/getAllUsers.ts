import * as functions from "firebase-functions";
import { db } from ".";

const getAllUsers = functions.https.onCall(
  async (request) => {
    const { adminUsername } = request.data;

    // Validate required fields
    if (!adminUsername || typeof adminUsername !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Admin username is required"
      );
    }

    // Get all users
    const usersSnapshot = await db.collection("users").get();

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      // Remove password from response for security
      const { password, ...userData } = data;
      return {
        id: doc.id,
        ...userData,
      };
    });

    return {
      users,
      count: users.length,
    };
  }
);

export default getAllUsers;

