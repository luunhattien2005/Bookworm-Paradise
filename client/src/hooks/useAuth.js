import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as accountsApi from '../api/account';


/**
 * useLogin / useRegister / useMe
 * - Caller is responsible for persisting token (localStorage / AuthContext).
 */



export function useLogin(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => accountsApi.loginAccount(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['me'] });
      if (options.onSuccess) options.onSuccess(data);
    },
    ...options,
  });
}

export function useRegister(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => accountsApi.registerAccount(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['me'] });
      if (options.onSuccess) options.onSuccess(data);
    },
    ...options,
  });
}

// token: pass token string via parameter
export function useMe(token, options = {}) {
  return useQuery({
    queryKey: ['me', token],
    queryFn: () => accountsApi.getMe(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

// Hook cập nhật thông tin user
export function useUpdateUser(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData) => accountsApi.updateProfile(formData),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['me'] });
      if (options.onSuccess) options.onSuccess(data);
    },
    ...options,
  });
}