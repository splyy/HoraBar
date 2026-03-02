import { useCallback, useEffect, useState } from 'react';
import type { Project, ProjectInput } from '../../shared/types';

export function useProjects(clientId?: number, includeArchived = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.horabar.projects.list(clientId, includeArchived);
    setProjects(data);
    setLoading(false);
  }, [clientId, includeArchived]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: ProjectInput) => {
    const project = await window.horabar.projects.create(input);
    await refresh();
    return project;
  };

  const update = async (id: number, input: ProjectInput) => {
    const project = await window.horabar.projects.update(id, input);
    await refresh();
    return project;
  };

  const archive = async (id: number) => {
    await window.horabar.projects.archive(id);
    await refresh();
  };

  const unarchive = async (id: number) => {
    await window.horabar.projects.unarchive(id);
    await refresh();
  };

  return { projects, loading, refresh, create, update, archive, unarchive };
}
