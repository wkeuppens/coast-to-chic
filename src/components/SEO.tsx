import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://ftcredesigned.lovable.app';
const DEFAULT_TITLE = 'Follow the Coast — Run the European Coastline';
const DEFAULT_DESCRIPTION = 'Run 100km stages along the European coastline from Belgium to Athens. Books, side routes, and community.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
}: SEOProps) => {
  const fullTitle = title ? `${title} — Follow the Coast` : DEFAULT_TITLE;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
