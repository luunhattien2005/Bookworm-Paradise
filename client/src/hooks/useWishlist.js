import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as wishlistApi from '../api/wishlist';

/**
 * useWishlistQuery(userId)
 * useAddToWishlist / useRemoveFromWishlist
 */

export function useWishlistQuery(userId, options = {}) {
  return useQuery(['wishlist', userId], () => wishlistApi.getWishlist(userId), {
    enabled: !!userId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function useAddToWishlist(userId, options = {}) {
  const qc = useQueryClient();
  return useMutation(
    (bookId) => wishlistApi.addToWishlist(userId, bookId),
    {
      onSuccess() {
        qc.invalidateQueries(['wishlist', userId]);
        if (options.onSuccess) options.onSuccess();
      },
      ...options,
    }
  );
}

export function useRemoveFromWishlist(userId, options = {}) {
  const qc = useQueryClient();
  return useMutation(
    (bookId) => wishlistApi.removeFromWishlist(userId, bookId),
    {
      onSuccess() {
        qc.invalidateQueries(['wishlist', userId]);
        if (options.onSuccess) options.onSuccess();
      },
      ...options,
    }
  );
}