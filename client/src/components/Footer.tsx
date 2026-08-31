import { Link } from 'wouter';
import { Facebook, Instagram, Mail, MapPin, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG } from '@shared/brand-config';

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

  return (
    <footer className="border-t pt-16 pb-8 relative overflow-hidden" style={{ borderColor: 'rgba(74, 191, 191, 0.15)', backgroundColor: 'hsl(var(--bg-primary))' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(74, 191, 191, 0.5), transparent)' }}></div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-baseline gap-2 mb-6">
              <span
                className="text-2xl"
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontWeight: 700,
                  color: BRAND_CONFIG.colors.trovesTurquoise,
                  textTransform: 'uppercase'
                }}
              >
                Troves
              </span>
              <span
                className="text-2xl"
                style={{
                  fontFamily: "'Alex Brush', cursive",
                  color: BRAND_CONFIG.colors.covesGold
                }}
              >
                &
              </span>
              <span
                className="text-2xl"
                style={{
                  fontFamily: "'Alex Brush', cursive",
                  color: BRAND_CONFIG.colors.covesGold
                }}
              >
                Coves
              </span>
            </div>
            <p
              className="mb-6 leading-relaxed"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: BRAND_CONFIG.colors.textSecondary
              }}
            >
              {BRAND_CONFIG.voice.brandVoice}
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
                    style={{
                      borderColor: 'rgba(74, 191, 191, 0.2)',
                      backgroundColor: 'rgba(74, 191, 191, 0.05)',
                      color: BRAND_CONFIG.colors.trovesTurquoise
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3
              className="font-semibold text-lg mb-6 tracking-wider uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: BRAND_CONFIG.colors.textPrimary
              }}
            >
              Connect
            </h3>
            <div
              className="space-y-4"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: BRAND_CONFIG.colors.textSecondary
              }}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: BRAND_CONFIG.colors.trovesTurquoise }} />
                <div>
                  <div style={{ color: BRAND_CONFIG.colors.textPrimary }}>info@trovesandcoves.ca</div>
                  <div className="text-sm opacity-70">We'd love to hear from you</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: BRAND_CONFIG.colors.covesGold }} />
                <div>
                  <div style={{ color: BRAND_CONFIG.colors.textPrimary }}>Winnipeg, Manitoba</div>
                  <div className="text-sm opacity-70">Handcrafted in Canada</div>
                </div>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3
              className="font-semibold text-lg mb-6 tracking-wider uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: BRAND_CONFIG.colors.textPrimary
              }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-turquoise-bright transition-colors duration-300"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: BRAND_CONFIG.colors.textSecondary
                  }}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8" style={{ borderColor: 'rgba(225, 175, 47, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div
              className="text-sm"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: BRAND_CONFIG.colors.textSecondary
              }}
            >
              © {currentYear} Troves & Coves. All rights reserved.
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Montserrat', sans-serif", color: BRAND_CONFIG.colors.textSecondary }}>
              <span style={{ color: BRAND_CONFIG.colors.covesGold }}>◆</span>
              <span>Handcrafted in Winnipeg, Canada</span>
              <span style={{ color: BRAND_CONFIG.colors.covesGold }}>◆</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
