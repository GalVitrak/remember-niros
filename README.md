# לזכרו של סמ"ר ניר רפאל קנניאן הי"ד

אתר הנצחה לזכרו של סמ"ר ניר רפאל קנניאן הי"ד, לוחם סיירת גבעתי אשר נפל במלחמת חרבות ברזל.

## 🕯️ אודות

אתר זה נוצר להנצחת זכרו של ניר, ומאפשר למשפחה וחברים לשתף זכרונות, תמונות וסיפורים. האתר נבנה באהבה ובכבוד לזכרו.

## 🛠️ טכנולוגיות

### Frontend

- **React 19** - ספריית UI מודרנית
- **TypeScript** - תמיכה בטיפוסים חזקים
- **Vite** - כלי בנייה מהיר ומודרני
- **React Router DOM** - ניהול ניווט ונתיבים
- **Ant Design** - ספריית רכיבי UI עם תמיכה מלאה ב-RTL
- **React Hook Form** - ניהול טפסים יעיל
- **React Firebase Hooks** - חיבורים בזמן אמת ל-Firebase
- **React Helmet Async** - ניהול SEO ומטא-טאגים
- **Redux** - ניהול מצב גלובלי לאימות

### Backend & Infrastructure

- **Firebase Functions** (Node.js 20) - פונקציות ענן לשרת
- **Firebase Firestore** - מסד נתונים בזמן אמת
- **Firebase Storage** - אחסון תמונות
- **Firebase Hosting** - אירוח סטטי
- **Firebase Security Rules** - כללי אבטחה

### Backend Libraries

- **bcrypt** - הצפנת סיסמאות
- **jsonwebtoken** - יצירת ואימות JWT tokens
- **dotenv** - ניהול משתני סביבה

## ✨ תכונות

### למשתמשים

- **שיתוף זכרונות** - הוספת זכרונות טקסטואליים עם תמיכה בעברית
- **העלאת תמונות** - עד 5 תמונות לכל זכרון
- **גלריית תמונות** - צפייה בתמונות במסך מלא עם ניווט
- **עיצוב רספונסיבי** - תמיכה מלאה במובייל, טאבלט ומחשב
- **תמיכה ב-RTL** - ממשק מותאם לעברית

### למנהלים

- **לוח בקרה** - ניהול מלא של הזכרונות
- **אישור ודחיית זכרונות** - בקרת איכות לפני פרסום
- **ניהול תמונות** - הסרה של תמונות ספציפיות
- **ניהול משתמשים** - יצירה, מחיקה ושינוי סיסמאות של מנהלים
- **מחיקת זכרונות** - מחיקה מלאה של זכרונות שנדחו

### SEO & Performance

- **SEO מלא** - מטא-טאגים, Open Graph, Twitter Cards
- **JSON-LD Structured Data** - נתונים מובנים למנועי חיפוש
- **robots.txt & sitemap.xml** - אופטימיזציה למנועי חיפוש
- **Cache Headers** - ביצועים מיטביים עם cache לקבצים סטטיים

## 🔒 אבטחה

- כל הכתיבות למסד הנתונים מתבצעות דרך Cloud Functions בלבד
- סיסמאות מוצפנות עם bcrypt
- אימות JWT לכל פעולות מנהל
- כללי אבטחה מחמירים ב-Firestore ו-Storage
- העלאת תמונות דרך backend בלבד

## 📁 מבנה הפרויקט

```
remember-niros/
├── src/
│   ├── Components/        # רכיבי React
│   │   ├── Admin/        # ממשק ניהול
│   │   ├── Cards/        # כרטיסי זכרונות
│   │   ├── Home/          # דפי בית
│   │   └── Layout/        # פריסה כללית
│   ├── Services/          # שירותי API
│   ├── Context/           # ניהול מצב (Redux)
│   └── config/            # הגדרות כלליות
├── functions/             # Firebase Cloud Functions
│   └── src/
│       ├── addMemory.ts
│       ├── approveMemory.ts
│       ├── rejectMemory.ts
│       ├── uploadImages.ts
│       └── ...
├── public/                # קבצים סטטיים
└── firebase.json          # הגדרות Firebase

```

## 🚀 התקנה והרצה

### דרישות מקדימות

- Node.js 20+
- npm או yarn
- חשבון Firebase

### התקנה

```bash
# התקנת תלויות frontend
npm install

# התקנת תלויות functions
cd functions
npm install
cd ..
```

### הרצה מקומית

```bash
# הרצת frontend
npm run dev

# הרצת functions (בטרמינל נפרד)
cd functions
npm run serve
```

### בנייה לייצור

```bash
# בניית frontend
npm run build

# בניית functions
cd functions
npm run build
```

## 📝 רישיון

פרויקט זה נוצר למטרות הנצחה בלבד.

---

**יהי זכרו ברוך** 🕯️
