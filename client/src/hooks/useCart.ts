import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCartContext } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  const { state, dispatch, itemCount, totalAmount, refetch } = useCartContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${itemId}`, {
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item quantity",
        variant: "destructive",
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  return {
    // State
    isOpen: state.isOpen,
    items: state.items,
    isLoading: state.isLoading,
    itemCount,
    totalAmount,

    // Actions
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),

    // Mutations
    addToCart: (productId: number, quantity: number = 1) => {
      addToCartMutation.mutate({ productId, quantity });
    },
    updateQuantity: (itemId: number, quantity: number) => {
      updateQuantityMutation.mutate({ itemId, quantity });
    },
    removeFromCart: (itemId: number) => {
      removeFromCartMutation.mutate(itemId);
    },
    clearCart: () => {
      clearCartMutation.mutate();
    },

    // Mutation states
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,

    // Refetch
    refetch,
  };
}
