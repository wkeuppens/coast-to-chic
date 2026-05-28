import { Helmet } from 'react-helmet-async';

/**
 * Sitewide SEO + AI-discoverability component.
 *
 * Emits canonical, Open Graph, Twitter, robots, and optional JSON-LD
 * structured data per route. Used by every top-level page.
 */

const SITE_URL = 'https://ftcredesigned.lovable.app';
const SITE_NAME = 'Follow the Coast';
const DEFAULT_TITLE =
  'Follow the Coast — Editorial Coastal Photography & 100km Running Stages Across Europe';
const DEFAULT_DESCRIPTION =
  'Follow the Coast is an editorial photography and running project documenting the European coastline in 100km stages — from Belgium to Athens. Photobooks, limited prints, and stage events.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_KEYWORDS = [
  'editorial coastal photography',
  'European coastline photobook',
  'long-distance running Europe',
  'travel photography Belgium',
  'documentary photography project',
  'Follow the Coast',
].join(', ');

export type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  noindex?: boolean;
  /** One or more JSON-LD blocks to embed in the document head. */
  jsonLd?: JsonLd;
}

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = 'Follow the Coast — coastal European running and editorial photography',
  keywords = DEFAULT_KEYWORDS,
  type = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const url = `${SITE_URL}${path}`;
  const blocks = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && (
        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

/**
 * Helpers to build common JSON-LD blocks consistently across pages.
 */
export const seoBreadcrumb = (
  items: { name: string; path: string }[],
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

export const seoFaq = (
  qa: { q: string; a: string }[],
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qa.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
});

export const seoArticle = (args: {
  headline: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: args.headline,
  description: args.description,
  image: args.image ?? DEFAULT_OG_IMAGE,
  mainEntityOfPage: `${SITE_URL}${args.path}`,
  datePublished: args.datePublished,
  dateModified: args.dateModified ?? args.datePublished,
  author: { '@type': 'Organization', name: args.authorName ?? SITE_NAME },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
  },
});

export const SITE_CONFIG = { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } as const;
