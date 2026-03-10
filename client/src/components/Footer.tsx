import { Link } from 'wouter';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://www.facebook.com/trovesandcoves',
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
    { name: 'Gemstone Necklaces', href: '/products/gemstone-necklaces' },
    { name: 'Leather Cord Pendants', href: '/products/leather-cord-pendants' },
    { name: 'All Products', href: '/products' },
    { name: 'Featured Items', href: '/' },
    { name: 'Contact', href: '/contact' },
  ];

  const customerCare = [
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Jewelry Care', href: '/jewelry-care' },
    { name: 'Warranty', href: '/warranty' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Financing', href: '/financing' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="border-t pt-16 pb-8 relative overflow-hidden" style={{ borderColor: 'rgba(74, 191, 191, 0.15)', backgroundColor: '#faf8f3' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(74, 191, 191, 0.5), transparent)' }}></div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl" style={{ fontFamily: 'Libre Baskerville, serif', fontWeight: 700, color: '#4abfbf', textTransform: 'uppercase' }}>Troves</span>
              <span className="text-2xl" style={{ fontFamily: 'Alex Brush, cursive', color: '#e1af2f' }}>&</span>
              <span className="text-2xl" style={{ fontFamily: 'Alex Brush, cursive', color: '#e1af2f' }}>Coves</span>
            </div>
            <p className="mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', color: '#5f5f5f' }}>
              Handcrafted crystal jewelry featuring 14k gold-filled wire and genuine gemstones.
              Each piece is thoughtfully designed and crafted in Winnipeg, Canada.
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
                    className="p-3 border rounded-lg transition-colors duration-300"
                    style={{ borderColor: 'rgba(74, 191, 191, 0.2)', backgroundColor: 'rgba(74, 191, 191, 0.05)', color: '#4abfbf' }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1f1f1f' }}>
              Collections
            </h3>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-[#4abfbf] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif', color: '#5f5f5f' }}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1f1f1f' }}>
              Customer Care
            </h3>
            <ul className="space-y-3">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-[#4abfbf] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif', color: '#5f5f5f' }}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif', color: '#1f1f1f' }}>
              Connect
            </h3>
            <div className="space-y-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#5f5f5f' }}>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#4abfbf' }} />
                <div>
                  <div style={{ color: '#1f1f1f' }}>info@trovesandcoves.ca</div>
                  <div className="text-sm opacity-70">We'd love to hear from you</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#e1af2f' }} />
                <div>
                  <div style={{ color: '#1f1f1f' }}>Winnipeg, Manitoba</div>
                  <div className="text-sm opacity-70">Handcrafted in Canada</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8" style={{ borderColor: 'rgba(225, 175, 47, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm" style={{ fontFamily: 'Montserrat, sans-serif', color: '#5f5f5f' }}>
              © {currentYear} Troves & Coves. All rights reserved. |
              <Link href="/privacy-policy" className="hover:text-[#4abfbf] transition-colors ml-1">
                Privacy Policy
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif', color: '#5f5f5f' }}>
              <span style={{ color: '#e1af2f' }}>◆</span>
              <span>Handcrafted in Winnipeg, Canada</span>
              <span style={{ color: '#e1af2f' }}>◆</span>
            </div>
          </div>

          <div className="flex justify-center mt-6 pt-4 border-t" style={{ borderColor: 'rgba(225, 175, 47, 0.15)' }}>
            <a
              href="https://reverb256.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4abfbf] hover:opacity-100 text-xs transition-colors duration-300"
              style={{ fontFamily: 'Montserrat, sans-serif', color: '#5f5f5f' }}
            >
              Web Design by Reverb256 ✦
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
