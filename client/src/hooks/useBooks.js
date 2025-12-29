import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as booksApi from '../api/book';

export function useTags(options = {}) {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => booksApi.getAllTags(),
    staleTime: 1000 * 60 * 60, // Cache 1 tiếng
    ...options,
  })
}

export function useSearchBooks(q, params = {}, options = {}) {
  return useQuery({
    queryKey: ['books', { q, ...params }],
    queryFn: () => booksApi.searchBooks(q, params),
    enabled: true,
    keepPreviousData: true,
    ...options,
  });
}

export function useBook(id) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getBook(id),
    enabled: !!id,
  });
}

export function useGetBookBySlug(slug) {
  return useQuery({
    queryKey: ['book', 'slug', slug],
    queryFn: () => booksApi.getBookBySlug(slug),
    enabled: !!slug,
  });
}

export function useTopRatedBooks() {
  return useQuery({
    queryKey: ['books', 'top-rated'],
    queryFn: booksApi.getTopRated,
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: ['books', 'best-sellers'],
    queryFn: booksApi.getBestSellers,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSeasonalBooks(tag = "SEASON") {
  return useQuery({
    queryKey: ['books', 'seasonal', tag],
    queryFn: () => booksApi.getSeasonal(tag),
    staleTime: 1000 * 60 * 10,
  });
}

export function useAdminCreateBook(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => booksApi.createBook(data),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useAdminUpdateBook(id, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => booksApi.updateBook(id, data),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['book', id] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useAdminDeleteBook(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => booksApi.deleteBook(id),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['books'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}