import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StepCard } from '@/components/ui/themed-components';
import SectionPill from '@/components/SectionPill';
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
    <div className="min-h-screen" style={{ background: 'hsl(var(--bg-primary))' }}>
      {/* Header */}
      <section className="relative overflow-hidden py-20"
                style={{ background: 'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-1"
             style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />
        <div className="relative chamber-container text-center">
          <SectionPill variant="gold" className="mb-8">
            Flexible Payment
          </SectionPill>

          <h1 className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: 'hsl(var(--text-primary))' }}>
            Financing Options
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 rounded-full"
               style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />

          <p className="text-xl max-w-3xl mx-auto leading-relaxed"
             style={{ color: 'hsl(var(--text-secondary))' }}>
            Make your crystal jewelry more accessible with flexible payment
            options. Invest in beautiful pieces without compromising your
            budget.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Payment Options */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'hsl(var(--text-primary))' }}>
            Payment Plans Available
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {paymentOptions.map(option => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.name}
                  variant="elevated"
                  theme="gradient"
                >
                  <CardHeader variant="gradient">
                    <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                      <Icon className="h-6 w-6 text-ornate-frame-gold" />
                      <div>
                        <div className="font-bold text-lg">{option.name}</div>
                        <Badge
                          variant="secondary"
                          className="bg-troves-turquoise/20 text-primary text-xs"
                        >
                          {option.terms}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="mb-4" style={{ color: 'hsl(var(--text-secondary))' }}>{option.description}</p>
                    <ul className="space-y-2">
                      {option.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start space-x-2"
                          style={{ color: 'hsl(var(--text-secondary))' }}
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
        <Card variant="elevated" theme="gradient" className="mb-12">
          <CardHeader variant="gradient">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <Calculator className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">How Payment Plans Work</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <StepCard
                step={1}
                title="Select Items"
                description="Add your favorite crystal jewelry to cart"
              />
              <StepCard
                step={2}
                title="Choose Plan"
                description="Select your preferred payment option at checkout"
              />
              <StepCard
                step={3}
                title="Get Approved"
                description="Instant approval decision in seconds"
              />
              <StepCard
                step={4}
                title="Enjoy Now"
                description="Receive your jewelry immediately"
              />
            </div>
          </CardContent>
        </Card>

        {/* Eligibility & Terms */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card variant="elevated" theme="gradient">
            <CardHeader variant="gradient">
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
                    className="text-sm flex items-start space-x-2"
                    style={{ color: 'hsl(var(--text-secondary))' }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated" theme="gradient">
            <CardHeader variant="gradient">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <DollarSign className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Payment Example</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-skull-turquoise/10 rounded-lg p-4 border border-ornate-frame-gold/20">
                <h4 className="font-semibold mb-3" style={{ color: 'hsl(var(--text-primary))' }}>
                  $200 Crystal Necklace
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'hsl(var(--text-secondary))' }}>Today:</span>
                    <span className="font-medium" style={{ color: 'hsl(var(--text-primary))' }}>$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'hsl(var(--text-secondary))' }}>Week 2:</span>
                    <span className="font-medium" style={{ color: 'hsl(var(--text-primary))' }}>$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'hsl(var(--text-secondary))' }}>Week 4:</span>
                    <span className="font-medium" style={{ color: 'hsl(var(--text-primary))' }}>$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'hsl(var(--text-secondary))' }}>Week 6:</span>
                    <span className="font-medium" style={{ color: 'hsl(var(--text-primary))' }}>$50.00</span>
                  </div>
                  <div className="border-t border-ornate-frame-gold/20 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-primary">Total:</span>
                      <span className="text-primary">$200.00</span>
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
        <Card variant="elevated" theme="gradient">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-troves-turquoise mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(var(--text-primary))' }}>
              Start Your Crystal Journey Today
            </h3>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'hsl(var(--text-secondary))' }}>
              Don't let budget constraints delay your jewelry journey. Our
              flexible payment plans make it easy to invest in authentic crystal
              jewelry that will support your collection for years to come.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge
                variant="outline"
                className="border-troves-turquoise text-primary"
              >
                No Hidden Fees
              </Badge>
              <Badge
                variant="outline"
                className="border-skull-turquoise text-primary"
              >
                Instant Approval
              </Badge>
              <Badge
                variant="outline"
                className="border-ornate-frame-gold text-primary"
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
