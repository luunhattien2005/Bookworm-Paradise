import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCart as apiGetCart } from '../../api/carts';
import { AuthContext } from '../../auth-interface/AuthContext.jsx';

// returns { data, isLoading, error } like react-query
export function useCart() {
  const auth = useContext(AuthContext);
  // try to get user id from auth context, or from localStorage fallback
  const userId = auth?.user?.id || (() => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      return u?.id || localStorage.getItem('userId') || null;
    } catch {
      return localStorage.getItem('userId') || null;
    }
  })();

  return useQuery(['cart', userId], () => apiGetCart(userId), {
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}