import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItemWithProduct } from "@shared/schema";

interface CartState {
  isOpen: boolean;
  items: CartItemWithProduct[];
  isLoading: boolean;
}

type CartAction = 
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_ITEMS'; payload: CartItemWithProduct[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: CartState = {
  isOpen: false,
  items: [],
  isLoading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  itemCount: number;
  totalAmount: number;
  refetch: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading, refetch } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
    staleTime: 0, // Always fresh
  });

  // Update state when cart items change - with proper comparison
  useEffect(() => {
    if (JSON.stringify(cartItems) !== JSON.stringify(state.items)) {
      dispatch({ type: 'SET_ITEMS', payload: cartItems });
    }
  }, [cartItems, state.items]);

  useEffect(() => {
    if (isLoading !== state.isLoading) {
      dispatch({ type: 'SET_LOADING', payload: isLoading });
    }
  }, [isLoading, state.isLoading]);

  // Calculate totals
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = state.items.reduce(
    (total, item) => total + (parseFloat(item.product.price) * item.quantity),
    0
  );

  const contextValue: CartContextType = {
    state,
    dispatch,
    itemCount,
    totalAmount,
    refetch,
  };

  return React.createElement(CartContext.Provider, { value: contextValue }, children);
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
