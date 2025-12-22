import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as booksApi from '../../api/books';

/**
 * useSearchBooks, useInfiniteBooks, useGetBook
 * Admin mutations: create/update/delete (pass token via options.token)
 */

export function useSearchBooks(q, params = {}, options = {}) {
  return useQuery(
    ['books', { q, ...params }],
    () => booksApi.searchBooks(q, params),
    {
      enabled: !!q,
      keepPreviousData: true,
      staleTime: 1000 * 60,
      ...options,
    }
  );
}

export function useInfiniteBooks(q, { limit = 20 } = {}, options = {}) {
  return useInfiniteQuery(
    ['books', 'infinite', q],
    ({ pageParam = 1 }) => booksApi.searchBooks(q, { limit, page: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        // lastPage expected shape returned by API (data, total)
        // simple heuristic: if less than limit returned -> no next
        const items = lastPage?.data?.docs || lastPage?.data || [];
        if (items.length < limit) return undefined;
        return pages.length + 1;
      },
      enabled: !!q,
      staleTime: 1000 * 30,
      ...options,
    }
  );
}

export function useGetBook(id, options = {}) {
  return useQuery(['book', id], () => booksApi.getBook(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

// Admin mutations
export function useAdminCreateBook(options = {}) {
  const qc = useQueryClient();
  return useMutation((formData) => booksApi.createBook(formData, options.token), {
    onSuccess() {
      qc.invalidateQueries(['books']);
      if (options.onSuccess) options.onSuccess();
    },
    ...options,
  });
}

export function useAdminUpdateBook(id, options = {}) {
  const qc = useQueryClient();
  return useMutation((formData) => booksApi.updateBook(id, formData, options.token), {
    onSuccess() {
      qc.invalidateQueries(['books']);
      qc.invalidateQueries(['book', id]);
      if (options.onSuccess) options.onSuccess();
    },
    ...options,
  });
}

export function useAdminDeleteBook(options = {}) {
  const qc = useQueryClient();
  return useMutation((id) => booksApi.deleteBook(id, options.token), {
    onSuccess() {
      qc.invalidateQueries(['books']);
      if (options.onSuccess) options.onSuccess();
    },
    ...options,
  });
}