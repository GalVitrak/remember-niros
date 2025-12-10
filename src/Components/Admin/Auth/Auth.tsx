import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import React from "react";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import {
  authStore,
  AuthActionType,
} from "../../../Context/AuthState";
import { showError } from "../../../utils/notifications";

function Auth(): React.ReactElement {
  const { register, handleSubmit } =
    useForm<CredentialsModel>();
  const navigate = useNavigate();

  async function sendCredentials(
    credentials: CredentialsModel
  ) {
    try {
      const token = await authService.login(
        credentials
      );
      // Store token in auth store
      authStore.dispatch({
        type: AuthActionType.Login,
        payload: { token },
      });
      // Store username separately in localStorage for admin operations
      localStorage.setItem(
        "adminUsername",
        credentials.username
      );
      // Redirect to admin dashboard
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      showError("שגיאה בהתחברות. נסה שוב.");
    }
  }

  return (
    <div className="Auth">
      <div className="auth-container">
        <div className="auth-form">
          <form
            onSubmit={handleSubmit(
              sendCredentials
            )}
          >
            <div className="input-group">
              <input
                type="text"
                placeholder="שם משתמש"
                {...register("username")}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="סיסמה"
                {...register("password")}
              />
            </div>
            <button
              className="submit-button"
              type="submit"
            >
              התחבר
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
