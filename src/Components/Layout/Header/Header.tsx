import { useState, useEffect } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  authStore,
  isLoggedIn,
} from "../../../Context/AuthState";
import "./Header.css";
import nirImage from "../../../assets/nir.webp";

export function Header(): React.ReactElement {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] =
    useState(isLoggedIn());

  // Subscribe to auth store changes
  useEffect(() => {
    const unsubscribe = authStore.subscribe(
      () => {
        setIsAuthenticated(isLoggedIn());
      }
    );
    return unsubscribe;
  }, []);

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname === `${path}/`
    );
  };

  return (
    <div className="Header">
      <div className="header-container">
        <div className="header-image">
          <img
            src={nirImage}
            alt="ניר רפאל קנניאן"
          />
        </div>
        <div className="header-text">
          <h2>
            לזכרו של סמ"ר ניר רפאל קנניאן הי"ד
          </h2>
          <h3>
            לוחם סיירת גבעתי אשר נפל במלחמת חרבות
            ברזל{" "}
          </h3>
          <p className="header-quote">
            "תאהבו את החיים שאתם חיים, תחיו את
            החיים שאתם אוהבים"
          </p>
        </div>
        <div className="header-buttons">
          <Link
            to="/"
            className={`header-button ${
              isActive("/") ? "active" : ""
            }`}
          >
            אודות ניר
          </Link>
          <Link
            to="/memories"
            className={`header-button ${
              isActive("/memories")
                ? "active"
                : ""
            }`}
          >
            זכרונות מניר
          </Link>
          {isAuthenticated && (
            <Link
              to="/admin"
              className={`header-button ${
                isActive("/admin") ||
                location.pathname.startsWith(
                  "/admin"
                )
                  ? "active"
                  : ""
              }`}
            >
              לוח בקרה
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
