import { useState } from "react";
import "./Memories.css";
import MemoryModel from "../../../Models/MemoryModel";
import { useMemo } from "react";
import {
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { db } from "../../../../firebase-config";
import MemoryCard from "../../Cards/MemoryCard/MemoryCard";

function Memories(): React.ReactElement {
  const memoriesQuery = useMemo(() => {
    return query(
      collection(db, "memories"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
  }, []);

  const [memoriesSnapshot, loading, error] =
    useCollection(memoriesQuery);

  const memoriesData = useMemo(() => {
    if (!memoriesSnapshot) return [];
    return memoriesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return new MemoryModel(
        data.memory,
        data.writer,
        data.imageUrl,
        data.createdAt,
        data.status,
        data.ApprovedAt,
        data.ApprovedBy,
        doc.id
      );
    });
  }, [memoriesSnapshot]);

  return (
    <div className="Memories">
      <div className="memories-header">
        <h1>זכרונות</h1>
        <p>
          בעמוד הזכרונות תוכלו להעלות זיכרון על
          ניר, לכתוב סיפור קצר או לשתף תמונות
        </p>
        <button>הוסף זכרון</button>
      </div>
      <div className="memories-container">
        {loading ? (
          <div className="loading">
            טוען זכרונות...
          </div>
        ) : memoriesData.length > 0 ? (
          <div className="memories-container">
            {memoriesData.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
              />
            ))}
          </div>
        ) : (
          <div className="no-memories">
            אין זכרונות פעילים כרגע, מוזמנים
            להוסיף זכרון חדש
          </div>
        )}
      </div>
    </div>
  );
}

export default Memories;
