import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'millarX'
const DEFAULT_TITLE = 'Transparent Novated Leasing'
const DEFAULT_DESCRIPTION = 'Novated leasing without the hidden costs. See exactly what you\'ll pay with our transparent calculator. No inflated fees, no sales pressure.'
const SITE_URL = 'https://millarx.com.au'

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  noindex = false,
  ogImage = '/og-image.png',
  ogType = 'website',
  structuredData,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - ${DEFAULT_TITLE}`
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

// Organization Schema - use on homepage
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'millarX',
  legalName: 'Blackrock Leasing Pty Ltd',
  alternateName: 'millarX Novated Leasing',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: 'Transparent novated leasing broker in Australia. No hidden fees, no sales pressure.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ivanhoe',
    addressRegion: 'VIC',
    postalCode: '3079',
    addressCountry: 'AU',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+61492886857',
    contactType: 'customer service',
    email: 'info@millarx.com.au',
    availableLanguage: 'English',
  },
  sameAs: [],
}

// LocalBusiness Schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'millarX',
  description: 'Novated leasing broker offering transparent salary packaging for vehicles.',
  url: SITE_URL,
  telephone: '+61492886857',
  email: 'info@millarx.com.au',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ivanhoe',
    addressRegion: 'VIC',
    postalCode: '3079',
    addressCountry: 'AU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -37.7687,
    longitude: 145.0434,
  },
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
}

// FAQ Schema helper
export function createFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Breadcrumb Schema helper
export function createBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
