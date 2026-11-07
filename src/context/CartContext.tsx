import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, OrderType } from '../types';

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalPence: number;
  discountPence: number;
  deliveryFeePence: number;
  totalPence: number;
  subtotalFormatted: string;
  discountFormatted: string;
  deliveryFeeFormatted: string;
  totalFormatted: string;
  isDeliveryAvailable: boolean;
  setIsDeliveryAvailable: (avail: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'rashoi_cart_v1';
const ORDER_TYPE_KEY = 'rashoi_order_type_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>(() => {
    try {
      const saved = localStorage.getItem(ORDER_TYPE_KEY);
      return saved === 'delivery' ? 'delivery' : 'collection';
    } catch {
      return 'collection';
    }
  });

  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_TYPE_KEY, orderType);
    } catch (e) {
      console.warn('Failed to save order type to localStorage', e);
    }
  }, [orderType]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      // Create unique ID based on menuItemId and variant name
      const id = `${newItem.menuItemId}_${newItem.variantName || 'standard'}`;
      const existingIndex = prev.findIndex((i) => i.id === id);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
          specialInstructions: newItem.specialInstructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      } else {
        return [...prev, { ...newItem, id }];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal in integer pence
  const subtotalPence = items.reduce((sum, item) => {
    const itemPence = Math.round(item.price * 100);
    return sum + itemPence * item.quantity;
  }, 0);

  // 10% collection discount on collection orders only
  const discountPence = orderType === 'collection' && subtotalPence > 0
    ? Math.round(subtotalPence * 0.10)
    : 0;

  // Delivery fee in pence (e.g. £3.50) if delivery order
  const deliveryFeePence = orderType === 'delivery' && isDeliveryAvailable ? 350 : 0;

  // Final total in pence
  const totalPence = Math.max(0, subtotalPence - discountPence + deliveryFeePence);

  const formatPence = (pence: number): string => `£${(pence / 100).toFixed(2)}`;

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        setOrderType,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotalPence,
        discountPence,
        deliveryFeePence,
        totalPence,
        subtotalFormatted: formatPence(subtotalPence),
        discountFormatted: formatPence(discountPence),
        deliveryFeeFormatted: formatPence(deliveryFeePence),
        totalFormatted: formatPence(totalPence),
        isDeliveryAvailable,
        setIsDeliveryAvailable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
