
export default function Hero() {
  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center py-20"
      aria-label="Welcome"
    >
      {/* Mystical Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsla(174,85%,45%,0.05)] rounded-full blur-3xl animate-glow-breathe"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[hsla(43,95%,55%,0.03)] rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[hsla(200,70%,50%,0.03)] rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Crystal Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[hsla(174,85%,45%,0.6)] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`gold-${i}`}
            className="absolute w-1 h-1 bg-[hsla(43,95%,55%,0.5)] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="chamber-container relative z-10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">

          <h1 className="leading-tight flex items-center justify-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="flex-shrink-0 relative inline-block">
              <div className="absolute top-1/2 left-0" style={{ transform: 'translate(-50%, calc(-50% + 2%))' }}>
                <svg width="128" height="128" viewBox="0 0 96 96" className="overflow-visible">
                  <defs>
                    <radialGradient id="gemGradient" cx="20%" cy="20%" r="70%">
                      <stop offset="0%" stopColor="#deb55b" stopOpacity="1" />
                      <stop offset="100%" stopColor="#deb55b" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M24 12h48l16 24l-40 52L8 36l16-24Z"
                    stroke="url(#gemGradient)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="url(#gemGradient)"
                    fillOpacity="0.2"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontWeight: 700,
                  color: "#4abfbf",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}
                className="text-4xl md:text-5xl lg:text-6xl relative z-10"
              >
                TROVES
              </span>
            </div>
            {' '}
            <span className="text-3xl md:text-4xl lg:text-5xl" style={{ fontFamily: "'Alex Brush', cursive", color: "#deb55b" }}>
              &amp;
            </span>
            {' '}
            <span style={{ fontFamily: "'Alex Brush', cursive", color: "#e1af2f" }} className="text-4xl md:text-5xl lg:text-6xl">
              Coves
            </span>
          </h1>

          <p className="text-base md:text-lg tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif", color: "#4abfbf", fontWeight: 400 }}>
            Handcrafted Crystal Jewellery
          </p>

          <p className="max-w-2xl text-sm md:text-base leading-relaxed mt-4" style={{ fontFamily: "'Montserrat', sans-serif", color: "hsla(var(--text-secondary),0.8)" }}>
            Discover the power of transformation with our handcrafted crystal jewelry.
            Each piece is designed to elevate your style and spirit, blending elegance with raw beauty.
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#4abfbf" }}>
          <path d="M10 14l-5-5h10l-5 5z" />
        </svg>
      </div>
    </section>
  );
}
