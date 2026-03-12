import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import SectionPill from '@/components/SectionPill';
import SectionDivider from '@/components/SectionDivider';

export default function Warranty() {
  const warrantyTerms = [
    {
      category: 'Craftsmanship Warranty',
      duration: '1 Year',
      icon: Shield,
      coverage: [
        'Wire wrapping integrity and security',
        'Metal component durability',
        'Clasp and connector functionality',
        'Overall structural integrity',
      ],
    },
    {
      category: 'Crystal Authenticity',
      duration: 'Lifetime',
      icon: Heart,
      coverage: [
        'Genuine natural crystal certification',
        'Accurate crystal identification',
        'Quality material verification',
        'Authenticity guarantee',
      ],
    },
    {
      category: 'Material Quality',
      duration: '6 Months',
      icon: CheckCircle,
      coverage: [
        'Sterling silver quality standards',
        'Gold-filled layer adhesion',
        'Copper wire purity',
        'Finish and plating durability',
      ],
    },
  ];

  const covered = [
    'Manufacturing defects in materials or workmanship',
    'Premature tarnishing or discoloration',
    'Wire breakage under normal wear',
    'Crystal loosening from secure settings',
    'Clasp or finding failure',
    'Professional cleaning and polishing services',
  ];

  const notCovered = [
    'Normal wear and aging of materials',
    'Damage from misuse or abuse',
    'Loss or theft of jewelry',
    'Scratches from improper storage',
    'Chemical damage from exposure',
    'Modifications by other jewelers',
  ];

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--bg-primary))' }}>
      {/* Header */}
      <section className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />

        <div className="relative chamber-container text-center">
          <SectionPill variant="gold" className="mb-8">
            Warranty Protection
          </SectionPill>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading" style={{ color: 'hsl(var(--text-primary))' }}>
            Warranty
          </h1>

          <SectionDivider variant="gradient" className="mb-6" />

          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>
            Your crystal jewelry is protected by our comprehensive warranty,
            ensuring lasting quality and beauty for years to come.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Warranty Coverage */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Warranty Coverage
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {warrantyTerms.map(term => {
              const Icon = term.icon;
              return (
                <Card
                  key={term.category}
                  className="shadow-lg border border-ornate-frame-gold/20"
                >
                  <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                    <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                      <Icon className="h-6 w-6 text-ornate-frame-gold" />
                      <div>
                        <div className="font-bold text-lg">{term.category}</div>
                        <Badge
                          variant="secondary"
                          className="bg-troves-turquoise/20 text-primary text-xs"
                        >
                          {term.duration}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {term.coverage.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start space-x-2" style={{ color: 'hsl(var(--text-secondary))' }}
                        >
                          <span className="text-troves-turquoise mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* What's Covered vs Not Covered */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg border border-ornate-frame-gold/20">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <CheckCircle className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Covered</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {covered.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm flex items-start space-x-2" style={{ color: 'hsl(var(--text-secondary))' }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-ornate-frame-gold/20">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <AlertCircle className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Not Covered</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {notCovered.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm flex items-start space-x-2" style={{ color: 'hsl(var(--text-secondary))' }}
                  >
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Warranty Process */}
        <Card className="mb-12 shadow-lg border border-ornate-frame-gold/20 bg-white">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <Clock className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">Warranty Claim Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">Contact Us</h4>
                <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))', opacity: 0.7 }}>
                  Email us with photos and your order details
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">Assessment</h4>
                <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))', opacity: 0.7 }}>
                  We review your claim within 24 hours
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">Return</h4>
                <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))', opacity: 0.7 }}>
                  Ship your item using our prepaid label
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h4 className="font-semibold text-primary mb-2">Resolution</h4>
                <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))', opacity: 0.7 }}>
                  Repair or replacement within 5-7 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-ornate-frame-gold/20">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-troves-turquoise mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-4">Our Promise</h3>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'hsl(var(--text-secondary))' }}>
              Every piece of Troves & Coves jewelry carries our commitment to
              quality and authenticity. We stand behind the craftsmanship of
              each creation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge
                variant="outline"
                className="border-troves-turquoise text-primary"
              >
                Handcrafted with Intention
              </Badge>
              <Badge
                variant="outline"
                className="border-skull-turquoise text-primary"
              >
                Handcrafted with Care
              </Badge>
              <Badge
                variant="outline"
                className="border-ornate-frame-gold text-primary"
              >
                Lifetime Support
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
