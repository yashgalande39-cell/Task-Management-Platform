import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectAPI } from '../lib/api';
import { toast } from '../lib/toast';

// ── Query Keys ───────────────────────────────────────────────────────
export const QUERY_KEYS = {
  projects: ['projects'],
  project: (id) => ['projects', id],
  tasks: (params) => ['tasks', params],
  task: (id) => ['tasks', id],
  users: ['users'],
  analytics: ['analytics'],
};

// ── Projects ─────────────────────────────────────────────────────────
export const useProjects = () =>
  useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: () => projectAPI.getAll().then((r) => r.data),
    staleTime: 30_000,
    retry: 2,
  });

export const useProject = (id) =>
  useQuery({
    queryKey: QUERY_KEYS.project(id),
    queryFn: () => projectAPI.getById(id).then((r) => r.data),
    enabled: !!id,
    staleTime: 30_000,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectAPI.create(data).then((r) => r.data),
    onSuccess: (newProject) => {
      qc.setQueryData(QUERY_KEYS.projects, (old = []) => [newProject, ...old]);
      toast.success('Project created!');
    },
    onError: (err) => toast.error(err?.message || 'Failed to create project'),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => projectAPI.update(id, data).then((r) => r.data),
    onSuccess: (updated) => {
      qc.setQueryData(QUERY_KEYS.projects, (old = []) =>
        old.map((p) => (p._id === updated._id ? { ...p, ...updated } : p))
      );
      qc.invalidateQueries({ queryKey: QUERY_KEYS.project(updated._id) });
    },
    onError: (err) => toast.error(err?.message || 'Failed to update project'),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectAPI.delete(id),
    onSuccess: (_, id) => {
      qc.setQueryData(QUERY_KEYS.projects, (old = []) => old.filter((p) => p._id !== id));
      toast.success('Project deleted');
    },
    onError: (err) => toast.error(err?.message || 'Failed to delete project'),
  });
};
