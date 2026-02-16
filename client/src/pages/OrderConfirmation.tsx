import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { CheckCircle, Package, ShoppingBag, Mail } from "lucide-react";

type Order = {
  id: number;
  customerEmail: string;
  status: string;
  totalAmount: string;
  shippingAddress: string;
  billingAddress: string;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    price: string;
    product: {
      id: number;
      name: string;
      imageUrl: string;
    };
  }>;
};

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      setLocation("/products");
      return;
    }

    fetchOrder(parseInt(orderId));
  }, [setLocation]);

  const fetchOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      const orderData = await response.json();
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      setLocation("/products");
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4" />
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-navy mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase. Your order #{order.id} has been received.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-lg font-semibold text-navy">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-lg font-semibold text-navy">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-elegant-gold">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                <p className="text-sm whitespace-pre-line">{order.shippingAddress}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Email Confirmation</p>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{order.customerEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Items Ordered</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-elegant-gold">
                        {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-navy">What's Next?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Order confirmation sent to {order.customerEmail}</p>
                  <p>✓ Processing your items (1-2 business days)</p>
                  <p>✓ Shipping notification with tracking number</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setLocation("/products")}
              className="flex-1 bg-navy text-white hover:bg-rich-blue"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://www.etsy.com/shop/TrovesAndCoves', '_blank')}
              className="flex-1"
            >
              Visit Our Etsy Store
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
