import "./About.css";

function About(): React.ReactElement {
  return (
    <div className="About">
      <div className="about-container">
        <div className="about-header">
          <h1>אודות ניר</h1>
          <div className="about-subtitle">
            לזכרו של סמ"ר ניר רפאל קנניאן הי"ד
          </div>
        </div>

        <div className="about-content">
          <p className="about-paragraph">
            ניר נולד ב
            <span className="highlight">
              24.12.2002
            </span>{" "}
            בבית החולים יוסף טל באילת לאמא ילנה
            ואבא ראובן. לניר אח גדול בשם{" "}
            <span className="highlight">גרי</span>{" "}
            ואחות קטנה בשם{" "}
            <span className="highlight">
              יסמין
            </span>
            .
          </p>

          <p className="about-paragraph">
            כשהיה בן{" "}
            <span className="highlight">5</span>,
            עבר לקיבוץ בית קשת שבצפון, שם גדל. ניר
            היה ילד חברותי וביישן שאהב לשחק עם
            החברים שלו ועם אחותו הרבה.
          </p>

          <p className="about-paragraph">
            בגיל ההתבגרות, ניר גיבש חבורת חברים
            קרובה שתמיד הלכה יחד, עשתה איתו שטויות
            וצחוקים ותמיד זרמה עם הרעיונות
            המשוגעים שלו, לנסוע למעיין באמצע הלילה
            או לפרוץ לבריכה של הקיבוץ. ניר האמין
            בכיף, בטוב, תמיד היה שמח ודאג לחברים
            ולמשפחה שלו.
          </p>

          <p className="about-paragraph">
            כשסיים בית ספר, ניר התגייס ל
            <span className="highlight">
              סיירת גבעתי
            </span>
            , זה היה החלום שלו, זכות עבורו לשרת את
            המדינה שלו. ניר היה הכי חרוץ בעולם,
            עשה הכל הכי טוב, תמיד היה הראשון,
            הוביל, רץ והיה חייל מצטיין.
          </p>

          <p className="about-paragraph">
            ב
            <span className="highlight">
              7 לאוקטובר
            </span>{" "}
            ניר היה באמצע קורס גיור, אבל עזב הכל
            עלה על מדים ונסע לדרום. ניר הציל וחילץ
            עשרות אזרחים, לחם בגבורה בלי להסס
            לרגע. במהלך המלחמה ניר חזר הביתה פעמים
            ספורות, ובכל פעם עשה הכל כדי לפגוש את
            החברים שאהב.
          </p>

          <div className="memorial-section">
            <p className="about-paragraph">
              ב
              <span className="highlight">
                22.12.23
              </span>{" "}
              ניר יצא למבצע בחאן יונס עם הצוות
              שלו, שם נפל יחד עם חברו בראהנו
              ומפקדו הראל איתח. ניר נפל יומיים
              לפני יום הולדת{" "}
              <span className="highlight">
                21
              </span>{" "}
              שלו.
            </p>
          </div>

          <div className="legacy-section">
            <p className="about-paragraph legacy-text">
              אנחנו החברים והמשפחה, מנסים להנציח ולהעביר
              את הרוח של ניר בכל דבר שאנו עושים.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
