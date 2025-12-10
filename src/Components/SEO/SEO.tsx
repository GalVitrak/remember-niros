import { Helmet } from "react-helmet-async";
import { siteConfig } from "../../config/siteConfig";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const defaultTitle = siteConfig.name;
const defaultDescription = siteConfig.description;
const defaultKeywords = siteConfig.keywords;
const siteUrl = siteConfig.url;
const defaultImage = `${siteUrl}${siteConfig.defaultImage}`;

export function SEO({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  image = defaultImage,
  url,
  type = "website",
  structuredData,
}: SEOProps): React.ReactElement {
  const fullTitle = title
    ? `${title} | ${defaultTitle}`
    : defaultTitle;
  const fullUrl = url
    ? `${siteUrl}${url}`
    : siteUrl;

  // Default structured data for Person/Obituary
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "ניר רפאל קנניאן",
    alternateName: 'סמ"ר ניר רפאל קנניאן הי"ד',
    description: defaultDescription,
    birthDate: "2002-12-24",
    deathDate: "2023-12-22",
    jobTitle: "לוחם סיירת גבעתי",
    affiliation: {
      "@type": "Organization",
      name: "סיירת גבעתי",
      parentOrganization: {
        "@type": "Organization",
        name: 'צה"ל',
      },
    },
    url: siteUrl,
    image: defaultImage,
    sameAs: [], // Add social media profiles if available
    knowsAbout: ["סיירת גבעתי", "צה\"ל", "מלחמת חרבות ברזל"],
    nationality: {
      "@type": "Country",
      name: "ישראל"
    }
  };

  const jsonLd =
    structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta
        name="description"
        content={description}
      />
      <meta name="keywords" content={keywords} />
      <meta
        name="author"
        content="Remember Niros"
      />
      <meta name="language" content="Hebrew" />
      <meta
        name="revisit-after"
        content="7 days"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta
        property="og:title"
        content={fullTitle}
      />
      <meta
        property="og:description"
        content={description}
      />
      <meta property="og:image" content={image} />
      <meta
        property="og:locale"
        content={siteConfig.locale}
      />
      <meta
        property="og:site_name"
        content={defaultTitle}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:url"
        content={fullUrl}
      />
      <meta
        name="twitter:title"
        content={fullTitle}
      />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={image}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Language and Alternate Links */}
      <link rel="alternate" hrefLang="he" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="IL" />
      <meta name="geo.placename" content="Israel" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
