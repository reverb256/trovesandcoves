export default function Hero() {
  const handleCtaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = '/products';
    }
  };

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center py-24"
      aria-label="Welcome"
    >
      <div className="chamber-container relative z-10">
        <div className="flex flex-col items-center justify-center gap-6 text-center max-w-4xl mx-auto">

          {/* Brand Name - Luxury Minimal with SEO Keywords */}
          <h1 className="leading-tight flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            <span
              style={{
                fontFamily: "Libre Baskerville, serif",
                fontWeight: 700,
                color: "hsl(var(--accent-vibrant))",
                textTransform: "uppercase",
                letterSpacing: "0.12em"
              }}
              className="text-4xl md:text-6xl lg:text-7xl"
            >
              TROVES
            </span>
            <span className="text-4xl md:text-6xl lg:text-7xl" style={{ fontFamily: "Alex Brush, cursive", color: "hsl(var(--gold-medium))" }}>
              &amp;
            </span>
            <span style={{ fontFamily: "Alex Brush, cursive", color: "hsl(var(--gold-medium))" }} className="text-5xl md:text-7xl lg:text-8xl">
              Coves
            </span>
            <span className="hidden"> | Handcrafted Crystal Jewelry & 14k Gold-Plated Necklaces</span>
          </h1>

          {/* Tagline - Clean and Minimal */}
          <p className="text-lg md:text-xl tracking-[0.25em] uppercase"
             style={{ fontFamily: "Montserrat, sans-serif", color: "hsl(var(--text-secondary))", fontWeight: 500 }}>
            Handcrafted Crystal Jewelry
          </p>

          <p className="text-base md:text-lg tracking-[0.15em] uppercase"
             style={{ fontFamily: "Montserrat, sans-serif", color: "hsl(var(--text-secondary))", fontWeight: 400 }}>
            Made in Canada
          </p>

          {/* CTA Button - Luxury Style */}
          <a
            href="/products"
            role="button"
            tabIndex={0}
            onKeyDown={handleCtaKeyDown}
            className="mt-8 inline-flex items-center justify-center px-10 py-4 no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "hsl(var(--bg-primary))",
              backgroundColor: "hsl(var(--accent-vibrant))",
              border: "none",
              borderRadius: "4px"
            }}
          >
            Shop the Collection
          </a>

        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.25em] uppercase"
                style={{ color: "hsl(var(--text-secondary))", fontFamily: "Montserrat, sans-serif" }}>
            Scroll
          </span>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ color: "hsl(var(--accent-vibrant))" }}>
            <path d="M10 14l-5-5h10l-5 5z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
