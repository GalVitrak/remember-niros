import * as functions from "firebase-functions";
import { db } from "./index";
import cyber from "./cyber";

const login = functions.https.onCall(
  async (request) => {
    const { credentials } = request.data;

    const user = await db
      .collection("users")
      .where(
        "username",
        "==",
        credentials.username
      )
      .get();

    // Use a dummy hash if user doesn't exist to prevent timing attacks
    // and user enumeration. bcrypt.compare will take similar time regardless.
    const dummyHash =
      "$2b$10$dummyHashForSecurityPurposesOnly1234567890123456789012";
    const passwordHash = user.empty
      ? dummyHash
      : user.docs[0].data().password;

    // Always perform password comparison, even if user doesn't exist
    // This prevents timing attacks and user enumeration
    const isPasswordValid =
      await cyber.comparePassword(
        credentials.password,
        passwordHash
      );

    // Return the same error for both invalid username and password
    // to prevent user enumeration attacks
    if (user.empty || !isPasswordValid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid username or password"
      );
    }

    const userData = user.docs[0].data();
    delete userData.password;

    const token = cyber.getNewToken({
      user: userData,
    });

    return token;
  }
);

export default login;
