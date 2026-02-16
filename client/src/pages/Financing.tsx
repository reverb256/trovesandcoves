import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Calendar,
  DollarSign,
  Shield,
  Calculator,
  CheckCircle,
} from 'lucide-react';

export default function Financing() {
  const paymentOptions = [
    {
      name: 'Shop Pay Installments',
      icon: CreditCard,
      terms: '4 interest-free payments',
      description: 'Split your purchase into 4 equal payments over 6 weeks',
      benefits: [
        'No interest or fees',
        'Instant approval',
        'Easy checkout integration',
      ],
    },
    {
      name: 'PayPal Pay in 4',
      icon: Calendar,
      terms: '4 interest-free payments',
      description: 'Pay 25% today, then 3 more payments every 2 weeks',
      benefits: [
        'No interest if paid on time',
        'No impact on credit score',
        'Flexible payment dates',
      ],
    },
    {
      name: 'Etsy Payment Plans',
      icon: DollarSign,
      terms: 'Available through Etsy',
      description: 'Multiple payment options available at checkout',
      benefits: [
        'Buyer protection included',
        'Secure payment processing',
        'Multiple payment methods',
      ],
    },
  ];

  const eligibility = [
    'Purchase amount between $50 - $3,000 CAD',
    'Valid Canadian credit or debit card',
    'Age 18 or older with valid ID',
    'Good payment history preferred',
    'Shipping address in Canada',
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
              Flexible Payment
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
            <span className="text-navy">Financing Options</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />

          <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
            Make your crystal jewelry more accessible with flexible payment
            options. Invest in beautiful pieces without compromising your
            budget.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Payment Options */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center">
            Payment Plans Available
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {paymentOptions.map(option => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.name}
                  className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm"
                >
                  <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                    <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                      <Icon className="h-6 w-6 text-ornate-frame-gold" />
                      <div>
                        <div className="font-bold text-lg">{option.name}</div>
                        <Badge
                          variant="secondary"
                          className="bg-troves-turquoise/20 text-navy text-xs"
                        >
                          {option.terms}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-navy/80 mb-4">{option.description}</p>
                    <ul className="space-y-2">
                      {option.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="text-navy/70 text-sm flex items-start space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <Card className="mb-12 shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <Calculator className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">How Payment Plans Work</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">1</span>
                </div>
                <h4 className="font-semibold text-navy mb-2">Select Items</h4>
                <p className="text-navy/70 text-sm">
                  Add your favorite crystal jewelry to cart
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">2</span>
                </div>
                <h4 className="font-semibold text-navy mb-2">Choose Plan</h4>
                <p className="text-navy/70 text-sm">
                  Select your preferred payment option at checkout
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">3</span>
                </div>
                <h4 className="font-semibold text-navy mb-2">Get Approved</h4>
                <p className="text-navy/70 text-sm">
                  Instant approval decision in seconds
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-troves-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-navy font-bold">4</span>
                </div>
                <h4 className="font-semibent text-navy mb-2">Enjoy Now</h4>
                <p className="text-navy/70 text-sm">
                  Receive your jewelry immediately
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility & Terms */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Shield className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">
                  Eligibility Requirements
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {eligibility.map((requirement, index) => (
                  <li
                    key={index}
                    className="text-navy/80 text-sm flex items-start space-x-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <DollarSign className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Payment Example</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-skull-turquoise/10 rounded-lg p-4 border border-ornate-frame-gold/20">
                <h4 className="font-semibold text-navy mb-3">
                  $200 Crystal Necklace
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-navy/70">Today:</span>
                    <span className="font-medium text-navy">$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy/70">Week 2:</span>
                    <span className="font-medium text-navy">$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy/70">Week 4:</span>
                    <span className="font-medium text-navy">$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy/70">Week 6:</span>
                    <span className="font-medium text-navy">$50.00</span>
                  </div>
                  <div className="border-t border-ornate-frame-gold/20 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-navy">Total:</span>
                      <span className="text-navy">$200.00</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      No interest or fees!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-troves-turquoise mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-4">
              Start Your Crystal Journey Today
            </h3>
            <p className="text-navy/80 mb-6 max-w-2xl mx-auto">
              Don't let budget constraints delay your spiritual growth. Our
              flexible payment plans make it easy to invest in authentic crystal
              jewelry that will support your healing journey for years to come.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge
                variant="outline"
                className="border-troves-turquoise text-navy"
              >
                No Hidden Fees
              </Badge>
              <Badge
                variant="outline"
                className="border-skull-turquoise text-navy"
              >
                Instant Approval
              </Badge>
              <Badge
                variant="outline"
                className="border-ornate-frame-gold text-navy"
              >
                Secure Processing
              </Badge>
            </div>
            <Button
              size="lg"
              className="bg-troves-turquoise hover:bg-troves-turquoise/90 text-white"
              onClick={() => (window.location.href = '/products')}
            >
              Shop Now with Financing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
