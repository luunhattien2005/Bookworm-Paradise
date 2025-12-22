import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../../api/reviews';

/**
 * useReviewsQuery(bookId)
 * useAddReview / useDeleteReview
 */

export function useReviewsQuery(bookId, options = {}) {
  return useQuery(['reviews', bookId], () => reviewsApi.getReviewsForBook(bookId), {
    enabled: !!bookId,
    staleTime: 1000 * 30,
    ...options,
  });
}

export function useAddReview(options = {}) {
  const qc = useQueryClient();
  return useMutation(
    (payload) => reviewsApi.addReview(payload),
    {
      onSuccess(data, variables) {
        const bookId = variables?.bookId || (data && data.book);
        if (bookId) qc.invalidateQueries(['reviews', bookId]);
        if (options.onSuccess) options.onSuccess(data);
      },
      ...options,
    }
  );
}

export function useDeleteReview(options = {}) {
  const qc = useQueryClient();
  return useMutation(
    ({ reviewId, bookId }) => reviewsApi.deleteReview(reviewId, options.token),
    {
      onSuccess(_, variables) {
        const bookId = variables?.bookId;
        if (bookId) qc.invalidateQueries(['reviews', bookId]);
        if (options.onSuccess) options.onSuccess();
      },
      ...options,
    }
  );
}