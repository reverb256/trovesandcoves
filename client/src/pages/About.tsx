import { Card, CardContent } from '@/components/ui/card';
import { Award, Gem, MapPin, Hand, Mail } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import SectionPill from '@/components/SectionPill';
import SectionDivider from '@/components/SectionDivider';
import SectionHeader from '@/components/SectionHeader';
import CTAButton from '@/components/CTAButton';
import IconCircle from '@/components/IconCircle';
import { BreadcrumbSchema } from '@/components/SchemaOrg';

export default function About() {
  const values = [
    {
      icon: Award,
      title: 'Quality Materials',
      description: '14k gold-filled components and genuine crystals selected for their exceptional clarity and natural beauty.',
    },
    {
      icon: Hand,
      title: 'Handcrafted in Canada',
      description: 'Each piece is meticulously crafted by hand in our Winnipeg studio, ensuring attention to detail in every creation.',
    },
    {
      icon: Gem,
      title: 'Authentic Gemstones',
      description: 'We use only genuine crystals and natural stones—never synthetic alternatives.',
    },
    {
      icon: MapPin,
      title: 'Canadian Made',
      description: 'Proudly crafted in Winnipeg, Manitoba. Canadian quality and craftsmanship in every piece.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Material Selection',
      description: 'We source premium 14k gold-filled components and authentic crystals for durability and lasting beauty.',
    },
    {
      step: '02',
      title: 'Design & Planning',
      description: 'Each piece is thoughtfully designed to balance elegance with everyday wearability.',
    },
    {
      step: '03',
      title: 'Hand Assembly',
      description: 'Every necklace and bracelet is carefully crafted by hand with precision and care.',
    },
  ];

  return (
    <>
      <SEOHead
        title="About Troves & Coves | Handcrafted Crystal Jewelry | Winnipeg, Canada"
        description="Learn about Troves & Coves' story. Every crystal necklace and bracelet is handcrafted in Winnipeg with 14k gold-filled wire and genuine gemstones."
        url="https://trovesandcoves.ca/about"
        type="website"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' }
        ]}
      />
      <div
        className="min-h-screen"
        style={{ background: 'hsl(var(--bg-primary))' }}
      >
      {/* Header */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--gold-medium)), transparent)' }} />

        <div className="relative chamber-container text-center">
          <SectionPill variant="gold" className="mb-10">
            Our Story
          </SectionPill>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 flex flex-col items-center justify-center gap-2">
            <span style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>About</span>
            <span style={{ fontFamily: '"Alex Brush", cursive', color: 'hsl(var(--gold-medium))' }}>Troves & Coves</span>
          </h1>

          <SectionDivider variant="gold" className="mb-8" />

          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-6" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-primary))' }}>
            Discover handcrafted crystal jewelry designed for modern elegance.
          </p>

          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-4" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-primary))' }}>
            Each piece is designed to elevate your style with timeless beauty,
            blending the elegance of 14k gold-plated chains with the natural beauty of crystals.
          </p>

          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
            Our statement necklaces and bracelets offer more than just luxury - they are crafted
            with intention for pieces that feel powerful and grounded.
            <br /><br />
            Embrace bold elegance with our exquisite collection, where
            every detail reflects quality craftsmanship and confidence.
          </p>
        </div>
      </section>

      <div className="chamber-container py-16 md:py-24">
        {/* Brand Story */}
        <section className="mb-24 md:mb-32">
          <SectionHeader
            title="Our Story"
            variant="gold"
          />

          <Card
            className="max-w-4xl mx-auto"
            style={{
              background: 'hsl(var(--bg-card))',
              border: '1px solid hsla(var(--gold-medium), 0.15)',
              borderRadius: '8px'
            }}
          >
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6 text-base md:text-lg leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
                <p>
                  Troves & Coves was founded on a simple belief: jewelry should be both beautiful and well-made.
                  Based in Winnipeg, Manitoba, we create handcrafted crystal jewelry that combines timeless elegance
                  with quality materials.
                </p>
                <p>
                  Every piece starts with carefully selected components—14k gold-filled chains and findings that
                  offer the beauty of gold with durability for everyday wear. We pair these with genuine crystals
                  and natural gemstones, chosen for their clarity and character.
                </p>
                <p>
                  Our workshop is where precision meets artistry. Each necklace and bracelet is crafted by hand,
                  one piece at a time. This hands-on approach ensures quality control at every stage and allows
                  us to create jewelry that feels personal and special.
                </p>
                <p>
                  Whether you're treating yourself or selecting a gift, we invite you to explore our collection
                  of handcrafted pieces—each one made with care in Canada.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Uniqueness Statement */}
          <p className="text-xl md:text-2xl font-semibold text-center mt-12" style={{
            fontFamily: '"Alex Brush", cursive',
            color: 'hsl(var(--gold-medium))'
          }}>
            Each piece uniquely one of a kind
          </p>
        </section>

        {/* Materials */}
        <section className="mb-24 md:mb-32">
          <SectionHeader
            title="Materials"
            description="Quality materials form the foundation of every piece we create."
            variant="gold"
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card
              style={{
                background: 'hsl(var(--bg-card))',
                border: '1px solid hsla(var(--gold-medium), 0.15)',
                borderRadius: '8px'
              }}
            >
              <CardContent className="p-8">
                <IconCircle icon={Award} variant="gold-soft" size="sm" className="mb-6" />
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}>
                  14k Gold-Filled
                </h3>
                <p className="leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
                  We use 14k gold-filled components—a thick layer of gold bonded to a base metal.
                  Unlike gold plating, gold-filled jewelry is durable, tarnish-resistant, and suitable
                  for everyday wear. With proper care, your gold-filled pieces will maintain their beauty for years.
                </p>
              </CardContent>
            </Card>

            <Card
              style={{
                background: 'hsl(var(--bg-card))',
                border: '1px solid rgba(74, 191, 191, 0.2)',
                borderRadius: '8px'
              }}
            >
              <CardContent className="p-8">
                <IconCircle icon={Gem} variant="turquoise" size="sm" className="mb-6" />
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}>
                  Genuine Crystals
                </h3>
                <p className="leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
                  Each crystal and gemstone we use is naturally formed, selected for its clarity,
                  color, and unique characteristics. We believe in the authenticity of natural
                  stones—no synthetics, no imitations. Each piece carries the distinctive beauty
                  of the earth it came from.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="mb-24 md:mb-32">
          <SectionHeader
            title="What We Stand For"
            variant="gold"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="text-center transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: 'hsl(var(--bg-card))',
                    border: '1px solid rgba(225, 175, 47, 0.15)',
                    borderRadius: '8px'
                  }}
                >
                  <CardContent className="p-6">
                    <IconCircle icon={Icon} variant="gold-soft" size="md" className="mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-3" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}>
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Process */}
        <section className="mb-24 md:mb-32">
          <SectionHeader
            title="Our Process"
            description="From concept to completion, every piece receives careful attention."
            variant="gold"
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--gold-medium))', opacity: 0.3 }}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <Card
            className="max-w-3xl mx-auto"
            style={{
              background: 'hsl(var(--text-primary))',
              borderRadius: '8px'
            }}
          >
            <CardContent className="p-10 md:p-14 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--bg-primary))' }}>
                Get in Touch
              </h2>
              <p className="text-base md:text-lg mb-10 leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}>
                Have questions about a piece? Interested in a custom order? We'd love to hear from you.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <CTAButton variant="gold" href="mailto:info@trovesandcoves.ca" size="sm">
                  <Mail className="w-5 h-5" />
                  <span>info@trovesandcoves.ca</span>
                </CTAButton>

                <CTAButton variant="outline" href="https://instagram.com/trovesandcoves" target="_blank" rel="noopener noreferrer" size="sm">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.012.057-.353 1.085-.232 1.614-.053 1.877-.208.856.528 1.58 1.067 2.355c.537 1.378 1.52 2.25 1.52 4.025 0 2.447-.01 3.557-.602 4.317-.39.814-.57-.763-1.28-.876-1.004-.233-.232-.43-.448-.585-.646-.264-.312-.413-.585-.413-.585 0-.373.148-.585.413-.585.413 0 .083.012.17.035.256.11.153.247.325.476.667.59 1.107.336.696.645 1.12.645.424 0 .763-.108 1.34-.264 1.732-.455.474-.39.85-.866-1.13-1.453-.308-.526-.61-1.046-.91-1.566-.326-.685-.568-1.02-.568-1.485 0-.846.31-1.577.924-2.176 1.584-.726 1.576-1.636 2.604-.865 1.72-1.363 2.454-.726.892-1.21 1.538-1.21 2.454 0 .537.033.815.11.96.066.347.1.697.17 1.038.274 1.455.472.51.875.983.496 1.322.42.383.86.52 1.086.472 1.732.472.872 0 1.763-.508 2.866-1.394.782-.946 1.276-1.41 1.938-1.41 3.356 0 1.19-.367 2.188-1.1 2.987-.63.794-1.12-1.538-1.12-2.587 0-.855.308-1.533.924-2.032 1.584-.63 1.874-1.41 2.604-2.374.803-.983 1.26-1.484 2.03-1.484 3.27 0 .983.37 1.87 1.11 2.613.42.622.876.938.998 1.365.12.448.01 1.564.01 2.453z"/>
                  </svg>
                  <span>@trovesandcoves</span>
                </CTAButton>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
    </>
  );
}
