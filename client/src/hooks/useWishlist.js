import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as wishlistApi from '../api/wishlist';

/**
 * Lấy danh sách yêu thích
 */
export function useWishlist(options = {}) {
  return useQuery({
    queryKey: ['wishlist'], 
    queryFn: () => wishlistApi.getWishlist(),
    staleTime: 1000 * 60, 
    ...options,
  });
}

/**
 * Thêm vào yêu thích
 */
export function useAddToWishlist(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => wishlistApi.addToWishlist(bookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
    },
    ...options,
  });
}

/**
 * Xóa khỏi yêu thích
 */
export function useRemoveFromWishlist(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => wishlistApi.removeFromWishlist(bookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
    },
    ...options,
  });
}