import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Lock, CreditCard, Truck, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// Stripe disabled for demo - graceful degradation
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) 
  : null;

const checkoutFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(6, "Valid postal code is required"),
    country: z.string().default("Canada"),
  }),
  billingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(6, "Valid postal code is required"),
    country: z.string().default("Canada"),
  }),
  sameAsShipping: z.boolean().default(true),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { items, totalAmount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      shippingAddress: {
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Canada",
      },
      billingAddress: {
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Canada",
      },
      sameAsShipping: true,
    },
  });

  const sameAsShipping = form.watch("sameAsShipping");
  const shippingAddress = form.watch("shippingAddress");

  // Auto-fill billing address when same as shipping is checked
  useEffect(() => {
    if (sameAsShipping) {
      form.setValue("billingAddress", shippingAddress);
    }
  }, [sameAsShipping, shippingAddress, form]);

  const handleSubmit = async (data: CheckoutFormData) => {
    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Payment system is not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: `${data.firstName} ${data.lastName}\n${data.shippingAddress.street}\n${data.shippingAddress.city}, ${data.shippingAddress.province} ${data.shippingAddress.postalCode}\n${data.shippingAddress.country}`,
        billingAddress: `${data.firstName} ${data.lastName}\n${data.billingAddress.street}\n${data.billingAddress.city}, ${data.billingAddress.province} ${data.billingAddress.postalCode}\n${data.billingAddress.country}`,
        status: "pending",
        currency: "CAD",
      };

      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      const order = await orderResponse.json();

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?order_id=${order.id}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred during payment processing.",
          variant: "destructive",
        });
      } else {
        clearCart();
        toast({
          title: "Order Placed Successfully!",
          description: "Thank you for your purchase. You will receive a confirmation email shortly.",
        });
        setLocation(`/order-confirmation?order_id=${order.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Order Error",
        description: error.message || "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Order Summary */}
      <div className="lg:order-2">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-navy">
              <CreditCard className="h-5 w-5" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-elegant-gold">
                    {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(totalAmount.toString())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (HST):</span>
                <span>{formatPrice((totalAmount * 0.13).toString())}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-elegant-gold">
                  {formatPrice((totalAmount * 1.13).toString())}
                </span>
              </div>
            </div>

            {/* Security Features */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>256-bit SSL encrypted checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Free shipping across Canada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Form */}
      <div className="lg:order-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(204) 555-0123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="shippingAddress.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Winnipeg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shippingAddress.province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input placeholder="MB" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="R3B 1A5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shippingAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sameAsShipping"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sameAsShipping"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                      </div>
                    </FormItem>
                  )}
                />

                {!sameAsShipping && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="billingAddress.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Winnipeg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="billingAddress.province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input placeholder="MB" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="R3B 1A5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="billingAddress.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentElement />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!stripe || isProcessing || items.length === 0}
              className="w-full h-12 bg-navy text-white hover:bg-rich-blue text-lg font-semibold"
            >
              {isProcessing ? "Processing..." : `Complete Order - ${formatPrice((totalAmount * 1.13).toString())}`}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default function Checkout() {
  const { items, totalAmount } = useCart();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      setLocation('/products');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: totalAmount * 1.13, // Include tax
          currency: 'cad'
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Payment Error",
          description: error.message || "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        setLocation('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [items.length, totalAmount, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-serif font-bold text-navy mb-4">Checkout via Etsy</h2>
            <p className="text-gray-600 mb-6">For secure payment processing, you'll be redirected to our Etsy store to complete your purchase.</p>
            <div className="space-y-4">
              <Button 
                onClick={() => window.open('https://www.etsy.com/shop/TrovesAndCoves', '_blank')}
                className="w-full bg-navy hover:bg-rich-blue text-white"
              >
                Continue to Etsy Store
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/cart')} 
                className="w-full"
              >
                Back to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-troves-turquoise mb-4">
              Secure Checkout
            </h1>
            <p className="text-xl text-foreground-muted">
              Complete your purchase with our secure payment system
            </p>
          </div>

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}
