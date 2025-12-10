import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase-config";

class AdminService {
  public async approveMemory(
    memoryId: string,
    adminUsername: string
  ): Promise<void> {
    try {
      const approveMemory = httpsCallable(
        functions,
        "approveMemory"
      );
      await approveMemory({
        memoryId,
        adminUsername,
      });
    } catch (error) {
      console.error("Error approving memory:", error);
      throw error;
    }
  }

  public async rejectMemory(
    memoryId: string,
    adminUsername: string
  ): Promise<void> {
    try {
      const rejectMemory = httpsCallable(
        functions,
        "rejectMemory"
      );
      await rejectMemory({
        memoryId,
        adminUsername,
      });
    } catch (error) {
      console.error("Error rejecting memory:", error);
      throw error;
    }
  }

  public async removeMemoryImages(
    memoryId: string,
    imageUrls: string[],
    adminUsername: string
  ): Promise<void> {
    try {
      const removeMemoryImages = httpsCallable(
        functions,
        "removeMemoryImages"
      );
      await removeMemoryImages({
        memoryId,
        imageUrls,
        adminUsername,
      });
    } catch (error) {
      console.error("Error removing images:", error);
      throw error;
    }
  }

  public async deleteMemory(
    memoryId: string,
    adminUsername: string
  ): Promise<void> {
    try {
      const deleteMemory = httpsCallable(
        functions,
        "deleteMemory"
      );
      await deleteMemory({
        memoryId,
        adminUsername,
      });
    } catch (error) {
      console.error("Error deleting memory:", error);
      throw error;
    }
  }

  public async createAdmin(user: {
    username: string;
    password: string;
    createdBy: string;
  }): Promise<void> {
    try {
      const register = httpsCallable(
        functions,
        "register"
      );
      await register({
        user: {
          username: user.username,
          password: user.password,
          role: true, // Admin role
          createdBy: user.createdBy,
        },
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  }

  public async deleteUser(
    userId: string,
    adminUsername: string
  ): Promise<void> {
    try {
      const deleteUser = httpsCallable(
        functions,
        "deleteUser"
      );
      await deleteUser({
        userId,
        adminUsername,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  public async changeUserPassword(
    userId: string,
    newPassword: string,
    adminUsername: string
  ): Promise<void> {
    try {
      const changeUserPassword = httpsCallable(
        functions,
        "changeUserPassword"
      );
      await changeUserPassword({
        userId,
        newPassword,
        adminUsername,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;

