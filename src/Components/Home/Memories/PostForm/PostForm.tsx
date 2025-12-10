import { useState, useRef } from "react";
import "./PostForm.css";
import type MemoryModel from "../../../../Models/MemoryModel";
import { useForm } from "react-hook-form";
import memoryService from "../../../../Services/MemoryService";
import {
  showError,
  showWarning,
} from "../../../../utils/notifications";

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

function PostForm({
  isOpen,
  onClose,
  onPostCreated,
}: PostFormProps): React.ReactElement {
  const [images, setImages] = useState<File[]>(
    []
  );
  const [imageUrls, setImageUrls] = useState<
    string[]
  >([]);
  const [isUploading, setIsUploading] =
    useState(false);
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const { register, handleSubmit } =
    useForm<MemoryModel>();

  async function sendMemory(memory: MemoryModel) {
    try {
      setIsUploading(true);
      let uploadedImageUrls: string[] = [];

      // Upload all images to backend if provided
      if (images.length > 0) {
        // Convert images to base64
        const base64Promises = images.map(
          (file) => {
            return new Promise<string>(
              (resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(
                    reader.result as string
                  );
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
              }
            );
          }
        );

        const base64Images = await Promise.all(
          base64Promises
        );

        // Upload via backend service
        uploadedImageUrls =
          await memoryService.uploadImages(
            base64Images
          );
      }

      // Prepare memory data with image URLs
      const memoryData: MemoryModel = {
        memory: memory.memory.trim(),
        writer:
          memory.writer?.trim() || "אנונימי",
        imageUrls:
          uploadedImageUrls.length > 0
            ? uploadedImageUrls
            : undefined,
      };

      // Send to backend for validation and document creation
      await memoryService.addMemory(memoryData);

      // Reset form
      setImages([]);
      setImageUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Close modal and notify parent
      onClose();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error(
        "Error creating post:",
        error
      );
      showError("שגיאה ביצירת הפוסט. נסה שוב.");
    } finally {
      setIsUploading(false);
    }
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );
    const remainingSlots = 5 - images.length;

    if (files.length > remainingSlots) {
      showWarning(
        `ניתן להעלות עד 5 תמונות. נשארו ${remainingSlots} מקומות.`
      );
      return;
    }

    const newFiles = files.slice(
      0,
      remainingSlots
    );
    const updatedImages = [
      ...images,
      ...newFiles,
    ];
    setImages(updatedImages);

    // Create preview URLs for all images using Promise.all
    const previewPromises = newFiles.map(
      (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      }
    );

    Promise.all(previewPromises).then(
      (newPreviewUrls) => {
        setImageUrls((prevUrls) => [
          ...prevUrls,
          ...newPreviewUrls,
        ]);
      }
    );
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter(
      (_, i) => i !== index
    );
    const updatedUrls = imageUrls.filter(
      (_, i) => i !== index
    );
    setImages(updatedImages);
    setImageUrls(updatedUrls);
  };

  if (!isOpen) return <></>;

  return (
    <div
      className="PostForm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="post-form-modal">
        <div className="post-form-header">
          <h3>שתף זכרון על ניר</h3>
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="סגור"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit(sendMemory)}
          className="post-form"
        >
          <div className="post-form-body">
            <input
              type="text"
              className="post-writer-input"
              placeholder="שמך (אופציונלי)"
              {...register("writer")}
            />
            <textarea
              className="post-textarea"
              placeholder="מה אתה רוצה לשתף?"
              {...register("memory")}
              rows={4}
            />
            {imageUrls.length > 0 && (
              <div className="images-preview-grid">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="image-preview-container"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() =>
                        handleRemoveImage(index)
                      }
                      aria-label="הסר תמונה"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="post-form-footer">
            <div className="post-form-actions">
              <label className="image-upload-label">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="image-upload-input"
                  disabled={images.length >= 5}
                />
                <span className="image-upload-text">
                  📷 הוסף תמונות ({images.length}
                  /5)
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="post-submit-btn"
              disabled={isUploading}
            >
              {isUploading ? "מפרסם..." : "פרסם"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
