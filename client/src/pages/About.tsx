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
    <div className="min-h-screen bg-gradient-to-br from-stone-warm via-pearl-cream to-moonstone">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-pearl-cream via-crystal-accents to-pearl-cream text-navy overflow-hidden py-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skull-turquoise to-transparent" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-block px-6 py-2 border border-ornate-frame-gold/20 rounded-lg bg-ornate-frame-gold/5 backdrop-blur-sm mb-6">
            <span className="text-ornate-frame-gold/80 text-sm font-medium tracking-wider uppercase">
              Crystal Story
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
            <span className="text-troves-turquoise">About </span>
            <span className="text-coves-cursive-blue font-brand-cursive">
              Troves & Coves
            </span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-troves-turquoise via-skull-turquoise to-coves-cursive-blue rounded-full" />

          <p className="text-navy/80 text-xl max-w-4xl mx-auto leading-relaxed">
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
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-troves-turquoise to-coves-cursive-blue rounded-full mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-navy mb-6">
                  Our Crystal Mission
                </h2>
              </div>
              <p className="text-navy/80 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                At Troves & Coves, we believe that jewellery should be more than
                beautiful—it should be meaningful. Our mission is to create
                handcrafted crystal jewellery that serves as a bridge between
                the earthly and divine, helping spiritual seekers connect with
                their inner wisdom and the healing energy of authentic crystals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge
                  variant="outline"
                  className="border-troves-turquoise text-troves-turquoise bg-troves-turquoise/5 px-4 py-2"
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
            <h2 className="text-4xl font-bold text-navy mb-4">
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
                  className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm group hover:scale-105 transition-all duration-300"
                >
                  <CardHeader
                    className={`bg-gradient-to-r from-${chapter.color}/10 to-${chapter.color}/5 border-b border-ornate-frame-gold/20`}
                  >
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
                        <CardTitle className="text-navy text-xl">
                          {chapter.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-navy/80 leading-relaxed">
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
            <h2 className="text-4xl font-bold text-navy mb-4">
              Our Crystal Values
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-coves-cursive-blue to-skull-turquoise rounded-full" />
            <p className="text-navy/70 text-lg mt-6 max-w-3xl mx-auto">
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
                  className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm text-center group hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 bg-${value.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">
                      {value.title}
                    </h3>
                    <p className="text-navy/70 text-sm leading-relaxed">
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
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 via-skull-turquoise/10 to-coves-cursive-blue/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="text-center">
                <div className="flex items-center justify-center space-x-3 text-navy">
                  <Zap className="w-8 h-8 text-troves-turquoise" />
                  <span className="text-3xl font-bold">Our Artisan Craft</span>
                  <Sparkles className="w-8 h-8 text-coves-cursive-blue" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-navy mb-6">
                    Hand-Wrapped with Intention
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-troves-turquoise rounded-full flex items-center justify-center mt-1">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy mb-2">
                          Crystal Selection
                        </h4>
                        <p className="text-navy/70">
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
                        <h4 className="font-semibold text-navy mb-2">
                          Mindful Wrapping
                        </h4>
                        <p className="text-navy/70">
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
                        <h4 className="font-semibold text-navy mb-2">
                          Energy Blessing
                        </h4>
                        <p className="text-navy/70">
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
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-navy mb-6">
                  Join Our Crystal Community
                </h2>
                <div className="w-24 h-1 mx-auto bg-gradient-to-r from-troves-turquoise via-skull-turquoise to-coves-cursive-blue rounded-full mb-6" />
              </div>
              <p className="text-navy/80 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                Troves & Coves is more than a jewelry brand—we're a community of
                spiritual seekers, crystal lovers, and conscious souls. When you
                wear our pieces, you join a worldwide network of light workers
                and healers, each carrying the pure energy of authentic
                crystals.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-troves-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sun className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">
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
                  <h3 className="text-xl font-bold text-navy mb-2">
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
                  <h3 className="text-xl font-bold text-navy mb-2">
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
