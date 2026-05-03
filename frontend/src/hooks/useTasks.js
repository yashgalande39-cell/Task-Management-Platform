import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../lib/api';
import { QUERY_KEYS } from './useProjects';
import { toast } from '../lib/toast';

export const useTasks = (params = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.tasks(params),
    queryFn: () => taskAPI.getAll(params).then((r) => r.data),
    staleTime: 20_000,
    retry: 2,
  });

export const useTask = (id) =>
  useQuery({
    queryKey: QUERY_KEYS.task(id),
    queryFn: () => taskAPI.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => taskAPI.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      toast.success('Task created!');
    },
    onError: (err) => toast.error(err?.message || 'Failed to create task'),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => taskAPI.update(id, data).then((r) => r.data),
    onMutate: async ({ id, ...updates }) => {
      // Optimistic update for Kanban drag
      await qc.cancelQueries({ queryKey: ['tasks'] });
      const snapshot = qc.getQueriesData({ queryKey: ['tasks'] });
      qc.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((t) => (t._id === id ? { ...t, ...updates } : t));
      });
      return { snapshot };
    },
    onError: (err, _, ctx) => {
      if (ctx?.snapshot) {
        ctx.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      toast.error(err?.message || 'Failed to update task');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    },
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => taskAPI.delete(id),
    onSuccess: (_, id) => {
      qc.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((t) => t._id !== id);
      });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      toast.success('Task deleted');
    },
    onError: (err) => toast.error(err?.message || 'Failed to delete task'),
  });
};

export const useAddComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, text }) => taskAPI.addComment(taskId, text).then((r) => r.data),
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.task(taskId) });
      toast.success('Comment added');
    },
  });
};
