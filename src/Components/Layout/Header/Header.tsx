import "./Header.css";
import nirImage from "../../../assets/nir.webp";

export function Header(): React.ReactElement {
  return (
    <div className="Header">
      <div className="header-container">
        <div className="header-image">
          <img
            src={nirImage}
            alt="ניר רפאל קנניאן"
          />
        </div>
        <div className="header-text">
          <h2>
            לזכרו של סמ"ר ניר רפאל קנניאן הי"ד
          </h2>
          <h3>
            לוחם סיירת גבעתי אשר נפל במלחמת חרבות
            ברזל{" "}
          </h3>
          <p className="header-quote">
            "תאהבו את החיים שאתם חיים, תחיו את
            החיים שאתם אוהבים"
          </p>
        </div>
        <div className="header-buttons">
          <div className="header-button">
            עמוד הזכרונות 
          </div>
          <div className="header-button">
            אודות ניר
          </div>
          <div className="header-button">
            חנות
          </div>
        </div>
      </div>
    </div>
  );
}
