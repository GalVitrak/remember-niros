import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import adminService from "../../../Services/AdminService";
import {
  showSuccess,
  showError,
  confirmDanger,
} from "../../../utils/notifications";
import { Modal, Input } from "antd";
import "./UserManagement.css";

interface User {
  id: string;
  username: string;
  role: boolean;
  createdBy?: string;
}

export default function UserManagement(): React.ReactElement {
  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);
  const [
    changingPasswordId,
    setChangingPasswordId,
  ] = useState<string | null>(null);
  const [
    passwordModalVisible,
    setPasswordModalVisible,
  ] = useState(false);
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);

  const username = localStorage.getItem(
    "adminUsername"
  );

  // Use useCollection hook for real-time updates
  const usersQuery = query(
    collection(db, "users")
  );
  const [usersSnapshot, loading, error] =
    useCollection(usersQuery);

  // Transform Firestore documents to User objects, excluding passwords
  const users: User[] =
    usersSnapshot?.docs.map((doc) => {
      const data = doc.data();
      // Exclude password from the user object
      const { password, ...userData } = data;
      return {
        id: doc.id,
        username: userData.username || "",
        role: userData.role || false,
        createdBy: userData.createdBy,
      };
    }) || [];

  const handleDelete = async (
    userId: string,
    userUsername: string
  ) => {
    if (!username) {
      showError("שגיאה: לא מחובר כמנהל");
      return;
    }
    confirmDanger(
      "מחיקת משתמש",
      `האם אתה בטוח שברצונך למחוק את המשתמש "${userUsername}"? פעולה זו אינה הפיכה.`,
      async () => {
        try {
          setDeletingId(userId);
          await adminService.deleteUser(
            userId,
            username
          );
          showSuccess("המשתמש נמחק בהצלחה");
          // No need to reload - useCollection will automatically update
        } catch (error: any) {
          console.error(
            "Error deleting user:",
            error
          );
          if (
            error.code === "failed-precondition"
          ) {
            showError(
              "לא ניתן למחוק את החשבון שלך"
            );
          } else {
            showError("שגיאה במחיקת המשתמש");
          }
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handleChangePassword = (
    userId: string
  ) => {
    setSelectedUserId(userId);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalVisible(true);
  };

  const handlePasswordSubmit = async () => {
    if (!username || !selectedUserId) return;

    if (newPassword.length < 6) {
      showError(
        "הסיסמה חייבת להכיל לפחות 6 תווים"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("הסיסמאות אינן תואמות");
      return;
    }

    try {
      setChangingPasswordId(selectedUserId);
      await adminService.changeUserPassword(
        selectedUserId,
        newPassword,
        username
      );
      showSuccess("הסיסמה שונתה בהצלחה");
      setPasswordModalVisible(false);
      setNewPassword("");
      setConfirmPassword("");
      setSelectedUserId(null);
    } catch (error) {
      console.error(
        "Error changing password:",
        error
      );
      showError("שגיאה בשינוי הסיסמה");
    } finally {
      setChangingPasswordId(null);
    }
  };

  if (loading) {
    return (
      <div className="UserManagement">
        <div className="loading-state">
          <p>טוען משתמשים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="UserManagement">
        <div className="error-state">
          <p>
            שגיאה בטעינת המשתמשים: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="UserManagement">
      <div className="user-management-header">
        <h2>ניהול משתמשים</h2>
        <p>
          צפייה, מחיקה ושינוי סיסמאות למשתמשים
        </p>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>אין משתמשים במערכת</p>
        </div>
      ) : (
        <div className="users-list">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
            >
              <div className="user-info">
                <div className="user-details">
                  <h3>{user.username}</h3>
                  <div className="user-meta">
                    <span
                      className={`role-badge ${
                        user.role
                          ? "admin"
                          : "user"
                      }`}
                    >
                      {user.role
                        ? "מנהל"
                        : "משתמש"}
                    </span>
                    {user.createdBy && (
                      <span className="created-by">
                        נוצר על ידי:{" "}
                        {user.createdBy}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="user-actions">
                <button
                  className="change-password-btn"
                  onClick={() =>
                    handleChangePassword(user.id)
                  }
                  disabled={
                    changingPasswordId === user.id
                  }
                >
                  {changingPasswordId === user.id
                    ? "משנה..."
                    : "שנה סיסמה"}
                </button>
                <button
                  className="delete-user-btn"
                  onClick={() =>
                    handleDelete(
                      user.id,
                      user.username
                    )
                  }
                  disabled={
                    deletingId === user.id ||
                    user.username === username
                  }
                >
                  {deletingId === user.id
                    ? "מוחק..."
                    : "מחק"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="שינוי סיסמה"
        open={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setPasswordModalVisible(false);
          setNewPassword("");
          setConfirmPassword("");
          setSelectedUserId(null);
        }}
        okText="שנה סיסמה"
        cancelText="ביטול"
        confirmLoading={
          changingPasswordId !== null
        }
        centered
      >
        <div className="password-form">
          <div className="form-group">
            <label>סיסמה חדשה:</label>
            <Input.Password
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="הכנס סיסמה חדשה (לפחות 6 תווים)"
              disabled={
                changingPasswordId !== null
              }
            />
          </div>
          <div className="form-group">
            <label>אימות סיסמה:</label>
            <Input.Password
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="אמת את הסיסמה"
              disabled={
                changingPasswordId !== null
              }
              onPressEnter={handlePasswordSubmit}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
