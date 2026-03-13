import { useEffect } from 'react';
import { getPageMetadata, type PageMetadata } from '@/lib/pageMetadata';

interface SEOProps {
  path: string;
  productName?: string;
  title?: string; // Override default title
  description?: string; // Override default description
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  structuredData?: object;
  location?: {
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

export default function SEOHead({
  path,
  productName,
  title: titleOverride,
  description: descriptionOverride,
  image = 'https://trovesandcoves.ca/og-image.jpg?v=2',
  url = 'https://trovesandcoves.ca',
  type = 'website',
  structuredData,
  location = {
    city: 'Winnipeg',
    province: 'Manitoba',
    country: 'Canada',
    latitude: 49.8951,
    longitude: -97.1384,
  },
}: SEOProps) {
  // Get page-specific metadata
  const metadata: PageMetadata = getPageMetadata(path, productName);
  const title = titleOverride ?? metadata.title;
  const description = descriptionOverride ?? metadata.description;
  const keywords = metadata.keywords;
  useEffect(() => {
    // Update document title
    document.title = title;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Remove existing structured data
    const existingStructuredData = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    existingStructuredData.forEach(script => script.remove());

    // Create meta tags
    const metaTags = [
      { name: 'description', content: description },
      ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
      { name: 'author', content: 'Troves & Coves' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      // Open Graph for Facebook, Discord, Messenger
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1280' },
      { property: 'og:image:height', content: '720' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:alt', content: 'Troves & Coves Crystal Jewelry - Hero section with beautiful crystal jewelry display' },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Troves & Coves' },
      { property: 'og:locale', content: 'en_CA' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@trovesandcoves' },
      { name: 'twitter:creator', content: '@trovesandcoves' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },

      // Geographic metadata
      { name: 'geo.region', content: 'CA-MB' },
      { name: 'geo.placename', content: location.city },
      {
        name: 'geo.position',
        content: `${location.latitude};${location.longitude}`,
      },
      { name: 'ICBM', content: `${location.latitude}, ${location.longitude}` },

      // Business metadata
      { name: 'business:contact_data:locality', content: location.city },
      { name: 'business:contact_data:region', content: location.province },
      { name: 'business:contact_data:country_name', content: location.country },

      // Additional SEO
      { name: 'theme-color', content: '#D4AF37' },
      { name: 'msapplication-TileColor', content: '#000000' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ];

    // Add meta tags to head
    metaTags.forEach(({ name, property, content }) => {
      const meta = document.createElement('meta');
      if (name) meta.setAttribute('name', name);
      if (property) meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });

    // Default structured data for business
    const defaultStructuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LocalBusiness',
          '@id': `${url}/#business`,
          name: 'Troves & Coves',
          description:
            'Handcrafted crystal jewelry in Winnipeg, Manitoba. Statement necklaces and bracelets artisan-crafted with 14k gold-plated elegance and natural crystal beauty.',
          url: url,
          telephone: '+1-204-xxx-xxxx',
          address: {
            '@type': 'PostalAddress',
            addressLocality: location.city,
            addressRegion: location.province,
            addressCountry: location.country,
            postalCode: 'R3C 0V8',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
              ],
              opens: '10:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday'],
              opens: '10:00',
              closes: '17:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Sunday'],
              opens: '12:00',
              closes: '16:00',
            },
          ],
          priceRange: '$$',
          currenciesAccepted: 'CAD',
          paymentAccepted: 'Cash, Credit Card, Interac',
          areaServed: {
            '@type': 'City',
            name: 'Winnipeg',
            containedInPlace: {
              '@type': 'AdministrativeArea',
              name: 'Manitoba',
            },
          },
          serviceArea: {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: location.latitude,
              longitude: location.longitude,
            },
            geoRadius: '50000',
          },
          makesOffer: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Crystal Jewelry',
                category: 'Jewelry',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Crystal Consultation',
                category: 'Consultation',
              },
            },
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Crystal Jewelry Collection',
            itemListElement: [
              {
                '@type': 'OfferCatalog',
                name: 'Crystal Necklaces',
              },
              {
                '@type': 'OfferCatalog',
                name: 'Gemstone Jewelry',
              },
              {
                '@type': 'OfferCatalog',
                name: 'Wire Wrapped Jewelry',
              },
            ],
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '127',
            bestRating: '5',
          },
          sameAs: [
            'https://www.facebook.com/trovesandcoves',
            'https://www.instagram.com/trovesandcoves',
            'https://www.etsy.com/shop/trovesandcoves',
            'https://trovesandcoves.ca',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${url}/#website`,
          url: url,
          name: 'Troves & Coves',
          description: description,
          publisher: {
            '@id': `${url}/#business`,
          },
          potentialAction: [
            {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${url}/search?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          ],
        },
        {
          '@type': 'Organization',
          '@id': `${url}/#organization`,
          name: 'Troves & Coves',
          url: url,
          logo: {
            '@type': 'ImageObject',
            url: `${url}/logo.png`,
            width: 512,
            height: 512,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-204-xxx-xxxx',
            contactType: 'customer service',
            areaServed: 'CA',
            availableLanguage: 'English',
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: location.city,
            addressRegion: location.province,
            addressCountry: location.country,
          },
        },
      ],
    };

    // Use custom structured data or default
    const jsonLd = structuredData || defaultStructuredData;

    // Add structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add hreflang for Canadian English
    let hreflang = document.querySelector(
      'link[rel="alternate"][hreflang="en-CA"]'
    );
    if (!hreflang) {
      hreflang = document.createElement('link');
      hreflang.setAttribute('rel', 'alternate');
      hreflang.setAttribute('hreflang', 'en-CA');
      document.head.appendChild(hreflang);
    }
    hreflang.setAttribute('href', url);
  }, [
    path,
    productName,
    titleOverride,
    descriptionOverride,
    image,
    url,
    type,
    structuredData,
    location,
  ]);

  return null;
}
