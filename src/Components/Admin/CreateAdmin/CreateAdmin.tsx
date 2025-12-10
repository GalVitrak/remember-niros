import { useState } from "react";
import { useForm } from "react-hook-form";
import adminService from "../../../Services/AdminService";
import {
  showSuccess,
  showError,
} from "../../../utils/notifications";
import "./CreateAdmin.css";

interface CreateAdminForm {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function CreateAdmin(): React.ReactElement {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateAdminForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const username = localStorage.getItem("adminUsername");

  const password = watch("password");

  const onSubmit = async (data: CreateAdminForm) => {
    if (data.password !== data.confirmPassword) {
      showError("הסיסמאות אינן תואמות");
      return;
    }

    if (!username) {
      showError("שגיאה: לא מחובר כמנהל");
      return;
    }

    try {
      setIsSubmitting(true);
      await adminService.createAdmin({
        username: data.username,
        password: data.password,
        createdBy: username,
      });
      showSuccess("המנהל נוצר בהצלחה");
      reset();
    } catch (error: any) {
      console.error("Error creating admin:", error);
      if (error.code === "already-exists") {
        showError("שם המשתמש כבר קיים");
      } else {
        showError("שגיאה ביצירת המנהל. נסה שוב.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="CreateAdmin">
      <div className="create-admin-header">
        <h2>יצירת מנהל חדש</h2>
        <p>הוסף מנהל חדש למערכת</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="create-admin-form">
        <div className="form-group">
          <label htmlFor="username">שם משתמש:</label>
          <input
            id="username"
            type="text"
            {...register("username", {
              required: "שם משתמש הוא שדה חובה",
              minLength: {
                value: 3,
                message: "שם המשתמש חייב להכיל לפחות 3 תווים",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "שם המשתמש יכול להכיל רק אותיות, מספרים ותו תחתון",
              },
            })}
            placeholder="הכנס שם משתמש"
            disabled={isSubmitting}
          />
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">סיסמה:</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "סיסמה היא שדה חובה",
              minLength: {
                value: 6,
                message: "הסיסמה חייבת להכיל לפחות 6 תווים",
              },
            })}
            placeholder="הכנס סיסמה"
            disabled={isSubmitting}
          />
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">אימות סיסמה:</label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "אנא אמת את הסיסמה",
              validate: (value) =>
                value === password || "הסיסמאות אינן תואמות",
            })}
            placeholder="אמת את הסיסמה"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <span className="error-message">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "יוצר..." : "צור מנהל"}
        </button>
      </form>
    </div>
  );
}

