import { useState, useEffect } from "react";
import "./ScrollToTop.css";

export function ScrollToTop(): React.ReactElement {
  const [isVisible, setIsVisible] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down even slightly
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
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
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return <></>;
  }

  return (
    <button
      className="scroll-to-top"
      onClick={scrollToTop}
      aria-label="חזור למעלה"
    >
      ↑
    </button>
  );
}
