import "./MemoryCard.css";
import MemoryModel from "../../../Models/MemoryModel";

interface MemoryCardProps {
    memory: MemoryModel;
}

function MemoryCard(props: MemoryCardProps): React.ReactElement {
  const { memory } = props;

  const formatDate = (date?: Date) => {
    if (!date) return "לאחרונה";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Handle future dates (shouldn't happen, but just in case)
    if (diff < 0) return "לאחרונה";
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (minutes < 1) return "לפני רגע";
    if (minutes < 60) return `לפני ${minutes} דקות`;
    if (hours < 24) return `לפני ${hours} שעות`;
    if (days < 7) return `לפני ${days} ימים`;
    if (weeks < 4) return `לפני ${weeks} שבועות`;
    if (months < 12) return `לפני ${months} חודשים`;
    
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="MemoryCard">
      <div className="memory-card-header">
        <div className="memory-author">
          <div className="author-avatar">
            {memory.writer?.[0]?.toUpperCase() || "א"}
          </div>
          <div className="author-info">
            <div className="author-name">{memory.writer || "אורח"}</div>
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
      
      {memory.imageUrl && (
        <div className="memory-image-container">
          <img
            src={memory.imageUrl}
            alt="Memory"
            className="memory-image"
          />
        </div>
      )}
    </div>
  );
}

export default MemoryCard;
