import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Home, Search } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-warm via-pearl-cream to-moonstone flex items-center justify-center px-4">
      {/* Mystical 404 Card */}
      <Card className="w-full max-w-lg shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Mystical Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-skull-turquoise/20 to-troves-turquoise/20 flex items-center justify-center border border-ornate-frame-gold/20">
              <Compass className="h-10 w-10 text-troves-turquoise" />
            </div>
          </div>

          {/* Ornate Decorative Frame */}
          <div className="mb-4">
            <div className="inline-block px-4 py-2 border border-ornate-frame-gold/20 rounded-lg bg-ornate-frame-gold/5">
              <span className="text-ornate-frame-gold text-sm font-medium tracking-wider uppercase">
                Path Not Found
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-troves-turquoise mb-4 font-brand-heading">
            Lost in the Crystal Realm
          </h1>

          <div className="w-16 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-ornate-frame-gold to-transparent rounded-full" />

          <p className="text-coves-cursive-blue/80 text-lg mb-8 leading-relaxed">
            The path you seek has not been found in our collection. Let us guide
            you back to the treasures that await.
          </p>

          {/* Navigation Options */}
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-troves-turquoise to-skull-turquoise hover:from-skull-turquoise hover:to-troves-turquoise text-crystal-accents font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="h-5 w-5 mr-2" />
                Return to the Shop
              </Button>
            </Link>

            <Link href="/products">
              <Button
                variant="outline"
                className="w-full border-2 border-ornate-frame-gold/30 text-troves-turquoise hover:bg-ornate-frame-gold/10 py-3 rounded-lg transition-all duration-300"
              >
                <Search className="h-5 w-5 mr-2" />
                Explore Crystal Collections
              </Button>
            </Link>
          </div>

          {/* Mystical Underglow Effect */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-skull-turquoise/20 blur-xl rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
}
