import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../api/review';

/**
 * Hook lấy review vô tận (Infinite Scroll)
 */
export function useReviews(bookId, limit = 5) {
  return useInfiniteQuery({
    queryKey: ['reviews', bookId],
    queryFn: ({ pageParam = null }) => 
      reviewsApi.getReviewsForBook({ bookId, limit, pageParam }),
    
    // Xác định trang tiếp theo dựa trên cursor backend trả về
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.hasMore) {
        return lastPage.nextCursor;
      }
      return undefined;
    },
    enabled: !!bookId,
    staleTime: 1000 * 60, // 1 phút
  });
}

/**
 * Hook thêm review
 */
export function useAddReview(bookId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => reviewsApi.addReview({ ...payload, bookId }),
    onSuccess: () => {
      // Refresh lại list review sau khi add xong
      qc.invalidateQueries({ queryKey: ['reviews', bookId] });
    },
  });
}

/**
 * Hook xóa review
 */
export function useDeleteReview() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      // Xóa xong thì refresh lại toàn bộ review
      qc.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}