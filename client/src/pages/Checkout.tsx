import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ExternalLink, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/SchemaOrg";
import EmptyState from "@/components/EmptyState";

const ETSY_SHOP_URL = "https://www.etsy.com/shop/TrovesAndCoves";

export default function Checkout() {
  const { items, totalAmount } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      setLocation('/products');
    }
  }, [items.length, setLocation, toast]);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleEtsyCheckout = () => {
    window.open(ETSY_SHOP_URL, '_blank');
    toast({
      title: "Opening Etsy Store",
      description: "You can complete your purchase on our Etsy store.",
    });
  };

  return (
    <>
      <SEOHead
        title="Checkout | Complete Your Crystal Jewelry Purchase | Troves & Coves"
        description="Complete your purchase on our secure Etsy store. Handcrafted crystal jewelry with 14k gold-plated elegance."
        url="https://trovesandcoves.ca/checkout"
        type="website"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Checkout', path: '/checkout' }
        ]}
      />
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Checkout
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete your purchase on our secure Etsy store
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  {items.length === 0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="Your cart is empty"
                      description="Add items to your cart before checking out"
                      variant="cart"
                      action={{ label: "Browse Products", href: "/products" }}
                      className="py-8"
                    />
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium line-clamp-1">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <span className="font-semibold">
                            {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Why Etsy Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Why purchase on Etsy?
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Secure payment processing via Etsy</li>
                    <li>• Buyer protection guarantee</li>
                    <li>• Multiple payment options (credit card, PayPal, etc.)</li>
                    <li>• Order tracking and shipping updates</li>
                    <li>• Easy returns and exchanges</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Total & Checkout */}
            <div className="md:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Total</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(totalAmount.toString())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span className="text-green-600">Calculated on Etsy</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">
                          {formatPrice(totalAmount.toString())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleEtsyCheckout}
                    disabled={items.length === 0}
                    className="w-full mb-3"
                    size="lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Continue to Etsy
                  </Button>

                  <Button
                    onClick={() => setLocation('/products')}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You'll be redirected to Etsy to complete your purchase securely.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
