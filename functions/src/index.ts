import * as admin from "firebase-admin";
import login from "./login";
import register from "./register";
import addMemory from "./addMemory";
import approveMemory from "./approveMemory";
import rejectMemory from "./rejectMemory";
import removeMemoryImages from "./removeMemoryImages";
import deleteMemory from "./deleteMemory";
import getAllUsers from "./getAllUsers";
import deleteUser from "./deleteUser";
import changeUserPassword from "./changeUserPassword";
import uploadImages from "./uploadImages";

admin.initializeApp();

export const db = admin.firestore();

exports.login = login;
exports.register = register;
exports.addMemory = addMemory;
exports.approveMemory = approveMemory;
exports.rejectMemory = rejectMemory;
exports.removeMemoryImages = removeMemoryImages;
exports.deleteMemory = deleteMemory;
exports.getAllUsers = getAllUsers;
exports.deleteUser = deleteUser;
exports.changeUserPassword = changeUserPassword;
exports.uploadImages = uploadImages;
