import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../lib/api';
import { QUERY_KEYS } from './useProjects';
import useAuthStore from '../store/useAuthStore';
import { toast } from '../lib/toast';

export const useUsers = () =>
  useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => userAPI.getAll().then((r) => r.data),
    staleTime: 60_000,
  });

export const useAnalytics = () =>
  useQuery({
    queryKey: QUERY_KEYS.analytics,
    queryFn: () => userAPI.getAnalytics().then((r) => r.data),
    staleTime: 60_000,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { updateUser } = useAuthStore();
  return useMutation({
    mutationFn: (data) => userAPI.updateProfile(data).then((r) => r.data),
    onSuccess: (updated) => {
      updateUser(updated); // sync to auth store/localStorage
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users });
      toast.success('Profile saved!');
    },
    onError: (err) => toast.error(err?.message || 'Failed to update profile'),
  });
};
