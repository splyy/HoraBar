import { useCallback, useEffect, useState } from 'react';
import { useToast } from './useToast';
import type { Project, ProjectInput } from '../../shared/types';

export function useProjects(clientId?: number, includeArchived = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.kronobar.projects.list(clientId, includeArchived);
    setProjects(data);
    setLoading(false);
  }, [clientId, includeArchived]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: ProjectInput) => {
    try {
      const project = await window.kronobar.projects.create(input);
      await refresh();
      showToast('Projet ajouté');
      return project;
    } catch {
      showToast('Erreur lors de l\'ajout du projet', 'error');
      throw new Error('Failed to create project');
    }
  };

  const update = async (id: number, input: ProjectInput) => {
    try {
      const project = await window.kronobar.projects.update(id, input);
      await refresh();
      showToast('Projet mis à jour');
      return project;
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
      throw new Error('Failed to update project');
    }
  };

  const archive = async (id: number) => {
    try {
      await window.kronobar.projects.archive(id);
      await refresh();
      showToast('Projet archivé');
    } catch {
      showToast('Erreur lors de l\'archivage', 'error');
    }
  };

  const unarchive = async (id: number) => {
    try {
      await window.kronobar.projects.unarchive(id);
      await refresh();
      showToast('Projet désarchivé');
    } catch {
      showToast('Erreur lors du désarchivage', 'error');
    }
  };

  return { projects, loading, refresh, create, update, archive, unarchive };
}
