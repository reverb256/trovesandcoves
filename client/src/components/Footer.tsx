import { Link } from 'wouter';
import { useState } from 'react';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast({
      title: 'Thank you for subscribing!',
      description: "You'll receive updates about our latest mystical collections and exclusive events.",
    });
    setEmail('');
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://www.facebook.com/TrovesandCoves',
      label: 'Facebook',
    },
    {
      icon: Instagram,
      href: 'https://instagram.com/Troves_and_Coves',
      label: 'Instagram',
    },
    {
      icon: ExternalLink,
      href: 'https://www.etsy.com/ca/shop/TrovesandCoves',
      label: 'Etsy Shop',
    },
    {
      icon: ExternalLink,
      href: 'https://linktr.ee/TrovesandCoves',
      label: 'Linktree',
    },
  ];

  const collections = [
    { name: 'Crystal Necklaces', href: '/products/crystal-necklaces' },
    { name: 'Healing Crystals', href: '/products/healing-crystals' },
    { name: 'Wire Wrapped Jewellery', href: '/products/wire-wrapped' },
    { name: 'All Products', href: '/products' },
    { name: 'Featured Items', href: '/' },
    { name: 'Custom Consultations', href: '/contact' },
  ];

  const customerCare = [
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Jewellery Care', href: '/jewelry-care' },
    { name: 'Warranty', href: '/warranty' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Financing', href: '/financing' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="border-t border-[hsla(174,85%,45%,0.1)] pt-16 pb-8 content-layer">
      {/* Mystical top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsla(174,85%,45%,0.5)] to-transparent"></div>

      <div className="chamber-container">
        {/* Newsletter Section */}
        <div className="mb-16 text-center">
          <div className="crystal-card p-8 md:p-12 max-w-3xl mx-auto">
            {/* Mystical Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border-2 border-[hsla(43,95%,55%,0.3)] rounded-full bg-[hsla(43,95%,55%,0.05)] animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-[hsl(43,95%,55%)]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(210,30%,85%)] mb-4">
              <span className="text-shimmer">Join Our Crystal Circle</span>
            </h2>

            <p className="text-lg text-[hsl(210,30%,85%)] opacity-70 mb-8">
              Be the first to discover new collections, crystal wisdom, and exclusive mystical events
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 bg-[hsla(240,15%,6%,0.5)] border border-[hsla(174,85%,45%,0.2)] rounded-lg text-[hsl(210,30%,85%)] placeholder-[hsl(210,30%,85%,0.4)] focus:border-[hsla(174,85%,45%,0.5)] focus:outline-none focus:ring-1 focus:ring-[hsla(174,85%,45%,0.3)] transition-colors duration-300"
                required
              />
              <button
                type="submit"
                className="btn-mystical whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <p className="text-sm text-[hsl(210,30%,85%)] opacity-50 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="troves-text text-2xl">Troves</span>
              <span className="text-[hsl(43,95%,55%)] text-3xl">×</span>
              <span className="coves-text text-3xl">Coves</span>
            </div>
            <p className="text-[hsl(210,30%,85%)] opacity-60 mb-6 leading-relaxed">
              Authentic crystal jewellery and healing gemstone talismans crafted
              with intention. Each piece channels crystal wisdom to amplify your
              inner light and promote healing.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-[hsla(174,85%,45%,0.2)] rounded-lg bg-[hsla(174,85%,45%,0.05)] text-[hsl(174,85%,45%)] hover:border-[hsla(174,85%,45%,0.5)] hover:bg-[hsla(174,85%,45%,0.1)] transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-[hsl(210,30%,85%)] tracking-wider uppercase">
              Collections
            </h3>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[hsl(210,30%,85%)] opacity-60 hover:text-[hsl(174,85%,45%)] hover:opacity-100 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-[hsl(210,30%,85%)] tracking-wider uppercase">
              Guidance
            </h3>
            <ul className="space-y-3">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[hsl(210,30%,85%)] opacity-60 hover:text-[hsl(174,85%,45%)] hover:opacity-100 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-[hsl(210,30%,85%)] tracking-wider uppercase">
              Connect
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[hsl(210,30%,85%)] opacity-60">
                <Mail className="w-5 h-5 text-[hsl(174,85%,45%)] flex-shrink-0" />
                <div>
                  <div className="text-[hsl(210,30%,85%)]">info@trovesandcoves.ca</div>
                  <div className="text-sm opacity-70">Crystal consultations & guidance</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[hsl(210,30%,85%)] opacity-60">
                <MapPin className="w-5 h-5 text-[hsl(174,85%,45%)] flex-shrink-0" />
                <div>
                  <div className="text-[hsl(210,30%,85%)]">Winnipeg, Manitoba</div>
                  <div className="text-sm opacity-70">Serving Canada with nationwide shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[hsla(174,85%,45%,0.1)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[hsl(210,30%,85%)] opacity-50 text-sm">
              © 2025 Troves & Coves. All rights reserved. |
              <Link href="/privacy-policy" className="hover:text-[hsl(174,85%,45%)] transition-colors ml-1">
                Privacy Policy
              </Link>
            </div>

            <div className="flex items-center gap-2 text-[hsl(210,30%,85%)] opacity-50 text-sm">
              <span>✨</span>
              <span>Handcrafted with crystal intention</span>
              <span>✨</span>
            </div>
          </div>

          {/* Designer Credit */}
          <div className="flex justify-center mt-6 pt-4 border-t border-[hsla(174,85%,45%,0.1)]">
            <a
              href="https://reverb256.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(210,30%,85%)] opacity-40 hover:text-[hsl(174,85%,45%)] hover:opacity-100 text-xs transition-colors duration-300"
            >
              vibecoded with mystical energy ✦
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
