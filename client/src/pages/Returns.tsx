import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StepCard, ThemeCard } from '@/components/ui/themed-components';
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
} from 'lucide-react';
import {
  ContentPageWrapper,
  ContentPageHeader,
  ContentPageBody,
} from '@/components/ContentPage';

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
        'All components present and intact',
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
        'Professional cleaning included',
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
    <ContentPageWrapper>
      <ContentPageHeader
        badgeLabel="Our Promise"
        title={<span style={{ color: 'hsl(var(--text-primary))' }}>Returns & Exchanges</span>}
        description="Your satisfaction with our jewelry is paramount. We offer generous return and exchange policies to ensure you're completely happy with your purchase."
      />

      <ContentPageBody>
        {/* Return Policy */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'hsl(var(--text-primary))' }}>
            Return Policy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {returnPolicy.map(policy => {
              const Icon = policy.icon;
              return (
                <ThemeCard
                  key={policy.category}
                  title={
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6" />
                      <div>
                        <div className="font-bold text-lg">{policy.category}</div>
                        <Badge variant="turquoise" className="text-xs">
                          {policy.duration}
                        </Badge>
                      </div>
                    </div>
                  }
                >
                  <ul className="space-y-2">
                    {policy.conditions.map((condition, index) => (
                      <li
                        key={index}
                        className="text-sm flex items-start space-x-2"
                        style={{ color: 'hsl(var(--text-secondary))' }}
                      >
                        <span style={{ color: 'hsl(var(--accent-vibrant))' }}>•</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </ThemeCard>
              );
            })}
          </div>
        </div>

        {/* Return Process */}
        <Card variant="elevated" theme="gradient" className="mb-12">
          <CardHeader variant="gradient">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <RotateCcw className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">Easy Return Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <StepCard
                step={1}
                title="Contact Us"
                description="Email us within the return window with your order details"
              />
              <StepCard
                step={2}
                title="Get Authorization"
                description="Receive return authorization and prepaid shipping label"
              />
              <StepCard
                step={3}
                title="Ship Safely"
                description="Package securely and ship using our provided label"
              />
              <StepCard
                step={4}
                title="Get Refund"
                description="Receive refund within 3-5 business days of receipt"
              />
            </div>
          </CardContent>
        </Card>

        {/* What Cannot Be Returned */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card variant="elevated" theme="gradient">
            <CardHeader variant="gradient">
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
                    className="text-sm flex items-start space-x-2"
                    style={{ color: 'hsl(var(--text-secondary))' }}
                  >
                    <XCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated" theme="gradient">
            <CardHeader variant="gradient">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Clock className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Important Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3" style={{ color: 'hsl(var(--text-secondary))' }}>
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
                  <span>Professional cleaning included with all exchanges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Store credit available for future purchases</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated" theme="gradient">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: 'hsl(var(--accent-vibrant))' }} />
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'hsl(var(--text-primary))' }}>
              Our Commitment
            </h3>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'hsl(var(--text-secondary))' }}>
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
                Quality Guaranteed
              </Badge>
              <Badge
                variant="outline"
                className="border-ornate-frame-gold text-navy"
              >
                Customer Support
              </Badge>
            </div>
          </CardContent>
        </Card>
      </ContentPageBody>
    </ContentPageWrapper>
  );
}
