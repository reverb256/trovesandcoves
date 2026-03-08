import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      title: 'Authentic Crystals',
      description:
        'Every piece features genuine, ethically sourced crystals selected for their unique energy and healing properties.',
      color: 'troves-turquoise',
    },
    {
      icon: Heart,
      title: 'Artisan Craftsmanship',
      description:
        'Hand-wrapped with intention and love, each piece is created to channel positive energy and spiritual connection.',
      color: 'coves-cursive-blue',
    },
    {
      icon: Star,
      title: 'Mystical Design',
      description:
        'Our designs blend ancient wisdom with modern aesthetics, creating wearable art that speaks to the soul.',
      color: 'skull-turquoise',
    },
    {
      icon: Moon,
      title: 'Spiritual Guidance',
      description:
        'We provide personalized consultations to help you find the perfect crystal companions for your journey.',
      color: 'troves-turquoise',
    },
  ];

  const story = [
    {
      phase: 'Discovery',
      title: 'The Crystal Calling',
      description:
        'Born from a deep connection to crystal energy and ancient wisdom, Troves & Coves emerged as a welcoming space for crystal lovers.',
      icon: Compass,
      color: 'coves-cursive-blue',
    },
    {
      phase: 'Creation',
      title: 'Artisan Awakening',
      description:
        'We began hand-wrapping crystals with wire, infusing each piece with intention and creating jewellery that carries healing energy.',
      icon: Zap,
      color: 'troves-turquoise',
    },
    {
      phase: 'Connection',
      title: 'Community of Light',
      description:
        'Our online sanctuary connects crystal lovers worldwide, sharing knowledge, energy, and beautiful handcrafted jewellery.',
      icon: Sparkles,
      color: 'skull-turquoise',
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

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
            <span style={{ color: 'hsl(var(--accent-vibrant))' }}>About </span>
            <span className="font-brand-cursive" style={{ color: 'hsl(215 95% 55%)' }}>
              Troves & Coves
            </span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(var(--accent-vibrant)), hsl(215 95% 55%))' }} />

          <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>
            We are artisan crystal jewellery creators, weaving ancient wisdom
            into modern wearable art. Each piece is hand-wrapped with mindful
            intention, connecting you to the mystical energy of genuine
            crystals.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <section className="mb-20">
          <Card variant="elevated" theme="gradient"
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-troves-turquoise to-coves-cursive-blue rounded-full mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6" style={{ color: 'hsl(var(--text-primary))' }}>
                  Our Crystal Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8" style={{ color: 'hsl(var(--text-secondary))' }}>
                At Troves & Coves, we believe that jewellery should be more than
                beautiful—it should be meaningful. Our mission is to create
                handcrafted crystal jewellery that serves as a bridge between
                the earthly and divine, helping spiritual seekers connect with
                their inner wisdom and the healing energy of authentic crystals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge
                  variant="outline"
                  className="px-4 py-2" style={{ border: '1px solid hsl(var(--accent-vibrant))', color: 'hsl(var(--accent-vibrant))', backgroundColor: 'hsla(var(--accent-vibrant), 0.05)' }}
                >
                  Handcrafted with Love
                </Badge>
                <Badge
                  variant="outline"
                  className="border-coves-cursive-blue text-coves-cursive-blue bg-coves-cursive-blue/5 px-4 py-2"
                >
                  Ethically Sourced
                </Badge>
                <Badge
                  variant="outline"
                  className="border-skull-turquoise text-skull-turquoise bg-skull-turquoise/5 px-4 py-2"
                >
                  Spiritually Infused
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Story */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'hsl(var(--text-primary))' }}>
              Our Crystal Journey
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-troves-turquoise to-coves-cursive-blue rounded-full" />
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
                        className={`w-12 h-12 bg-${chapter.color} rounded-full flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={`border-${chapter.color} text-${chapter.color} mb-2`}
                        >
                          {chapter.phase}
                        </Badge>
                        <CardTitle className="text-xl" style={{ color: 'hsl(var(--text-primary))' }}>
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
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'hsl(var(--text-primary))' }}>
              Our Crystal Values
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-coves-cursive-blue to-skull-turquoise rounded-full" />
            <p className="text-lg mt-6 max-w-3xl mx-auto" style={{ color: 'hsl(var(--text-muted))' }}>
              These core values guide every aspect of our craft, from crystal
              selection to the final blessing of each piece.
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
                      className={`w-16 h-16 bg-${value.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
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
          <Card variant="elevated" theme="gradient"
            <CardHeader className="border-b" style={{ background: 'linear-gradient(90deg, hsla(var(--accent-vibrant), 0.1), hsla(var(--accent-vibrant), 0.05), hsla(215 95% 55%, 0.05))', borderBottomColor: 'hsl(var(--border-medium))' }}>
              <CardTitle className="text-center">
                <div className="flex items-center justify-center space-x-3" style={{ color: 'hsl(var(--text-primary))' }}>
                  <Zap className="w-8 h-8 text-troves-turquoise" />
                  <span className="text-3xl font-bold">Our Artisan Craft</span>
                  <Sparkles className="w-8 h-8 text-coves-cursive-blue" />
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
                      <div className="w-8 h-8 bg-coves-cursive-blue rounded-full flex items-center justify-center mt-1">
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
                      <div className="w-8 h-8 bg-skull-turquoise rounded-full flex items-center justify-center mt-1">
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
                    <div className="w-64 h-64 bg-gradient-to-br from-troves-turquoise via-skull-turquoise to-coves-cursive-blue rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <div className="w-48 h-48 bg-background rounded-full flex items-center justify-center">
                        <Gem className="w-24 h-24 text-troves-turquoise" />
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-coves-cursive-blue rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-skull-turquoise rounded-full flex items-center justify-center">
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
          <Card variant="elevated" theme="gradient"
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6" style={{ color: 'hsl(var(--text-primary))' }}>
                  Join Our Crystal Community
                </h2>
                <div className="w-24 h-1 mx-auto bg-gradient-to-r from-troves-turquoise via-skull-turquoise to-coves-cursive-blue rounded-full mb-6" />
              </div>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8" style={{ color: 'hsl(var(--text-secondary))' }}>
                Troves & Coves is more than a jewelry brand—we're a community of
                spiritual seekers, crystal lovers, and conscious souls. When you
                wear our pieces, you join a worldwide network of light workers
                and healers, each carrying the pure energy of authentic
                crystals.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
                    <Sun className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                    Daily Inspiration
                  </h3>
                  <p className="text-navy/70">
                    Crystal wisdom and spiritual guidance shared through our
                    community.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-coves-cursive-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Moon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                    Crystal Rituals
                  </h3>
                  <p className="text-navy/70">
                    Learn how to cleanse, charge, and work with your crystal
                    jewelry.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-skull-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>
                    Healing Circle
                  </h3>
                  <p className="text-navy/70">
                    Connect with like-minded souls on their spiritual journey.
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
