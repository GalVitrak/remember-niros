import * as functions from "firebase-functions";
import { db } from "./index";
import cyber from "./cyber";

const register = functions.https.onCall(
  async (request) => {
    const { user } = request.data;

    // Check if the username is already taken
    const checkUser = await db
      .collection("users")
      .where("username", "==", user.username)
      .get();
    if (checkUser.docs.length > 0) {
      throw new functions.https.HttpsError(
        "already-exists",
        "Username already taken"
      );
    }

    // hash the password
    const hashedPassword =
      await cyber.hashPassword(user.password);
    user.password = hashedPassword;

    // add the user to the database
    await db.collection("users").add(user);
    return {
      message: "User registered successfully",
    };
  }
);

export default register;
