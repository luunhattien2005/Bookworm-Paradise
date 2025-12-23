import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../api/review';

/**
 * useReviewsQuery(bookId)
 * useAddReview / useDeleteReview
 */

export function useReviews(bookId, options = {}) {
  return useQuery({
    queryKey: ['reviews', bookId],
    queryFn: () => reviewsApi.getReviewsForBook(bookId),
    enabled: !!bookId,
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}

/**
 * Add a review
 */
export function useAddReview(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      reviewsApi.addReview(payload),

    onSuccess: (data, variables) => {
      const bookId = variables?.bookId ?? data?.book;
      if (bookId) {
        qc.invalidateQueries({ queryKey: ['reviews', bookId] });
      }
      options.onSuccess?.(data);
    },

    ...options,
  });
}

/**
 * Delete a review (admin or owner)
 */
export function useDeleteReview(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }) =>
      reviewsApi.deleteReview(reviewId, options.token),

    onSuccess: (_data, variables) => {
      const bookId = variables?.bookId;
      if (bookId) {
        qc.invalidateQueries({ queryKey: ['reviews', bookId] });
      }
      options.onSuccess?.();
    },

    ...options,
  });
}