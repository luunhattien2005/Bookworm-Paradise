import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as wishlistApi from '../api/wishlist';

/**
 * Get wishlist for a user
 */
export function useWishlist(userId, options = {}) {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => wishlistApi.getWishlist(userId),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

/**
 * Add book to wishlist
 */
export function useAddToWishlist(userId, options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookId) =>
      wishlistApi.addToWishlist(userId, bookId),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['wishlist', userId] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}

/**
 * Remove book from wishlist
 */
export function useRemoveFromWishlist(userId, options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookId) =>
      wishlistApi.removeFromWishlist(userId, bookId),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['wishlist', userId] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}