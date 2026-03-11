import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Shield, Sun, Moon, Heart, Sparkles } from 'lucide-react';

export default function JewelleryCare() {
  const materials = [
    {
      name: 'Sterling Silver',
      icon: Moon,
      care: [
        'Store in anti-tarnish pouches or cloth',
        'Clean with silver polishing cloth',
        'Avoid contact with lotions and perfumes',
        'Remove before swimming or exercising',
      ],
      crystalCare:
        'Silver enhances natural beauty - keep pieces polished and clean',
    },
    {
      name: 'Gold Filled',
      icon: Sun,
      care: [
        'Clean with mild soap and warm water',
        'Dry thoroughly with soft cloth',
        'Store separately to prevent scratching',
        'Professional cleaning annually',
      ],
      crystalCare:
        'Gold maintains lasting beauty - ideal for everyday wear',
    },
    {
      name: 'Copper Wire',
      icon: Heart,
      care: [
        'Allow natural patina development',
        'Clean with lemon juice if desired',
        'Keep dry to prevent green oxidation',
        'Seal with clear coat for lasting shine',
      ],
      crystalCare:
        'Copper develops natural patina - embrace the character of aged pieces',
    },
  ];

  const crystalCare = [
    {
      crystal: 'Amethyst',
      care: 'Avoid direct sunlight to prevent fading. Clean with soft cloth and mild soap.',
      appearance: 'Rich purple hues add elegant sophistication',
    },
    {
      crystal: 'Rose Quartz',
      care: 'Gentle cleaning with soft cloth. Avoid harsh chemicals.',
      appearance: 'Delicate pink tones bring warmth and elegance',
    },
    {
      crystal: 'Clear Quartz',
      care: 'Versatile and durable. Clean with warm water and mild soap.',
      appearance: 'Clarity and brilliance enhance any design',
    },
    {
      crystal: 'Citrine',
      care: 'Clean with warm water and gentle soap. Avoid harsh chemicals.',
      appearance: 'Warm golden tones bring brightness and style',
    },
    {
      crystal: 'Black Tourmaline',
      care: 'Clean with soft cloth. Avoid prolonged water exposure.',
      appearance: 'Deep black tones create dramatic contrast',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--bg-primary))' }}>
      {/* Header */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--gold-medium)), transparent)' }} />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full" style={{
            backgroundColor: 'hsl(var(--gold-soft))',
            color: 'hsl(var(--text-primary))',
            boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)'
          }}>
            <span className="text-sm font-medium tracking-widest uppercase">
              Jewelry Care
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-3">
            <span style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))', textTransform: 'uppercase' }}>Jewelry</span>
            <span style={{ fontFamily: '"Alex Brush", cursive', color: 'hsl(var(--gold-medium))' }}>&</span>
            <span style={{ fontFamily: '"Alex Brush", cursive', color: 'hsl(var(--gold-medium))' }}>Care Guide</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(var(--accent-vibrant)), hsl(var(--gold-medium)), hsl(var(--gold-medium)))' }} />

          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
            Preserve the beauty of your crystal jewelry with proper care. Each
            piece deserves regular maintenance to keep it looking its best.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Metal Care */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
            Metal Care Guidelines
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {materials.map(material => {
              const Icon = material.icon;
              return (
                <Card
                  key={material.name}
                  className="shadow-lg border border-ornate-frame-gold/20"
                >
                  <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                    <CardTitle className="flex items-center space-x-3">
                      <Icon className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
                      <span className="font-bold text-xl" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>{material.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <ul className="space-y-2">
                        {material.care.map((instruction, index) => (
                          <li
                            key={index}
                            className="text-sm flex items-start space-x-2" style={{ color: 'hsl(var(--text-secondary))' }}
                          >
                            <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>
                              •
                            </span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-3 bg-skull-turquoise/10 rounded-lg border border-ornate-frame-gold/20">
                        <p className="text-primary text-sm font-medium">
                          {material.crystalCare}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Crystal Care */}
        <Card className="mb-12 shadow-lg border border-ornate-frame-gold/20">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
              <span className="font-bold text-xl" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
                Crystal Care & Maintenance
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crystalCare.map(item => (
                <div
                  key={item.crystal}
                  className="border border-ornate-frame-gold/10 rounded-lg p-4 style={{ backgroundColor: 'rgba(250, 248, 243, 0.5)' }}"
                >
                  <h3 className="font-semibold mb-2" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
                    {item.crystal}
                  </h3>
                  <p className="text-sm mb-3" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>{item.care}</p>
                  <Badge
                    variant="secondary"
                    className="bg-troves-turquoise/20 text-primary text-xs"
                  >
                    {item.appearance}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* General Care Tips */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg border border-ornate-frame-gold/20">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
                <span className="font-bold text-xl" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>Daily Protection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-primary/80">
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>
                    Remove jewelry before showering, swimming, or exercising
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>
                    Apply perfumes and lotions before putting on jewelry
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>Store each piece separately to prevent scratching</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>
                    Clean regularly with appropriate methods for materials
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-ornate-frame-gold/20">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3">
                <Droplets className="h-6 w-6" style={{ color: 'hsl(var(--gold-medium))' }} />
                <span className="font-bold text-xl" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>Polishing & Care</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-primary/80">
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>Polish regularly with appropriate cleaning cloth</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>Store in soft pouches to prevent scratching</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>Professional cleaning available for deep restoration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1" style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                  <span>Avoid exposure to harsh chemicals and perfumes</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Professional Services */}
        <Card className="mt-12 shadow-lg border border-ornate-frame-gold/20 bg-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
              Professional Care Services
            </h3>
            <p className="mb-6" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
              We offer professional cleaning and repair services for all Troves
              & Coves jewelry pieces. Our care ensures your pieces maintain
              their beauty.
            </p>
            <Badge
              variant="outline"
              className="border-troves-turquoise text-primary"
            >
              Contact us for personalized care guidance
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
