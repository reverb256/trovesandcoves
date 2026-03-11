import { useEffect } from 'react';

/**
 * Product Schema Component
 * Adds Product schema to product detail pages for rich results in Google Shopping
 */
interface ProductSchemaProps {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  stockQuantity: number;
  category?: { name: string; slug: string } | null;
  id: string;
  brand?: string;
  sku?: string;
}

export function ProductSchema({
  name,
  description,
  imageUrl,
  price,
  stockQuantity,
  category,
  id,
  brand = 'Troves & Coves',
  sku = id,
}: ProductSchemaProps) {
  useEffect(() => {
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      image: imageUrl,
      sku,
      brand: {
        '@type': 'Brand',
        name: brand,
      },
      offers: {
        '@type': 'Offer',
        url: `https://trovesandcoves.ca/products/${id}`,
        priceCurrency: 'CAD',
        price: price.toString(),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'Troves & Coves',
          url: 'https://trovesandcoves.ca',
        },
      },
      category: category?.name || 'Jewelry',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1',
      },
    };

    // Remove existing product schema
    const existingSchema = document.querySelector('#product-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.id = 'product-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(productSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [name, description, imageUrl, price, stockQuantity, category, id, brand, sku]);

  return null;
}

/**
 * Breadcrumb Schema Component
 * Adds BreadcrumbList schema for breadcrumb navigation in search results
 */
interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  useEffect(() => {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `https://trovesandcoves.ca${item.path}`,
      })),
    };

    // Remove existing breadcrumb schema
    const existingSchema = document.querySelector('#breadcrumb-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.id = 'breadcrumb-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [items]);

  return null;
}

/**
 * Website Schema Component
 * Adds WebSite schema with search action for site links searchbox
 */
export function WebsiteSchema() {
  useEffect(() => {
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://trovesandcoves.ca',
      name: 'Troves & Coves',
      description: 'Handcrafted crystal jewelry with timeless elegance. Each piece elevates your style, blending 14k gold-plated sophistication with natural crystal beauty.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://trovesandcoves.ca/products?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Troves & Coves',
        url: 'https://trovesandcoves.ca',
      },
    };

    const existingSchema = document.querySelector('#website-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'website-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(websiteSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

/**
 * Organization Schema Component
 * Adds Organization schema for brand knowledge panel
 */
export function OrganizationSchema() {
  useEffect(() => {
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://trovesandcoves.ca/#organization',
      name: 'Troves & Coves',
      url: 'https://trovesandcoves.ca',
      logo: {
        '@type': 'ImageObject',
        url: 'https://trovesandcoves.ca/logo.png',
        width: 512,
        height: 512,
      },
      description: 'Handcrafted crystal jewelry in Winnipeg, Manitoba. Statement necklaces and bracelets artisan-crafted with 14k gold-plated elegance and natural crystal beauty.',
      sameAs: [
        'https://www.facebook.com/trovesandcoves',
        'https://www.instagram.com/trovesandcoves',
        'https://www.etsy.com/shop/trovesandcoves',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Winnipeg',
        addressRegion: 'Manitoba',
        addressCountry: 'CA',
        postalCode: 'R3C 0V8',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-204-xxx-xxxx',
        contactType: 'customer service',
        areaServed: 'CA',
        availableLanguage: 'English',
      },
    };

    const existingSchema = document.querySelector('#organization-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'organization-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

/**
 * Local Business Schema Component
 * Adds LocalBusiness schema for local search visibility
 */
export function LocalBusinessSchema() {
  useEffect(() => {
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://trovesandcoves.ca/#business',
      name: 'Troves & Coves',
      description: 'Handcrafted crystal jewelry in Winnipeg, Manitoba. Statement necklaces and bracelets artisan-crafted with 14k gold-plated elegance and natural crystal beauty.',
      url: 'https://trovesandcoves.ca',
      telephone: '+1-204-xxx-xxxx',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Winnipeg',
        addressRegion: 'Manitoba',
        addressCountry: 'CA',
        postalCode: 'R3C 0V8',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 49.8951,
        longitude: -97.1384,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '10:00',
          closes: '17:00',
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
      ],
    };

    const existingSchema = document.querySelector('#local-business-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'local-business-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(localBusinessSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
