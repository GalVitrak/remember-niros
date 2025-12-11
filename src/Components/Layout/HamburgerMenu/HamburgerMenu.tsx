import {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  authStore,
  isLoggedIn,
} from "../../../Context/AuthState";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import "./HamburgerMenu.css";

export function HamburgerMenu(): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        ) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname === `${path}/`
    );
  };

  return (
    <>
      <button
        className={`hamburger-menu-button ${
          isMenuOpen ? "hidden" : ""
        }`}
        onClick={toggleMenu}
        aria-label="תפריט"
        aria-expanded={isMenuOpen}
      >
        <MenuOutlined />
      </button>
      {isMenuOpen && (
        <div
          className="menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <div
        ref={menuRef}
        className={`hamburger-menu-nav ${
          isMenuOpen ? "show" : ""
        }`}
      >
        <button
          className="hamburger-close-button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="סגור תפריט"
        >
          <CloseOutlined />
        </button>
        <Link
          to="/"
          className={`hamburger-nav-button ${
            isActive("/") ? "active" : ""
          }`}
          onClick={handleNavigation}
        >
          אודות ניר
        </Link>
        <Link
          to="/memories"
          className={`hamburger-nav-button ${
            isActive("/memories")
              ? "active"
              : ""
          }`}
          onClick={handleNavigation}
        >
          זכרונות מניר
        </Link>
        {isAuthenticated && (
          <Link
            to="/admin"
            className={`hamburger-nav-button ${
              isActive("/admin") ||
              location.pathname.startsWith(
                "/admin"
              )
                ? "active"
                : ""
            }`}
            onClick={handleNavigation}
          >
            לוח בקרה
          </Link>
        )}
      </div>
    </>
  );
}

