import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { db } from ".";

const addMemory = functions.https.onCall(
  async (request) => {
    const { memory } = request.data;
    await db.collection("memories").add({
      memory,
      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),
      status: "pending",
    });
    return {
      message: "Memory added successfully",
    };
  }
);

export default addMemory;
