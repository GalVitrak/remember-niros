import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase-config";
import CredentialsModel from "../Models/CredentialsModel";

class AuthService {
  public async login(
    credentials: CredentialsModel
  ): Promise<string> {
    try {
      const login = httpsCallable(
        functions,
        "login"
      );
      const result = await login({
        credentials: credentials,
      });
      return result.data as string;
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
