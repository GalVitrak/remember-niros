import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./MemoryCard.css";
import MemoryModel from "../../../Models/MemoryModel";

interface MemoryCardProps {
  memory: MemoryModel;
}

function MemoryCard(
  props: MemoryCardProps
): React.ReactElement {
  const { memory } = props;
  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] = useState<number | null>(null);

  // Get all images (support both imageUrl for backward compatibility and imageUrls array)
  const getAllImages = (): string[] => {
    if (
      memory.imageUrls &&
      memory.imageUrls.length > 0
    ) {
      return memory.imageUrls;
    }
    if (memory.imageUrl) {
      return [memory.imageUrl];
    }
    return [];
  };

  const images = getAllImages();

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeGallery = () => {
    setSelectedImageIndex(null);
  };

  // Handle body scroll lock when gallery is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      // Store original overflow value
      const originalOverflow =
        document.body.style.overflow;
      const originalPaddingRight =
        document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth -
        document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow =
          originalOverflow;
        document.body.style.paddingRight =
          originalPaddingRight;
      };
    }
  }, [selectedImageIndex]);

  const navigateImage = (
    direction: "prev" | "next"
  ) => {
    if (selectedImageIndex === null) return;

    if (direction === "prev") {
      setSelectedImageIndex(
        selectedImageIndex === 0
          ? images.length - 1
          : selectedImageIndex - 1
      );
    } else {
      setSelectedImageIndex(
        selectedImageIndex === images.length - 1
          ? 0
          : selectedImageIndex + 1
      );
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (selectedImageIndex === null) return;

    if (e.key === "Escape") {
      closeGallery();
    } else if (e.key === "ArrowLeft") {
      navigateImage("prev");
    } else if (e.key === "ArrowRight") {
      navigateImage("next");
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "לאחרונה";

    // Format as dd/mm/yyyy hh:MM
    const day = String(date.getDate()).padStart(
      2,
      "0"
    );
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(
      date.getHours()
    ).padStart(2, "0");
    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="MemoryCard">
      <div className="memory-card-header">
        <div className="memory-author">
          <div className="author-avatar">
            {memory.writer?.[0]?.toUpperCase() ||
              "א"}
          </div>
          <div className="author-info">
            <div className="author-name">
              {memory.writer || "אנונימי"}
            </div>
            <div className="memory-date">
              {formatDate(memory.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {memory.memory && (
        <div className="memory-content">
          <p>{memory.memory}</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="memory-images-container">
          {images.length === 1 ? (
            <div
              className="memory-image-container single-image"
              onClick={() => openGallery(0)}
            >
              <img
                src={images[0]}
                alt={`זכרון מניר - ${
                  memory.writer || "אנונימי"
                }`}
                className="memory-image"
              />
              <div className="image-overlay">
                <span className="view-icon">
                  👁
                </span>
              </div>
            </div>
          ) : (
            <div className="memory-images-grid">
              {images
                .slice(0, 4)
                .map((url, index) => (
                  <div
                    key={index}
                    className="memory-image-container"
                    onClick={() =>
                      openGallery(index)
                    }
                  >
                    <img
                      src={url}
                      alt={`זכרון מניר - תמונה ${
                        index + 1
                      } - ${
                        memory.writer || "אנונימי"
                      }`}
                      className="memory-image"
                    />
                    <div className="image-overlay">
                      <span className="view-icon">
                        👁
                      </span>
                    </div>
                    {images.length > 4 &&
                      index === 3 && (
                        <div className="more-images-overlay">
                          +{images.length - 4}
                        </div>
                      )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Gallery Modal - Rendered via Portal */}
      {selectedImageIndex !== null &&
        createPortal(
          <div
            className="gallery-modal"
            onClick={closeGallery}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              className="gallery-close-btn"
              onClick={closeGallery}
              aria-label="סגור"
            >
              ✕
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="gallery-nav-btn gallery-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                  aria-label="תמונה קודמת"
                >
                  ‹
                </button>
                <button
                  className="gallery-nav-btn gallery-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                  aria-label="תמונה הבאה"
                >
                  ›
                </button>
              </>
            )}

            <div
              className="gallery-image-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImageIndex]}
                alt={`זכרון מניר - תמונה ${
                  selectedImageIndex + 1
                } מתוך ${images.length} - ${
                  memory.writer || "אנונימי"
                }`}
                className="gallery-image"
                loading="eager"
              />
            </div>

            {images.length > 1 && (
              <div className="gallery-counter">
                {selectedImageIndex + 1} /{" "}
                {images.length}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

export default MemoryCard;
