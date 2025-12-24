import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cartApi from '../api/cart.js';

/**
 * Get current user's cart
 */
export function useCart(options = {}) {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

/**
 * Add item to cart
 */
export function useAddToCart(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      options.onSuccess?.(...args);
    },
  });
}

/**
 * Update cart item quantity
 */
export function useUpdateCartItem(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartApi.updateCartItem,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      options.onSuccess?.(...args);
    },
  });
}

/**
 * Remove item from cart
 */
export function useRemoveFromCart(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      options.onSuccess?.(...args);
    },
  });
}

/**
 * Clear entire cart
 */
export function useClearCart(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      options.onSuccess?.(...args);
    },
  });
}