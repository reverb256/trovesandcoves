import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useLocation } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CartDrawer() {
  const { 
    isOpen, 
    toggleCart, 
    items, 
    updateQuantity, 
    removeFromCart, 
    totalAmount, 
    itemCount 
  } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    toggleCart();
    setLocation('/checkout');
  };

  const handleRemoveItem = (itemId: number, productName: string) => {
    removeFromCart(itemId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md bg-white">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center space-x-2 text-navy">
            <ShoppingBag className="h-5 w-5" />
            <span>Shopping Cart</span>
            {itemCount > 0 && (
              <Badge variant="secondary" className="bg-elegant-gold text-navy">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Discover our beautiful jewelry collections</p>
            <Button 
              onClick={() => {
                toggleCart();
                setLocation('/products');
              }}
              className="bg-elegant-gold hover:bg-yellow-400 text-navy"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-navy text-sm line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.product.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id, item.product.name)}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm font-semibold text-elegant-gold">
                      {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />
            
            {/* Cart Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-navy">Total:</span>
                <span className="text-xl font-bold text-elegant-gold">
                  {formatPrice(totalAmount.toString())}
                </span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full bg-navy text-white py-3 font-semibold hover:bg-rich-blue transition-colors"
              >
                Secure Checkout
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  toggleCart();
                  setLocation('/products');
                }}
                className="w-full border-navy text-navy hover:bg-navy hover:text-white"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
