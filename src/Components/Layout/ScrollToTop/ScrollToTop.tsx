import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UpOutlined } from "@ant-design/icons";
import "./ScrollToTop.css";

export function ScrollToTop(): React.ReactElement {
  const location = useLocation();
  const [isVisible, setIsVisible] =
    useState(false);

  const resetAllScroll = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const allElements =
      document.querySelectorAll("*");
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.scrollTop > 0) {
        htmlEl.scrollTop = 0;
      }
    });
  };

  const scrollAllToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const allElements =
      document.querySelectorAll("*");
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.scrollTop > 0) {
        htmlEl.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  };

  const findScrollableElements =
    (): HTMLElement[] => {
      const allElements =
        document.querySelectorAll("*");
      const scrollableElements: HTMLElement[] =
        [];

      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const style =
          window.getComputedStyle(htmlEl);
        const isScrollable =
          style.overflowY === "auto" ||
          style.overflowY === "scroll" ||
          style.overflow === "auto" ||
          style.overflow === "scroll" ||
          (htmlEl.scrollHeight >
            htmlEl.clientHeight &&
            htmlEl.scrollHeight > 0);

        if (
          isScrollable &&
          !scrollableElements.includes(htmlEl)
        ) {
          scrollableElements.push(htmlEl);
        }
      });

      return scrollableElements;
    };

  useEffect(() => {
    resetAllScroll();
    const timer1 = setTimeout(resetAllScroll, 0);
    const timer2 = setTimeout(resetAllScroll, 10);
    const timer3 = setTimeout(resetAllScroll, 50);

    setIsVisible(false);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const windowScroll =
        window.scrollY ||
        document.documentElement.scrollTop ||
        0;

      const allElements =
        document.querySelectorAll("*");
      let maxScroll = windowScroll;

      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const scrollTop = htmlEl.scrollTop || 0;
        if (scrollTop > maxScroll) {
          maxScroll = scrollTop;
        }
      });

      setIsVisible(maxScroll > 0);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    const scrollableElements =
      findScrollableElements();
    scrollableElements.forEach((el) => {
      el.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
      );
    });

    const interval = setInterval(() => {
      const newElements =
        findScrollableElements();
      newElements.forEach((el) => {
        if (!scrollableElements.includes(el)) {
          scrollableElements.push(el);
          el.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
          );
        }
      });
    }, 1000);

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
      scrollableElements.forEach((el) => {
        el.removeEventListener(
          "scroll",
          handleScroll
        );
      });
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) {
    return <></>;
  }

  return (
    <button
      className="scroll-to-top"
      onClick={scrollAllToTop}
      aria-label="חזור למעלה"
    >
      <UpOutlined />
    </button>
  );
}
