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
import "./Header.css";
import nirImage from "../../../assets/nir.webp";

export function Header(): React.ReactElement {
  const [isScrolled, setIsScrolled] =
    useState(false);
  const [lastScrollY, setLastScrollY] =
    useState(0);
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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only show header when at the top of the page
      if (currentScrollY < 10) {
        setIsScrolled(false);
      } else {
        // Hide header when scrolled down
        setIsScrolled(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );
    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [lastScrollY]);

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

      // Prevent body scroll when menu is open on mobile
      // Use requestAnimationFrame to prevent layout shift during animation
      requestAnimationFrame(() => {
        const scrollbarWidth =
          window.innerWidth -
          document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
      });
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname === `${path}/`
    );
  };

  return (
    <div
      className={`Header ${
        isScrolled ? "header-hidden" : ""
      } ${isMenuOpen ? "menu-open" : ""}`}
    >
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
        <button
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="תפריט"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        {isMenuOpen && (
          <div
            className="menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <div
          ref={menuRef}
          className={`nav-buttons ${
            isMenuOpen ? "show" : ""
          }`}
        >
          <Link
            to="/"
            className={`nav-button ${
              isActive("/") ? "active" : ""
            }`}
            onClick={handleNavigation}
          >
            אודות ניר{" "}
          </Link>
          <Link
            to="/memories"
            className={`nav-button ${
              isActive("/memories")
                ? "active"
                : ""
            }`}
            onClick={handleNavigation}
          >
            זכרונות מניר{" "}
          </Link>
          {isAuthenticated && (
            <Link
              to="/admin"
              className={`nav-button ${
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
      </div>
    </div>
  );
}
