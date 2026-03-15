import { useEffect, useRef } from 'react';

// Re-export BreadcrumbSchema from the dedicated component for backward compatibility
export { BreadcrumbSchema, type BreadcrumbItem } from './BreadcrumbSchema';

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
  // Track elements created by this instance to avoid cleanup conflicts
  const createdElementsRef = useRef<Set<Node>>(new Set());

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
        url: `https://trovesandcoves.ca/product/${id}`,
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
    createdElementsRef.current.add(script);

    return () => {
      // Clean up only elements created by this instance
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, [name, description, imageUrl, price, stockQuantity, category, id, brand, sku]);

  return null;
}

/**
 * Website Schema Component
 * Adds WebSite schema with search action for site links searchbox
 */
export function WebsiteSchema() {
  // Track elements created by this instance to avoid cleanup conflicts
  const createdElementsRef = useRef<Set<Node>>(new Set());

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
    createdElementsRef.current.add(script);

    return () => {
      // Clean up only elements created by this instance
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, []);

  return null;
}

/**
 * Organization Schema Component
 * Adds Organization schema for brand knowledge panel
 */
export function OrganizationSchema() {
  // Track elements created by this instance to avoid cleanup conflicts
  const createdElementsRef = useRef<Set<Node>>(new Set());

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
    createdElementsRef.current.add(script);

    return () => {
      // Clean up only elements created by this instance
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, []);

  return null;
}

/**
 * FAQ Schema Component
 * Adds FAQPage schema for AI question-answer extraction
 * AI systems love FAQ content for direct Q&A extraction
 */
interface FAQSchemaProps {
  questions?: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

export function FAQSchema({ questions }: FAQSchemaProps = {}) {
  // Track elements created by this instance to avoid cleanup conflicts
  const createdElementsRef = useRef<Set<Node>>(new Set());

  useEffect(() => {
    const defaultQuestions = [
      {
        '@type': 'Question',
        name: 'What crystals do you use in your jewelry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We use authentic crystals including amethyst, quartz, obsidian, citrine, lepidolite, lapis lazuli, turquoise, and rose quartz. Each stone is ethically sourced and selected for its unique properties and natural beauty.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is your jewelry nickel-free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our jewelry is nickel-free. We use 14k gold-plated wire and components that are safe for sensitive skin. Our materials are carefully selected to be both beautiful and comfortable to wear.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Troves & Coves located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Troves & Coves is based in Winnipeg, Manitoba, Canada. All our jewelry is handcrafted locally with attention to detail and quality craftsmanship.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I care for my crystal jewelry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To care for your wire-wrapped crystal jewelry, avoid water, harsh chemicals, and perfumes. Store separately to prevent scratching. Clean gently with a soft dry cloth. With proper care, your gold-plated pieces will maintain their beauty for years.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you ship internationally?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we ship worldwide through our Etsy shop. Each piece is carefully packaged to ensure it arrives safely. Shipping times vary by destination.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I customize a piece?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we welcome custom orders. Contact us through our website or Etsy shop with your vision. We can work with you to create a unique piece featuring your favorite crystals and design preferences.',
        },
      },
    ];

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions && questions.length > 0 ? questions : defaultQuestions,
    };

    const existingSchema = document.querySelector('#faq-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'faq-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    createdElementsRef.current.add(script);

    return () => {
      // Clean up only elements created by this instance
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, [questions]);

  return null;
}

/**
 * Article Schema Component
 * Adds Article schema for blog posts and guides
 * Helps AI systems understand and cite content
 */
interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  url?: string;
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  authorName = 'Troves & Coves',
  url,
}: ArticleSchemaProps) {
  // Track elements created by this instance to avoid cleanup conflicts
  const createdElementsRef = useRef<Set<Node>>(new Set());

  useEffect(() => {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        '@type': 'Organization',
        name: authorName,
        url: 'https://trovesandcoves.ca',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Troves & Coves',
        logo: {
          '@type': 'ImageObject',
          url: 'https://trovesandcoves.ca/favicon.svg',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url || (typeof window !== 'undefined' ? window.location.href : ''),
      },
    };

    const existingSchema = document.querySelector('#article-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'article-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(script);
    createdElementsRef.current.add(script);

    return () => {
      // Clean up only elements created by this instance
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, [title, description, datePublished, dateModified, authorName, url]);

  return null;
}

/**
 * Local Business Schema Component
 * Adds LocalBusiness schema for local search visibility
 */
export function LocalBusinessSchema() {
  // Track elements created by this instance to avoid cleanup conflicts
  const createdElementsRef = useRef<Set<Node>>(new Set());

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
    createdElementsRef.current.add(script);

    return () => {
      // Clean up only elements created by this instance
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, []);

  return null;
}

/**
 * HowTo Schema Component
 * Adds HowTo schema for step-by-step guides
 * Helps AI systems extract process instructions
 */
interface HowToStep {
  '@type': string;
  text: string;
  name?: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  image?: string;
  totalTime?: string;
  estimatedCost?: { '@type': 'MonetaryAmount'; currency: string; value: string };
  tool?: string[];
  supply?: string[];
}

export function HowToSchema({
  name,
  description,
  steps,
  image,
  totalTime,
  estimatedCost,
  tool,
  supply,
}: HowToSchemaProps) {
  const createdElementsRef = useRef<Set<Node>>(new Set());

  useEffect(() => {
    const howToSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name,
      description,
      step: steps,
    };

    if (image) howToSchema.image = image;
    if (totalTime) howToSchema.totalTime = totalTime;
    if (estimatedCost) howToSchema.estimatedCost = estimatedCost;
    if (tool) howToSchema.tool = tool;
    if (supply) howToSchema.supply = supply;

    const existingSchema = document.querySelector('#howto-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'howto-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(howToSchema);
    document.head.appendChild(script);
    createdElementsRef.current.add(script);

    return () => {
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, [name, description, steps, image, totalTime, estimatedCost, tool, supply]);

  return null;
}

/**
 * ItemList Schema Component
 * Adds ItemList schema for product collections and category pages
 */
interface ItemListItem {
  '@type': string;
  position: number;
  item: {
    '@type': string;
    name: string;
    url?: string;
    image?: string;
  };
}

interface ItemListSchemaProps {
  name: string;
  description?: string;
  items: ItemListItem[];
}

export function ItemListSchema({ name, description, items }: ItemListSchemaProps) {
  const createdElementsRef = useRef<Set<Node>>(new Set());

  useEffect(() => {
    const itemListSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name,
      itemListElement: items,
    };

    if (description) itemListSchema.description = description;

    const existingSchema = document.querySelector('#itemlist-schema');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.id = 'itemlist-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(itemListSchema);
    document.head.appendChild(script);
    createdElementsRef.current.add(script);

    return () => {
      createdElementsRef.current.forEach((element) => {
        if (element.isConnected) {
          try {
            (element as Element).remove();
          } catch {
            // Element already removed or invalid
          }
        }
      });
      createdElementsRef.current.clear();
    };
  }, [name, description, items]);

  return null;
}
