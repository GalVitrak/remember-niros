import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  authStore,
  AuthActionType,
  isLoggedIn,
} from "../../../Context/AuthState";
import "./AdminDashboard.css";
import ApproveMemories from "../ApproveMemories/ApproveMemories";
import CreateAdmin from "../CreateAdmin/CreateAdmin";
import UserManagement from "../UserManagement/UserManagement";

export function AdminDashboard(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] =
    useState(isLoggedIn());
  const activeTab =
    location.pathname.split("/admin/")[1] ||
    "approve";
  const username = localStorage.getItem(
    "adminUsername"
  );

  // Subscribe to auth store changes
  useEffect(() => {
    const unsubscribe = authStore.subscribe(
      () => {
        setIsAuthenticated(isLoggedIn());
      }
    );
    return unsubscribe;
  }, []);

  // Redirect to /admin/approve if just /admin
  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/all", {
        replace: true,
      });
    }
  }, [location.pathname, navigate]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    authStore.dispatch({
      type: AuthActionType.Logout,
    });
    localStorage.removeItem("adminUsername");
    navigate("/");
  };

  const adminOptions = [
    {
      id: "all",
      label: "כל הזכרונות",
      icon: "📋",
      path: "/admin/all",
    },
    {
      id: "create-admin",
      label: "צור מנהל",
      icon: "👤",
      path: "/admin/create-admin",
    },
    {
      id: "users",
      label: "ניהול משתמשים",
      icon: "👥",
      path: "/admin/users",
    },
  ];

  return (
    <div className="AdminDashboard">
      <div className="admin-header">
        <div>
          <h1>לוח בקרה - מנהל</h1>
          <p>ניהול הזכרונות והתוכן באתר</p>
          {username && (
            <p className="admin-user-info">
              מחובר כ: {username}
            </p>
          )}
        </div>
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          התנתק
        </button>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            {adminOptions.map((option) => (
              <Link
                key={option.id}
                to={option.path}
                className={`admin-nav-button ${
                  activeTab === option.id
                    ? "active"
                    : ""
                }`}
              >
                <span className="admin-nav-icon">
                  {option.icon}
                </span>
                <span className="admin-nav-label">
                  {option.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="admin-content">
          {activeTab === "approve" && (
            <ApproveMemories initialStatus="pending" />
          )}
          {activeTab === "pending" && (
            <ApproveMemories initialStatus="pending" />
          )}
          {activeTab === "all" && (
            <ApproveMemories initialStatus="all" />
          )}
          {activeTab === "create-admin" && (
            <CreateAdmin />
          )}
          {activeTab === "users" && (
            <UserManagement />
          )}
        </div>
      </div>
    </div>
  );
}
