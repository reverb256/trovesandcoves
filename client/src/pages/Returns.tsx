import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
} from 'lucide-react';

export default function Returns() {
  const returnPolicy = [
    {
      category: 'Satisfaction Guarantee',
      duration: '30 Days',
      icon: Heart,
      conditions: [
        'Item must be in original condition',
        'Original packaging and authenticity card included',
        'No signs of wear or damage',
        'Crystal energy must remain intact',
      ],
    },
    {
      category: 'Quality Issues',
      duration: '60 Days',
      icon: CheckCircle2,
      conditions: [
        'Manufacturing defects covered',
        'Wire breakage under normal use',
        'Crystal authenticity issues',
        'Clasp or finding failures',
      ],
    },
    {
      category: 'Custom Orders',
      duration: 'Exchange Only',
      icon: Package,
      conditions: [
        'Size adjustments within 14 days',
        'Crystal substitutions if unavailable',
        'Wire material changes',
        'Energy cleansing included',
      ],
    },
  ];

  const nonReturnable = [
    'Pierced jewelry for hygiene reasons',
    'Items damaged by misuse or accidents',
    'Jewelry exposed to chemicals',
    'Custom engraved pieces',
    'Sale or clearance items',
    'Items purchased over 60 days ago',
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
              Our Promise
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
            <span className="text-navy">Returns & Exchanges</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />

          <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
            Your satisfaction with our jewelry is paramount. We offer generous
            return and exchange policies to ensure you're completely happy with
            your purchase.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Return Policy */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            Return Policy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {returnPolicy.map(policy => {
              const Icon = policy.icon;
              return (
                <Card
                  key={policy.category}
                  className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm"
                >
                  <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                    <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                      <Icon className="h-6 w-6 text-ornate-frame-gold" />
                      <div>
                        <div className="font-bold text-lg">
                          {policy.category}
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-troves-turquoise/20 text-navy text-xs"
                        >
                          {policy.duration}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {policy.conditions.map((condition, index) => (
                        <li
                          key={index}
                          className="text-navy/80 text-sm flex items-start space-x-2"
                        >
                          <span className="text-troves-turquoise mt-1">•</span>
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Return Process */}
        <Card className="mb-12 shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <RotateCcw className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">Easy Return Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">1</span>
                </div>
                <h4 className="font-semibold text-navy mb-2">Contact Us</h4>
                <p className="text-navy/70 text-sm">
                  Email us within the return window with your order details
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">2</span>
                </div>
                <h4 className="font-semibold text-navy mb-2">
                  Get Authorization
                </h4>
                <p className="text-navy/70 text-sm">
                  Receive return authorization and prepaid shipping label
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">3</span>
                </div>
                <h4 className="font-semibold text-navy mb-2">Ship Safely</h4>
                <p className="text-navy/70 text-sm">
                  Package securely and ship using our provided label
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">4</span>
                </div>
                <h4 className="font-semibold text-navy mb-2">Get Refund</h4>
                <p className="text-navy/70 text-sm">
                  Receive refund within 3-5 business days of receipt
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Cannot Be Returned */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <XCircle className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Non-Returnable Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {nonReturnable.map((item, index) => (
                  <li
                    key={index}
                    className="text-navy/80 text-sm flex items-start space-x-2"
                  >
                    <XCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Clock className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Important Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-navy/80">
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Refunds processed to original payment method</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Exchanges available for different sizes or styles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Free return shipping on defective items</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Energy cleansing included with all exchanges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Store credit available for future purchases</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-troves-turquoise mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-4">
              Our Commitment
            </h3>
            <p className="text-navy/80 mb-6 max-w-2xl mx-auto">
              We want you to feel completely happy with your purchase. If your
              jewelry doesn't meet your expectations, we'll work together to
              find the perfect solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge
                variant="outline"
                className="border-troves-turquoise text-navy"
              >
                Customer Satisfaction First
              </Badge>
              <Badge
                variant="outline"
                className="border-skull-turquoise text-navy"
              >
                Energy Alignment Guaranteed
              </Badge>
              <Badge
                variant="outline"
                className="border-ornate-frame-gold text-navy"
              >
                Spiritual Journey Support
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
