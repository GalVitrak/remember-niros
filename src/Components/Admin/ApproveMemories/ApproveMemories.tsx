import { useState, useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import MemoryModel from "../../../Models/MemoryModel";
import MemoryCard from "../../Cards/MemoryCard/MemoryCard";
import adminService from "../../../Services/AdminService";
import {
  showSuccess,
  showError,
  confirmDanger,
} from "../../../utils/notifications";
import "./ApproveMemories.css";

interface ApproveMemoriesProps {
  initialStatus?: "pending" | "all";
}

export default function ApproveMemories({
  initialStatus = "pending",
}: ApproveMemoriesProps = {}): React.ReactElement {
  const [selectedStatus, setSelectedStatus] =
    useState<"pending" | "all">(initialStatus);
  const [processingId, setProcessingId] =
    useState<string | null>(null);
  const [
    removingImagesFrom,
    setRemovingImagesFrom,
  ] = useState<string | null>(null);
  const [
    selectedImagesToRemove,
    setSelectedImagesToRemove,
  ] = useState<{
    [memoryId: string]: string[];
  }>({});

  // Always fetch all memories, filter client-side
  const memoriesQuery = useMemo(() => {
    return query(collection(db, "memories"));
  }, []);

  const [memoriesSnapshot, loading, error] =
    useCollection(memoriesQuery);

  // Parse all memories
  const allMemoriesData = useMemo(() => {
    if (!memoriesSnapshot) return [];
    return memoriesSnapshot.docs.map((doc) => {
      const data = doc.data();
      let createdAt: Date | undefined;
      if (data.createdAt) {
        if (data.createdAt.toDate) {
          createdAt = data.createdAt.toDate();
        } else if (
          data.createdAt instanceof Date
        ) {
          createdAt = data.createdAt;
        }
      }

      let approvedAt: Date | undefined;
      if (data.ApprovedAt) {
        if (data.ApprovedAt.toDate) {
          approvedAt = data.ApprovedAt.toDate();
        } else if (
          data.ApprovedAt instanceof Date
        ) {
          approvedAt = data.ApprovedAt;
        }
      }

      return new MemoryModel(
        data.memory || "",
        data.writer || "אנונימי",
        data.imageUrl,
        data.imageUrls,
        createdAt,
        data.status,
        approvedAt,
        data.ApprovedBy,
        doc.id
      );
    });
  }, [memoriesSnapshot]);

  // Filter memories based on selected status
  const memoriesData = useMemo(() => {
    if (selectedStatus === "pending") {
      return allMemoriesData.filter(
        (m) => m.status === "pending"
      );
    }
    return allMemoriesData;
  }, [allMemoriesData, selectedStatus]);

  const getAdminUsername = (): string | null => {
    return localStorage.getItem("adminUsername");
  };

  const handleApprove = async (
    memoryId: string
  ) => {
    const username = getAdminUsername();
    if (!username) {
      showError("שגיאה: לא מחובר כמנהל");
      return;
    }
    try {
      setProcessingId(memoryId);
      await adminService.approveMemory(
        memoryId,
        username
      );
      showSuccess("הזכרון אושר בהצלחה");
    } catch (error) {
      console.error(
        "Error approving memory:",
        error
      );
      showError("שגיאה באישור הזכרון");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (
    memoryId: string,
    currentStatus?: string
  ) => {
    const username = getAdminUsername();
    if (!username) {
      showError("שגיאה: לא מחובר כמנהל");
      return;
    }
    const isApproved =
      currentStatus === "approved";
    confirmDanger(
      "דחיית זכרון",
      isApproved
        ? "האם אתה בטוח שברצונך לדחות זכרון מאושר זה?"
        : "האם אתה בטוח שברצונך לדחות זכרון זה?",
      async () => {
        try {
          setProcessingId(memoryId);
          await adminService.rejectMemory(
            memoryId,
            username
          );
          showSuccess("הזכרון נדחה בהצלחה");
        } catch (error) {
          console.error(
            "Error rejecting memory:",
            error
          );
          showError("שגיאה בדחיית הזכרון");
        } finally {
          setProcessingId(null);
        }
      }
    );
  };

  const handleDelete = async (
    memoryId: string
  ) => {
    const username = getAdminUsername();
    if (!username) {
      showError("שגיאה: לא מחובר כמנהל");
      return;
    }
    confirmDanger(
      "מחיקת זכרון",
      "האם אתה בטוח שברצונך למחוק זכרון זה לצמיתות? כל התמונות והנתונים יימחקו ולא ניתן לשחזר אותם.",
      async () => {
        try {
          setProcessingId(memoryId);
          await adminService.deleteMemory(
            memoryId,
            username
          );
          showSuccess("הזכרון נמחק בהצלחה");
        } catch (error) {
          console.error(
            "Error deleting memory:",
            error
          );
          showError("שגיאה במחיקת הזכרון");
        } finally {
          setProcessingId(null);
        }
      }
    );
  };

  const toggleImageSelection = (
    memoryId: string,
    imageUrl: string
  ) => {
    setSelectedImagesToRemove((prev) => {
      const current = prev[memoryId] || [];
      const isSelected =
        current.includes(imageUrl);
      return {
        ...prev,
        [memoryId]: isSelected
          ? current.filter(
              (url) => url !== imageUrl
            )
          : [...current, imageUrl],
      };
    });
  };

  const handleRemoveImages = async (
    memoryId: string
  ) => {
    const username = getAdminUsername();
    if (!username) {
      showError("שגיאה: לא מחובר כמנהל");
      return;
    }

    const imagesToRemove =
      selectedImagesToRemove[memoryId] || [];
    if (imagesToRemove.length === 0) {
      showError("אנא בחר תמונות להסרה");
      return;
    }

    confirmDanger(
      "מחיקת תמונות",
      `האם אתה בטוח שברצונך למחוק ${imagesToRemove.length} תמונה/ות?`,
      async () => {
        try {
          setRemovingImagesFrom(memoryId);
          await adminService.removeMemoryImages(
            memoryId,
            imagesToRemove,
            username
          );
          setSelectedImagesToRemove((prev) => {
            const updated = { ...prev };
            delete updated[memoryId];
            return updated;
          });
          showSuccess("התמונות נמחקו בהצלחה");
        } catch (error) {
          console.error(
            "Error removing images:",
            error
          );
          showError("שגיאה במחיקת התמונות");
        } finally {
          setRemovingImagesFrom(null);
        }
      }
    );
  };

  const getAllImages = (
    memory: MemoryModel
  ): string[] => {
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

  return (
    <div className="ApproveMemories">
      <div className="approve-header">
        <h2>אישור זכרונות</h2>
        <div className="status-filter">
          <button
            className={`filter-btn ${
              selectedStatus === "pending"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedStatus("pending")
            }
          >
            ממתינים (
            {
              allMemoriesData.filter(
                (m) => m.status === "pending"
              ).length
            }
            )
          </button>
          <button
            className={`filter-btn ${
              selectedStatus === "all"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedStatus("all")
            }
          >
            הכל ({allMemoriesData.length})
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <p>טוען זכרונות...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>
            שגיאה בטעינת הזכרונות: {error.message}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        memoriesData.length === 0 && (
          <div className="empty-state">
            <p>
              אין זכרונות{" "}
              {selectedStatus === "pending"
                ? "ממתינים"
                : ""}{" "}
              כרגע
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        memoriesData.length > 0 && (
          <div className="memories-list">
            {memoriesData.map((memory) => {
              const images = getAllImages(memory);
              const selectedImages =
                selectedImagesToRemove[
                  memory.id!
                ] || [];
              const isRemovingImages =
                removingImagesFrom === memory.id;
              const showImageRemoval =
                images.length > 0 &&
                (memory.status === "pending" ||
                  memory.status === "approved" ||
                  memory.status === "rejected");

              return (
                <div
                  key={memory.id}
                  className="memory-admin-card"
                >
                  <MemoryCard memory={memory} />
                  <div className="admin-actions">
                    <div className="memory-status">
                      <span
                        className={`status-badge status-${memory.status}`}
                      >
                        {memory.status ===
                          "pending" &&
                          "ממתין לאישור"}
                        {memory.status ===
                          "approved" && "אושר"}
                        {memory.status ===
                          "rejected" && "נדחה"}
                      </span>
                      {memory.ApprovedBy && (
                        <span className="approved-by">
                          נבדק על ידי:{" "}
                          {memory.ApprovedBy}
                        </span>
                      )}
                    </div>

                    {showImageRemoval && (
                      <div className="image-removal-section">
                        <h4>
                          {memory.status ===
                          "pending"
                            ? "הסרת תמונות לפני אישור:"
                            : "הסרת תמונות:"}
                        </h4>
                        <div className="images-to-remove-grid">
                          {images.map(
                            (imageUrl, index) => {
                              const isSelected =
                                selectedImages.includes(
                                  imageUrl
                                );
                              return (
                                <div
                                  key={index}
                                  className={`image-remove-item ${
                                    isSelected
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleImageSelection(
                                      memory.id!,
                                      imageUrl
                                    )
                                  }
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Image ${
                                      index + 1
                                    }`}
                                  />
                                  <div className="image-remove-overlay">
                                    {isSelected && (
                                      <span className="check-mark">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                        {selectedImages.length >
                          0 && (
                          <button
                            className="remove-images-btn"
                            onClick={() =>
                              handleRemoveImages(
                                memory.id!
                              )
                            }
                            disabled={
                              isRemovingImages
                            }
                          >
                            {isRemovingImages
                              ? "מוחק..."
                              : `מחק ${selectedImages.length} תמונה/ות`}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="action-buttons">
                      {memory.status ===
                        "pending" && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApprove(
                                memory.id!
                              )
                            }
                            disabled={
                              processingId ===
                                memory.id ||
                              isRemovingImages
                            }
                          >
                            {processingId ===
                            memory.id
                              ? "מעבד..."
                              : "אישור ✓"}
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleReject(
                                memory.id!
                              )
                            }
                            disabled={
                              processingId ===
                                memory.id ||
                              isRemovingImages
                            }
                          >
                            {processingId ===
                            memory.id
                              ? "מעבד..."
                              : "דחה ✕"}
                          </button>
                        </>
                      )}
                      {memory.status ===
                        "approved" && (
                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleReject(
                              memory.id!,
                              memory.status
                            )
                          }
                          disabled={
                            processingId ===
                              memory.id ||
                            isRemovingImages
                          }
                        >
                          {processingId ===
                          memory.id
                            ? "מעבד..."
                            : "דחה ✕"}
                        </button>
                      )}
                      {memory.status ===
                        "rejected" && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApprove(
                                memory.id!
                              )
                            }
                            disabled={
                              processingId ===
                                memory.id ||
                              isRemovingImages
                            }
                          >
                            {processingId ===
                            memory.id
                              ? "מעבד..."
                              : "אישור ✓"}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                memory.id!
                              )
                            }
                            disabled={
                              processingId ===
                                memory.id ||
                              isRemovingImages
                            }
                          >
                            {processingId ===
                            memory.id
                              ? "מעבד..."
                              : "מחק 🗑"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
