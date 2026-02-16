export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      role="banner"
      aria-label="Hero Section"
    >
      {/* Mystical gradient background */}
      <div className="absolute inset-0 z-0 accent-mystical-gradient"></div>

      {/* Floating crystal elements with enhanced animations */}
      <div className="absolute w-4 h-4 bg-ornate-gold rounded-full top-10 left-10 animate-pulse floating-crystal"></div>
      <div className="absolute w-4 h-4 bg-ornate-gold rounded-full top-1/3 left-1/4 animate-pulse floating-crystal crystal-delay-1"></div>
      <div className="absolute w-4 h-4 bg-ornate-gold rounded-full top-2/3 left-1/2 animate-pulse floating-crystal crystal-delay-2"></div>
      <div className="absolute w-4 h-4 bg-ornate-gold rounded-full bottom-10 right-10 animate-pulse floating-crystal crystal-delay-3"></div>
      <div className="absolute inset-0 z-10 bg-black/30"></div>

      {/* Subtle light effects */}
      <div className="absolute inset-0 z-5 bg-gradient-to-br from-troves-turquoise/10 via-transparent to-ornate-gold/10"></div>

      <div className="relative h-screen flex items-center">
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Troves <span className="text-ornate-gold">& Coves</span>
            </h1>
            <p className="text-lg md:text-xl text-troves-turquoise/90 mb-8 leading-relaxed max-w-2xl">
              Authentic crystal jewelry and healing gemstone talismans crafted
              with intention in Winnipeg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-ornate-gold text-troves-turquoise hover:bg-ornate-gold/90 hover:shadow-lg hover:shadow-ornate-gold/30 h-12 px-8 py-4 btn-luxury shimmer-effect"
              >
                Browse our crystal jewelry
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2 border-ornate-gold text-ornate-gold hover:bg-ornate-gold/10 hover:shadow-lg hover:shadow-ornate-gold/20 h-12 px-8 py-4 btn-luxury-outline"
              >
                Learn more about our spiritual story
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
