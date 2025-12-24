import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as accountsApi from '../api/account';

/**
 * useLogin / useRegister / useMe
 * - Caller is responsible for persisting token (localStorage / AuthContext).
 */



export function useLogin(options = {}) {
  const qc = useQueryClient();
  return useMutation((payload) => accountsApi.loginAccount(payload), {
    onSuccess(data) {
      qc.invalidateQueries(['me']);
      if (options.onSuccess) options.onSuccess(data);
    },
    ...options,
  });
}

export function useRegister(options = {}) {
  const qc = useQueryClient();
  return useMutation((payload) => accountsApi.registerAccount(payload), {
    onSuccess(data) {
      qc.invalidateQueries(['me']);
      if (options.onSuccess) options.onSuccess(data);
    },
    ...options,
  });
}

// token: pass token string via parameter
export function useMe(token, options = {}) {
  return useQuery(
    ['me', token],
    () => accountsApi.getMe(token),
    {
      enabled: !!token,
      staleTime: 1000 * 60 * 5,
      ...options,
    }
  );
}