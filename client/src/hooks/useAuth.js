import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as accountsApi from '../api/account';

// Hook đăng nhập
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

// Hook đăng ký
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

// Hook lấy thông tin user hiện tại
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

// Hook lấy tất cả tài khoản (Admin)
export function useAllAccounts(options = {}) {
    return useQuery({
        queryKey: ['admin', 'accounts'],
        queryFn: accountsApi.getAllAccounts,
        ...options
    });
}

// Hook Ban/Unban tài khoản (Admin)
export function useBanAccount(options = {}) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => accountsApi.banAccount(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'accounts'] });
        },
        ...options
    });
}