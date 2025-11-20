import { useForm } from "react-hook-form";
import "./Auth.css";
import React from "react";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";

function Auth(): React.ReactElement {
  const { register, handleSubmit } =
    useForm<CredentialsModel>();

  async function sendCredentials(
    credentials: CredentialsModel
  ) {
    console.log(credentials);
    const token = await authService.login(
      credentials
    );
    console.log(token);
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
