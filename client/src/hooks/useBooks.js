import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as booksApi from '../api/book';

/**
 * Search books
 */

export function useSearchBooks(q, params = {}, options = {}) {
  return useQuery({
    queryKey: ['books', { q, ...params }],
    queryFn: () => booksApi.searchBooks(q, params),
    enabled: true,
    keepPreviousData: true,
    staleTime: 1000 * 60,
    ...options,
  });
}

/**
 * Infinite books
 */
export function useInfiniteBooks(q, { limit = 20 } = {}, options = {}) {
  return useInfiniteQuery({
    queryKey: ['books', 'infinite', q],
    queryFn: ({ pageParam = 1 }) =>
      booksApi.searchBooks(q, { limit, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const items = lastPage?.data?.docs || lastPage?.data || [];
      if (items.length < limit) return undefined;
      return pages.length + 1;
    },
    enabled: !!q,
    staleTime: 1000 * 30,
    ...options,
  });
}

/**
 * Get book by slug (already correct, unchanged)
 */
export function useGetBookBySlug(slug, options = {}) {
  return useQuery({
    queryKey: ['book', slug],
    queryFn: () => booksApi.getBookBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/**
 * Get book by id
 */
export function useGetBook(id, options = {}) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getBook(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/**
 * Admin: create book
 */
export function useAdminCreateBook(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      booksApi.createBook(formData, options.token),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Admin: update book
 */
export function useAdminUpdateBook(id, options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      booksApi.updateBook(id, formData, options.token),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['book', id] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Admin: delete book
 */
export function useAdminDeleteBook(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      booksApi.deleteBook(id, options.token),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}