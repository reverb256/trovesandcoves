import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ruler, Circle, Square, ArrowUpDown } from 'lucide-react';

export default function SizeGuide() {
  const necklaceSizes = [
    {
      name: 'Choker',
      length: '14-16 inches',
      description: 'Sits close to the neck, perfect for pendants',
      fit: 'Snug',
    },
    {
      name: 'Princess',
      length: '17-19 inches',
      description: 'Classic length, sits at collarbone',
      fit: 'Standard',
    },
    {
      name: 'Matinee',
      length: '20-24 inches',
      description: 'Falls just below collarbone',
      fit: 'Relaxed',
    },
    {
      name: 'Opera',
      length: '28-34 inches',
      description: 'Long length, can be doubled',
      fit: 'Dramatic',
    },
    {
      name: 'Rope',
      length: '36+ inches',
      description: 'Extra long, versatile styling',
      fit: 'Statement',
    },
  ];

  const ringSizes = [
    { size: '4', diameter: '14.9mm', circumference: '46.8mm' },
    { size: '5', diameter: '15.7mm', circumference: '49.3mm' },
    { size: '6', diameter: '16.5mm', circumference: '51.9mm' },
    { size: '7', diameter: '17.3mm', circumference: '54.4mm' },
    { size: '8', diameter: '18.1mm', circumference: '57.0mm' },
    { size: '9', diameter: '19.0mm', circumference: '59.5mm' },
    { size: '10', diameter: '19.8mm', circumference: '62.1mm' },
  ];

  const braceletSizes = [
    { size: 'XS', length: '6-6.5 inches', wrist: '5.5-6 inches' },
    { size: 'S', length: '6.5-7 inches', wrist: '6-6.5 inches' },
    { size: 'M', length: '7-7.5 inches', wrist: '6.5-7 inches' },
    { size: 'L', length: '7.5-8 inches', wrist: '7-7.5 inches' },
    { size: 'XL', length: '8-8.5 inches', wrist: '7.5-8 inches' },
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
              Perfect Fit Guide
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
            <span className="text-navy">Size Guide</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />

          <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
            Find your perfect fit for our crystal jewelry. Each piece is crafted
            with care to align with your style and comfort.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Necklace Sizing */}
        <Card className="mb-12 shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <Circle className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">Necklace Length Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {necklaceSizes.map(size => (
                <div
                  key={size.name}
                  className="border border-ornate-frame-gold/10 rounded-lg p-4 bg-pearl-cream/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-navy">{size.name}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-troves-turquoise/20 text-navy text-xs"
                    >
                      {size.fit}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-troves-turquoise mb-2">
                    {size.length}
                  </p>
                  <p className="text-navy/70 text-sm">{size.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ring Sizing */}
        <Card className="mb-12 shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <Circle className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">Ring Size Chart</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-ornate-frame-gold/20">
                    <th className="text-left py-3 px-4 font-semibold text-navy">
                      US Size
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-navy">
                      Diameter
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-navy">
                      Circumference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ringSizes.map(ring => (
                    <tr
                      key={ring.size}
                      className="border-b border-ornate-frame-gold/10"
                    >
                      <td className="py-3 px-4 font-medium text-navy">
                        {ring.size}
                      </td>
                      <td className="py-3 px-4 text-navy/80">
                        {ring.diameter}
                      </td>
                      <td className="py-3 px-4 text-navy/80">
                        {ring.circumference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bracelet Sizing */}
        <Card className="mb-12 shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <Square className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">Bracelet Size Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {braceletSizes.map(size => (
                <div
                  key={size.size}
                  className="border border-ornate-frame-gold/10 rounded-lg p-4 bg-pearl-cream/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-navy text-lg">
                      {size.size}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-troves-turquoise text-navy"
                    >
                      {size.length}
                    </Badge>
                  </div>
                  <p className="text-navy/70 text-sm">Wrist: {size.wrist}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Measuring Instructions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Ruler className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">How to Measure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-navy mb-2">
                    Necklace Length
                  </h4>
                  <p className="text-navy/80 text-sm">
                    Use a soft measuring tape around your neck where you'd like
                    the necklace to sit.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">Ring Size</h4>
                  <p className="text-navy/80 text-sm">
                    Measure the inner diameter of a ring that fits well, or wrap
                    string around your finger.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">Bracelet</h4>
                  <p className="text-navy/80 text-sm">
                    Measure your wrist snugly, then add 0.5-1 inch for
                    comfortable movement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <ArrowUpDown className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Custom Sizing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-navy/80 mb-4">
                Need a custom size? We offer complimentary sizing adjustments
                for most jewelry pieces.
              </p>
              <ul className="space-y-2 text-navy/80 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Necklace extensions available</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Ring resizing within 2 sizes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Custom bracelet lengths</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Wire wrapping adjustments</span>
                </li>
              </ul>
              <p className="text-navy/60 text-xs mt-4">
                Contact us before ordering for custom sizing consultation.
              </p>
            </CardContent>
          </Card>
        </div>

        {}
        <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Circle className="h-12 w-12 text-troves-turquoise mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-4">
              Perfect Fit Philosophy
            </h3>
            <p className="text-navy/80 mb-6 max-w-2xl mx-auto">
              At Troves & Coves, we believe your jewelry should feel as
              beautiful as it looks. The perfect fit allows you to enjoy your
              pieces comfortably while providing elegance for daily wear and
              special occasions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge
                variant="outline"
                className="border-troves-turquoise text-navy"
              >
                Style Optimized
              </Badge>
              <Badge
                variant="outline"
                className="border-skull-turquoise text-navy"
              >
                Comfort First
              </Badge>
              <Badge
                variant="outline"
                className="border-ornate-frame-gold text-navy"
              >
                Perfect Alignment
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
