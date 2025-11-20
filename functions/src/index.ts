import * as admin from "firebase-admin";
import login from "./login";
import register from "./register";

admin.initializeApp();

export const db = admin.firestore();

exports.login = login;
exports.register = register;
