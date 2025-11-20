import "./MemoryCard.css";
import MemoryModel from "../../../Models/MemoryModel";

interface MemoryCardProps {
    memory: MemoryModel;
}

function MemoryCard(
  props: MemoryCardProps
): React.ReactElement {
  return <div className="MemoryCard"></div>;
}

export default MemoryCard;
