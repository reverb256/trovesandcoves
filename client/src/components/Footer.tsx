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
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast({
      title: 'Welcome to our circle!',
      description: "You'll receive updates on our latest transformative collections and exclusive events.",
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
    <footer className="border-t pt-16 pb-8 content-layer relative overflow-hidden"
      style={{ 
        borderColor: 'hsla(174,85%,45%,0.15)',
        backgroundColor: 'hsl(var(--bg-primary))'
      }}
    >
      {/* Mystical background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-30"
          style={{ backgroundColor: 'hsla(174,85%,45%,0.03)', filter: 'blur(60px)' }}
        ></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ backgroundColor: 'hsla(43,95%,55%,0.03)', filter: 'blur(80px)' }}
        ></div>
      </div>

      {/* Mystical top border */}
      <div className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(174,85%,45%,0.5), transparent)' }}
      ></div>

      <div className="chamber-container">
        {/* Newsletter Section */}
        <div className="mb-16 text-center">
          <div className="crystal-card p-8 md:p-12 max-w-3xl mx-auto">
            {/* Mystical Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border-2 border-[hsla(var(--gold-medium), 0.4)] rounded-full bg-[hsla(var(--gold-soft),0.05)] animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-[hsl(var(--gold-medium))]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--text-secondary))] mb-4">
              <span className="text-shimmer">Join Our Circle</span>
            </h2>

            <p className="text-lg text-[hsl(var(--text-secondary))] mb-8">
              Be the first to discover new collections, empowering energy pieces, and exclusive events
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
                className="flex-1 px-6 py-3 bg-[hsla(var(--bg-tertiary), 0.5)] border border-[hsla(var(--border-light), 0.4)] rounded-lg text-[hsl(var(--text-secondary))] placeholder-[hsla(var(--text-muted),0.4)] focus:border-[hsla(var(--accent-vibrant),0.5)] focus:outline-none focus:ring-1 focus:ring-[hsla(var(--accent-vibrant),0.3)] transition-colors duration-300"
                required
              />
              <button
                type="submit"
                className="btn-mystical whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <p className="text-sm text-[hsl(var(--text-secondary))] /70 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-baseline gap-2 mb-6">
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, color: "#4abfbf", textTransform: "uppercase" }} className="text-2xl">Troves</span>
              <span className="text-2xl" style={{ fontFamily: "'Alex Brush', cursive", color: "#deb55b" }}>&</span>
              <span style={{ fontFamily: "'Alex Brush', cursive", color: "#e1af2f" }} className="text-2xl">Coves</span>
            </div>
            <p className="text-[hsl(var(--text-secondary))]/80 mb-6 leading-relaxed">
              Handcrafted crystal jewelry blending 14k gold-plated elegance with natural crystal beauty.
              Each piece is crafted with intention to empower your energy and enhance your unique presence.
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
                    className="p-3 border border-[hsla(var(--border-light), 0.4)] rounded-lg bg-[hsla(var(--accent-vibrant),0.05)] text-[hsl(var(--accent-medium))] hover:border-[hsla(var(--accent-vibrant),0.5)] hover:bg-[hsla(var(--border-light), 0.3)] transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-[hsl(var(--text-secondary))] tracking-wider uppercase">
              Collections
            </h3>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-medium))] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-[hsl(var(--text-secondary))] tracking-wider uppercase">
              Guidance
            </h3>
            <ul className="space-y-3">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent-medium))] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-[hsl(var(--text-secondary))] tracking-wider uppercase">
              Connect
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[hsl(var(--text-secondary))]/80">
                <Mail className="w-5 h-5 text-[hsl(var(--accent-medium))] flex-shrink-0" />
                <div>
                  <div className="text-[hsl(var(--text-secondary))]">info@trovesandcoves.ca</div>
                  <div className="text-sm /70">Personal consultations for your perfect piece</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[hsl(var(--text-secondary))]/80">
                <MapPin className="w-5 h-5 text-[hsl(var(--accent-medium))] flex-shrink-0" />
                <div>
                  <div className="text-[hsl(var(--text-secondary))]">Winnipeg, Manitoba</div>
                  <div className="text-sm /70">Shipping worldwide from the heart of Canada</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[hsla(var(--border-light), 0.3)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[hsl(var(--text-secondary))] /70 text-sm">
              © {currentYear} Troves & Coves. All rights reserved. |
              <Link href="/privacy-policy" className="hover:text-[hsl(var(--accent-medium))] transition-colors ml-1">
                Privacy Policy
              </Link>
              {" | "}
              <Link href="/showcase" className="hover:text-[hsl(var(--accent-medium))] transition-colors">
                Hero Showcase
              </Link>
            </div>

            <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))] /70 text-sm">
              <span>✨</span>
              <span>Crafted with intention to empower your energy</span>
              <span>✨</span>
            </div>
          </div>

          {/* Designer Credit */}
          <div className="flex justify-center mt-6 pt-4 border-t border-[hsla(var(--border-light), 0.3)]">
            <a
              href="https://reverb256.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(var(--text-secondary))] /60 hover:text-[hsl(var(--accent-medium))] hover:opacity-100 text-xs transition-colors duration-300"
            >
              vibecoded with mystical energy ✦
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
