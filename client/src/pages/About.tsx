import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Gem,
  Heart,
  Star,
  Sparkles,
  Moon,
  Sun,
  Compass,
  Zap,
} from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Gem,
      title: 'Natural Crystals',
      description:
        'Every piece features genuine crystals selected for their raw beauty and unique energy—blending perfectly with 14k gold-plated elegance.',
    },
    {
      icon: Heart,
      title: 'Crafted with Intention',
      description:
        'Each piece is created to empower your energy and enhance your presence, resonating with abundance and confidence.',
    },
    {
      icon: Star,
      title: 'Statement Design',
      description:
        'Our statement necklaces and bracelets offer more than luxury—they elevate both your style and spirit.',
    },
    {
      icon: Moon,
      title: 'Personal Guidance',
      description:
        'We provide personalized consultations to help you find pieces that embrace your bold femininity and strength.',
    },
  ];

  const story = [
    {
      phase: 'Discovery',
      title: 'The Power of Transformation',
      description:
        'Born from the belief that jewelry should elevate both style and spirit, Troves & Coves creates pieces that empower your energy.',
      icon: Compass,
    },
    {
      phase: 'Creation',
      title: 'Crafted with Intention',
      description:
        'We blend 14k gold-plated elegance with natural crystal beauty, creating statement pieces that enhance your unique presence.',
      icon: Zap,
    },
    {
      phase: 'Connection',
      title: 'Embrace Your Strength',
      description:
        'Our collection celebrates bold femininity and masculine strength—each piece resonating with abundance and confidence.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--bg-primary))' }}>
      {/* Header */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full" style={{
            backgroundColor: 'hsl(var(--gold-soft))',
            color: 'hsl(var(--text-primary))',
            boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)'
          }}>
            <span className="text-sm font-medium tracking-widest uppercase">
              Crystal Story
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-3">
            <span style={{ fontFamily: "\"Libre Baskerville\", serif", color: 'hsl(var(--accent-vibrant))', textTransform: 'uppercase' }}>About</span>
            <span style={{ fontFamily: "\"Alex Brush\", cursive", color: 'hsl(var(--gold-medium))' }}>&</span>
            <span style={{ fontFamily: "\"Alex Brush\", cursive", color: 'hsl(var(--gold-medium))' }}>Troves & Coves</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(var(--accent-vibrant)), hsl(var(--gold-medium)), hsl(var(--gold-medium)))' }} />

          <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: "\"Montserrat\", sans-serif", color: 'hsl(var(--text-secondary))' }}>
            We create handcrafted crystal jewelry that elevates both style and spirit.
            Each piece blends 14k gold-plated elegance with natural crystal beauty—
            crafted with intention to empower your energy and enhance your presence.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <section className="mb-20">
          <Card variant="elevated" theme="gradient">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, hsl(var(--accent-vibrant)), hsl(var(--gold-medium)))' }}>
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--accent-vibrant))' }}>
                  Our Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
                At Troves & Coves, we believe jewelry should be more than beautiful—
                it should be transformative. Our mission is to create statement pieces
                that empower your energy and enhance your presence. Each necklace and
                bracelet blends 14k gold-plated elegance with natural crystal beauty,
                crafted with intention to help you embrace bold femininity and strength.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium tracking-wider uppercase border"
                  style={{
                    border: '1px solid hsl(var(--accent-vibrant))',
                    color: 'hsl(var(--accent-vibrant))',
                    backgroundColor: 'hsla(174,85%,45%,0.05)',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  Crafted with Intention
                </span>
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium tracking-wider uppercase border"
                  style={{
                    border: '1px solid hsl(var(--gold-medium))',
                    color: 'hsl(var(--gold-medium))',
                    backgroundColor: 'hsla(43,95%,55%,0.05)',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  14k Gold-Plated
                </span>
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium tracking-wider uppercase border"
                  style={{
                    border: '1px solid hsl(var(--gold-medium))',
                    color: 'hsl(var(--gold-medium))',
                    backgroundColor: 'hsla(38,80%,53%,0.05)',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  Natural Crystals
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Story */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--accent-vibrant))' }}
            >
              Our Journey
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, hsl(var(--accent-vibrant)), hsl(var(--gold-medium)), hsl(var(--gold-medium)))' }} />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {story.map((chapter, index) => {
              const Icon = chapter.icon;
              return (
                <Card
                  key={index}
                  variant="interactive"
                  theme="gradient"
                >
                  <CardHeader variant="gradient">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span
                          className="inline-block px-3 py-1 text-xs tracking-wider uppercase rounded-full mb-2"
                          style={{
                            border: '1px solid hsl(var(--gold-medium))',
                            color: 'hsl(var(--gold-medium))',
                            backgroundColor: 'hsla(43,95%,55%,0.05)',
                            fontFamily: "'Montserrat', sans-serif"
                          }}
                        >
                          {chapter.phase}
                        </span>
                        <CardTitle className="text-xl" style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--text-primary))' }}>
                          {chapter.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>
                      {chapter.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--accent-vibrant))' }}
            >
              Our Values
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, hsl(var(--gold-medium)), hsl(var(--gold-medium)), hsl(var(--accent-vibrant)))' }} />
            <p className="text-lg mt-6 max-w-3xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
              These principles guide every piece we create—crafted with intention to
              empower your energy and enhance your presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="shadow-2xl backdrop-blur-sm text-center group hover:scale-105 transition-transform duration-300" style={{ border: '1px solid hsl(var(--border-medium))', background: 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)' }}
                >
                  <CardContent className="p-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'hsl(var(--text-primary))' }}>
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--text-muted))' }}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Artisan Process */}
        <section className="mb-20">
          <Card variant="elevated" theme="gradient">
            <CardHeader className="border-b" style={{ background: 'linear-gradient(90deg, hsla(174,85%,45%,0.05), hsla(43,95%,55%,0.03))', borderBottomColor: 'hsla(174,85%,45%,0.15)' }}>
              <CardTitle className="text-center">
                <div className="flex items-center justify-center gap-3" style={{ color: 'hsl(var(--text-primary))' }}>
                  <Zap className="w-8 h-8" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                  <span className="text-3xl font-bold" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>Our Artisan Craft</span>
                  <Sparkles className="w-8 h-8" style={{ color: 'hsl(var(--gold-medium))' }} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: 'hsl(var(--text-primary))' }}>
                    Hand-Wrapped with Intention
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                          Crystal Selection
                        </h4>
                        <p style={{ color: 'hsl(var(--text-muted))' }}>
                          Each crystal is hand-selected for its energy, clarity,
                          and spiritual properties.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                          Mindful Wrapping
                        </h4>
                        <p style={{ color: 'hsl(var(--text-muted))' }}>
                          Wire is carefully wrapped with meditation and positive
                          intention.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                          Energy Blessing
                        </h4>
                        <p style={{ color: 'hsl(var(--text-muted))' }}>
                          Each finished piece receives a blessing to activate
                          its healing potential.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-64 h-64 rounded-full flex items-center justify-center mx-auto shadow-2xl" style={{ background: 'linear-gradient(to bottom right, hsl(var(--accent-vibrant)), hsl(var(--accent-vibrant)), hsl(var(--accent-vibrant)))' }}>
                      <div className="w-48 h-48 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
                        <Gem className="w-24 h-24" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Connection & Community */}
        <section className="mb-20">
          <Card variant="elevated" theme="gradient">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--accent-vibrant))' }}
                >
                  Join Our Community
                </h2>
                <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ background: 'linear-gradient(90deg, hsl(var(--accent-vibrant)), hsl(var(--gold-medium)))' }} />
              </div>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
                Troves & Coves is more than a jewelry brand—we're a community of those
                seeking transformation through beauty. When you wear our pieces, you embrace
                bold femininity and strength, carrying energy that resonates with abundance
                and confidence.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                    <Sun className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                    Empower Your Energy
                  </h3>
                  <p style={{ color: 'hsl(var(--text-secondary))', opacity: 0.7 }}>
                    Statement pieces crafted with intention to enhance your presence.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                    <Moon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                    Elevate Your Spirit
                  </h3>
                  <p style={{ color: 'hsl(var(--text-secondary))', opacity: 0.7 }}>
                    Each piece blends 14k gold-plated elegance with natural crystal beauty.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                    Embrace Transformation
                  </h3>
                  <p style={{ color: 'hsl(var(--text-secondary))', opacity: 0.7 }}>
                    Connect with pieces that resonate with abundance and confidence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
