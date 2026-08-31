import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '@shared/brand-config';

export default function Home() {
  return (
    <>
      {/* Hero Section - Clean Landing */}
      <section className="relative min-h-screen flex items-center justify-center py-24">
        <div className="chamber-container relative z-10">
          <div className="flex flex-col items-center justify-center gap-8 text-center max-w-4xl mx-auto">
            {/* Brand Name */}
            <h1 className="leading-tight flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
              <span
                style={{
                  fontFamily: BRAND_CONFIG.typography.troves.fontFamily,
                  fontWeight: BRAND_CONFIG.typography.troves.fontWeight,
                  color: BRAND_CONFIG.colors.trovesTurquoise,
                  textTransform: BRAND_CONFIG.typography.troves.textTransform as 'uppercase',
                  letterSpacing: BRAND_CONFIG.typography.troves.letterSpacing as string,
                }}
                className="text-4xl md:text-6xl lg:text-7xl"
              >
                TROVES
              </span>
              <span
                className="text-4xl md:text-6xl lg:text-7xl"
                style={{
                  fontFamily: BRAND_CONFIG.typography.coves.fontFamily,
                  color: BRAND_CONFIG.colors.covesGold,
                }}
              >
                &amp;
              </span>
              <span
                style={{
                  fontFamily: BRAND_CONFIG.typography.coves.fontFamily,
                  color: BRAND_CONFIG.colors.covesGold,
                }}
                className="text-5xl md:text-7xl lg:text-8xl"
              >
                COVES
              </span>
              <span className="hidden">| Handcrafted Crystal Jewelry • Winnipeg</span>
            </h1>

            {/* Tagline */}
            <p
              className="text-lg md:text-xl tracking-[0.25em] uppercase"
              style={{
                fontFamily: BRAND_CONFIG.typography.body.fontFamily,
                color: BRAND_CONFIG.colors.textSecondary,
                fontWeight: 500,
              }}
            >
              {BRAND_CONFIG.name.tagline}
            </p>

            {/* Mission Statement */}
            <p
              className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{
                fontFamily: BRAND_CONFIG.typography.body.fontFamily,
                color: BRAND_CONFIG.colors.textSecondary,
              }}
            >
              {BRAND_CONFIG.aiGuidelines.brandVoice}
            </p>

            {/* Contact CTA */}
            <div className="mt-4">
              <Link
                href="https://www.etsy.com/ca/shop/TrovesandCoves"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 group"
                style={{
                  fontFamily: BRAND_CONFIG.typography.body.fontFamily,
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: BRAND_CONFIG.colors.background,
                  backgroundColor: BRAND_CONFIG.colors.trovesTurquoise,
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                <span>Shop on Etsy</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 ml-2" />
              </Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mt-8 text-sm">
              <a
                href="mailto:info@trovesandcoves.ca"
                className="hover:underline"
                style={{
                  fontFamily: BRAND_CONFIG.typography.body.fontFamily,
                  color: BRAND_CONFIG.colors.trovesTurquoise,
                }}
              >
                info@trovesandcoves.ca
              </a>
              <span style={{ color: BRAND_CONFIG.colors.textSecondary }}>·</span>
              <span
                style={{
                  fontFamily: BRAND_CONFIG.typography.body.fontFamily,
                  color: BRAND_CONFIG.colors.textSecondary,
                }}
              >
                Winnipeg, Manitoba, Canada
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
