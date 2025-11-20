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
      console.log(result.data);
      return result.data as string;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
