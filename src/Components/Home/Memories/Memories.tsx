import { useState } from "react";
import "./Memories.css";
import MemoryModel from "../../../Models/MemoryModel";
import { useMemo } from "react";
import {
  query,
  collection,
  where,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { db } from "../../../../firebase-config";
import MemoryCard from "../../Cards/MemoryCard/MemoryCard";
import PostForm from "./PostForm/PostForm";
import { SEO } from "../../SEO/SEO";
import { siteConfig } from "../../../config/siteConfig";

function Memories(): React.ReactElement {
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const memoriesQuery = useMemo(() => {
    // Query without orderBy to handle documents that might not have createdAt
    // We'll sort client-side instead
    return query(
      collection(db, "memories"),
      where("status", "==", "approved")
    );
  }, []);

  const [memoriesSnapshot, loading, error] =
    useCollection(memoriesQuery);

  const memoriesData = useMemo(() => {
    if (!memoriesSnapshot) return [];
    const memories = memoriesSnapshot.docs.map(
      (doc) => {
        const data = doc.data();
        // Handle createdAt - it might be a Timestamp, Date, or undefined
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

        // Handle ApprovedAt similarly
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
          data.imageUrl, // For backward compatibility
          data.imageUrls, // Array of image URLs
          createdAt,
          data.status,
          approvedAt,
          data.ApprovedBy,
          doc.id
        );
      }
    );

    // Sort by createdAt descending (newest first), with items without dates at the end
    return memories.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return (
        b.createdAt.getTime() -
        a.createdAt.getTime()
      );
    });
  }, [memoriesSnapshot]);

  const handlePostCreated = () => {
    // The useCollection hook will automatically refresh when new documents are added
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "זכרונות מניר",
    description:
      'זכרונות, תמונות וסיפורים מחברים ומשפחה להנצחת זכרו של סמ"ר ניר רפאל קנניאן הי"ד',
    url: `${siteConfig.url}/memories`,
    about: {
      "@type": "Person",
      name: "ניר רפאל קנניאן",
    },
  };

  return (
    <>
      <SEO
        title="זכרונות מניר"
        description={
          'זכרונות, תמונות וסיפורים מחברים ומשפחה להנצחת זכרו של סמ"ר ניר רפאל קנניאן הי"ד. הוסיפו זכרון משלכם.'
        }
        keywords="זכרונות ניר, תמונות ניר, סיפורים על ניר, הנצחה, ניר קנניאן, זכרונות מחברים"
        url="/memories"
        structuredData={structuredData}
      />
      <div className="Memories">
        <div className="memories-feed">
          <div className="nir-message">
            <div className="nir-message-header">
              <h2>
                לפני נפילתו ניר שלח הודעה למשפחתו
                וחבריו, זוהי ההודעה
              </h2>
            </div>
            <div className="nir-message-content">
              <p>
                משפחה שלי האנשים שהם הבית בשבילי
                המקום הבטוח שאני תמיד אוהב לחזור
                אליו, ברגעים אלה אני מכבה את
                הטלפון עד לפי דעתי אחרי המלחמה.
                ולכן אני רוצה להגיד לכם תודה רבה,
                על התפילות, על זה שאתם שומרים עלי
                מרחוק. אני מאמין בלב שלם שמה שאני,
                הצוות שלי, הפלוגה שלי, הצקפ שלי
                וכל צה״ל ככלל ישנה את ספרי
                ההיסטוריה ויוביל אותנו לתקופה חדשה
                שבא אף ארגון טרור לא ירצה להתעסק
                איתנו. הרוח שלי והרוח של כולם חזקה
                מאוד רוח לחימה בלי פחד, רוח של
                לוחמים, אריות, מכונות מלחמה
                שהתאמנו במשך שנתיים לרגע הזה.
                אנחנו עם מלוכד ומאוחד ורק יחד
                ננצח.
              </p>
              <p className="nir-message-signature">
                עם ישראל חי
              </p>
              <p className="nir-message-signature">
                אני אשמור על עצמי ואתם תשמרו על
                עצמכם אוהב אותכם ❤️
              </p>
              <p className="nir-message-name">
                ניר
              </p>
            </div>
          </div>

          <div className="memories-header">
            <h1>זכרונות מניר</h1>
            <p>
              אתם מוזמנים לשתף זכרונות, תמונות
              וסיפורים, כדי להנציח את ניר שלנו
            </p>
          </div>

          <div className="add-memory-section">
            <button
              className="add-memory-btn"
              onClick={() => setIsModalOpen(true)}
            >
              הוסף זכרון
            </button>
          </div>

          <PostForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPostCreated={handlePostCreated}
          />

          <div className="memories-list">
            {loading ? (
              <div className="loading">
                טוען זכרונות...
              </div>
            ) : error ? (
              <div className="error">
                שגיאה בטעינת הזכרונות
              </div>
            ) : memoriesData.length > 0 ? (
              memoriesData.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                />
              ))
            ) : (
              <div className="no-memories">
                אין זכרונות פעילים כרגע, מוזמנים
                להוסיף זכרון חדש
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Memories;
