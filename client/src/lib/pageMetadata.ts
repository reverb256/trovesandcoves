// client/src/lib/pageMetadata.ts

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

export const pageMetadata: Record<string, PageMetadata> = {
  '/': {
    title: 'Troves & Coves - Handcrafted Crystal Jewelry | 14k Gold-Plated Statement Pieces',
    description: 'Discover handcrafted crystal jewelry with timeless elegance. Shop unique crystal necklaces & bracelets crafted in Winnipeg, Canada.',
    keywords: 'crystal jewelry, handcrafted jewelry, Winnipeg, 14k gold-plated, wire wrapped',
  },
  '/products': {
    title: 'Shop Crystal Jewelry | Handcrafted Necklaces & Bracelets | Troves & Coves',
    description: 'Browse our collection of handcrafted crystal jewelry. Wire-wrapped pendants, gemstone necklaces, and leather cord pendants.',
    keywords: 'crystal necklaces, gemstone jewelry, leather cord pendants, handmade',
  },
  '/about': {
    title: 'About Troves & Coves | Handcrafted in Winnipeg, Canada',
    description: 'Learn about Troves & Coves - handcrafted crystal jewelry made with love in Winnipeg, Manitoba. Each piece tells a story.',
    keywords: 'about, artisan jewelry, Winnipeg, Manitoba, handmade',
  },
  '/contact': {
    title: 'Contact Us | Custom Crystal Jewelry Orders | Troves & Coves',
    description: 'Get in touch for custom crystal jewelry orders or questions. We love hearing from you.',
    keywords: 'contact, custom jewelry, orders, support',
  },
  '/checkout': {
    title: 'Checkout | Secure Payment | Troves & Coves',
    description: 'Complete your crystal jewelry purchase. Secure checkout with multiple payment options.',
    keywords: 'checkout, payment, secure',
  },
  '/size-guide': {
    title: 'Size Guide | Find Your Perfect Fit | Troves & Coves',
    description: 'Find your perfect fit with our comprehensive jewelry size guide. Necklace lengths, bracelet sizes, and more.',
    keywords: 'size guide, jewelry sizing, necklace length',
  },
  '/jewelry-care': {
    title: 'Jewelry Care Guide | Keep Your Crystals Beautiful | Troves & Coves',
    description: 'Learn how to care for your handcrafted crystal jewelry. Cleaning tips, storage advice, and maintenance guidelines.',
    keywords: 'jewelry care, crystal cleaning, jewelry maintenance',
  },
  '/warranty': {
    title: 'Lifetime Warranty | Quality Guarantee | Troves & Coves',
    description: 'Every piece of Troves & Coves jewelry comes with a lifetime warranty. Learn about our quality guarantee.',
    keywords: 'warranty, guarantee, quality',
  },
  '/returns': {
    title: 'Returns & Exchanges | Hassle-Free Policy | Troves & Coves',
    description: 'Our hassle-free return and exchange policy. We want you to love your crystal jewelry.',
    keywords: 'returns, exchanges, policy, refund',
  },
  '/financing': {
    title: 'Flexible Payment Options | Shop Now Pay Later | Troves & Coves',
    description: 'Flexible payment options for your crystal jewelry. Shop now and pay later with Sezzle or PayPal.',
    keywords: 'financing, payment plans, shop now pay later',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | How We Protect Your Data | Troves & Coves',
    description: 'Your privacy matters. Learn how we protect your data and never sell your information.',
    keywords: 'privacy policy, data protection, GDPR',
  },
};

// Helper function to get metadata for a path
export function getPageMetadata(path: string, productName?: string): PageMetadata {
  // Handle product detail pages
  if (productName && path.startsWith('/product/')) {
    return {
      title: `${productName} | Handcrafted Crystal Jewelry | Troves & Coves`,
      description: `Shop ${productName} - handcrafted with 14k gold-filled wire and genuine gemstones. Made in Winnipeg, Canada.`,
      keywords: `${productName}, crystal jewelry, handmade`,
    };
  }

  // Return matching page metadata or default
  return pageMetadata[path] || pageMetadata['/'];
}
