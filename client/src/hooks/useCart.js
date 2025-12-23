import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCart as apiGetCart } from '../api/cart';
import { AuthContext } from '../auth-interface/AuthContext.jsx';

// returns { data, isLoading, error } like react-query
/**
 * Helper: resolve userId from AuthContext or localStorage
 */
function useUserId() {
  const auth = useContext(AuthContext);

  return useMemo(() => {
    if (auth?.user?.id) return auth.user.id;

    try {
      const u = JSON.parse(localStorage.getItem('user'));
      return u?.id || localStorage.getItem('userId') || null;
    } catch {
      return localStorage.getItem('userId') || null;
    }
  }, [auth]);
}

/**
 * Get cart
 */
export function useCart(options = {}) {
  const userId = useUserId();

  return useQuery({
    queryKey: ['cart', userId],
    queryFn: () => cartApi.getCart(userId),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

/**
 * Add item to cart
 */
export function useAddToCart(options = {}) {
  const qc = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: ({ bookId, quantity = 1 }) =>
      cartApi.addToCart(userId, { bookId, quantity }),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart', userId] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}

/**
 * Update cart item quantity
 */
export function useUpdateCartItem(options = {}) {
  const qc = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: ({ bookId, quantity }) =>
      cartApi.updateCartItem(userId, { bookId, quantity }),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart', userId] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}

/**
 * Remove item from cart
 */
export function useRemoveFromCart(options = {}) {
  const qc = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: (bookId) =>
      cartApi.removeFromCart(userId, bookId),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart', userId] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}

/**
 * Clear entire cart
 */
export function useClearCart(options = {}) {
  const qc = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: () =>
      cartApi.clearCart(userId),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['cart', userId] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}