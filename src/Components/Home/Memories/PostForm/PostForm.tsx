import { useState, useRef } from "react";
import "./PostForm.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../../../../firebase-config";

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

function PostForm({ isOpen, onClose, onPostCreated }: PostFormProps): React.ReactElement {
  const [text, setText] = useState("");
  const [writerName, setWriterName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setIsUploading(true);
    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (image) {
        const imageRef = ref(
          storage,
          `memories/${Date.now()}_${image.name}`
        );
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Use provided name or default to "אורח" (Guest)
      const finalWriterName = writerName.trim() || "אורח";

      // Add memory to Firestore
      await addDoc(collection(db, "memories"), {
        memory: text.trim(),
        writer: finalWriterName,
        imageUrl: imageUrl || null,
        createdAt: serverTimestamp(),
        status: "approved", // Auto-approve for now, or change to "pending" for moderation
      });

      // Reset form
      setText("");
      setWriterName("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Close modal and notify parent
      onClose();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("שגיאה ביצירת הפוסט. נסה שוב.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="PostForm" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
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
        <form onSubmit={handleSubmit} className="post-form">
        <div className="post-form-body">
          <input
            type="text"
            className="post-writer-input"
            placeholder="שמך (אופציונלי)"
            value={writerName}
            onChange={(e) => setWriterName(e.target.value)}
          />
          <textarea
            className="post-textarea"
            placeholder="מה אתה רוצה לשתף?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
          {imagePreview && (
            <div className="image-preview-container">
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview"
              />
              <button
                type="button"
                className="remove-image-btn"
                onClick={handleRemoveImage}
              >
                ✕
              </button>
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
                onChange={handleImageChange}
                className="image-upload-input"
              />
              <span className="image-upload-text">📷 הוסף תמונה</span>
            </label>
          </div>
          <button
            type="submit"
            className="post-submit-btn"
            disabled={isUploading || (!text.trim() && !image)}
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

