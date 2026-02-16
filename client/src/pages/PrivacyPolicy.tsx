import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-warm via-pearl-cream to-moonstone">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-pearl-cream via-crystal-accents to-pearl-cream text-navy overflow-hidden py-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skull-turquoise to-transparent" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-block px-6 py-2 border border-ornate-frame-gold/20 rounded-lg bg-ornate-frame-gold/5 backdrop-blur-sm mb-6">
            <span className="text-ornate-frame-gold/80 text-sm font-medium tracking-wider uppercase">
              Data Protection
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
            <span className="text-navy">Privacy Policy</span>
          </h1>

          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />

          <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
            Your privacy matters to us. We are committed to protecting your
            personal information with the same care we give to our crystal
            jewelry.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information Collection */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Database className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">
                  Information We Collect
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-navy mb-2">
                    Personal Information
                  </h4>
                  <ul className="text-navy/80 text-sm space-y-1 ml-4">
                    <li>• Name, email address, and phone number</li>
                    <li>• Shipping and billing addresses</li>
                    <li>
                      • Payment information (processed securely through Etsy)
                    </li>
                    <li>• Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">
                    Website Usage
                  </h4>
                  <ul className="text-navy/80 text-sm space-y-1 ml-4">
                    <li>• Pages visited and time spent on site</li>
                    <li>• Browser type and device information</li>
                    <li>• IP address and location data</li>
                    <li>• Cookies and similar technologies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Eye className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">
                  How We Use Your Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="text-navy/80 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Process and fulfill your jewelry orders</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Provide customer service and support</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Send order updates and shipping notifications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Improve our website and shopping experience</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Send marketing emails (with your consent)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Lock className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">
                  Data Protection & Security
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="text-navy/80 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>SSL encryption for all data transmission</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Secure servers hosted in Canada</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Limited access to personal information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Compliance with Canadian privacy laws (PIPEDA)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Globe className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Information Sharing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-navy/80 mb-4">
                We never sell your personal information. We may share
                information only in these limited circumstances:
              </p>
              <ul className="text-navy/80 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>With Etsy for order processing and payment</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>With shipping carriers for delivery</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>
                    With service providers under strict confidentiality
                    agreements
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>When required by law or to protect our rights</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Shield className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Your Privacy Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-navy/80 mb-4">
                Under Canadian privacy law, you have the right to:
              </p>
              <ul className="text-navy/80 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Access your personal information we hold</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Request correction of inaccurate information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>Withdraw consent for marketing communications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>
                    Request deletion of your information (subject to legal
                    requirements)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-troves-turquoise mt-1">•</span>
                  <span>
                    File a complaint with the Privacy Commissioner of Canada
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Database className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Cookies & Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-navy/80 mb-4">
                We use cookies to enhance your browsing experience:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-navy mb-2">
                    Essential Cookies
                  </h4>
                  <ul className="text-navy/70 text-sm space-y-1">
                    <li>• Shopping cart functionality</li>
                    <li>• User authentication</li>
                    <li>• Security features</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">
                    Analytics Cookies
                  </h4>
                  <ul className="text-navy/70 text-sm space-y-1">
                    <li>• Website performance</li>
                    <li>• User behavior insights</li>
                    <li>• Site improvement data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Mail className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Contact Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-navy/80 mb-4">
                If you have questions about this privacy policy or wish to
                exercise your privacy rights, please contact us:
              </p>
              <div className="space-y-2 text-navy/80">
                <p>
                  <strong>Email:</strong> privacy@trovesandcoves.ca
                </p>
                <p>
                  <strong>Mail:</strong> Troves & Coves Privacy Officer,
                  Winnipeg, MB, Canada
                </p>
                <p>
                  <strong>Response Time:</strong> We will respond within 30 days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <div className="text-center py-8">
            <p className="text-navy/70 text-sm">
              Last updated: January 2025
              <br />
              We may update this privacy policy from time to time. Changes will
              be posted on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
