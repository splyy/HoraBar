import { useCallback, useEffect, useState } from 'react';
import { useToast } from './useToast';
import type { Client, ClientInput } from '../../shared/types';

export function useClients(includeArchived = false) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.kronobar.clients.list(includeArchived);
    setClients(data);
    setLoading(false);
  }, [includeArchived]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: ClientInput) => {
    try {
      const client = await window.kronobar.clients.create(input);
      await refresh();
      showToast('Client ajouté');
      return client;
    } catch {
      showToast('Erreur lors de l\'ajout du client', 'error');
      throw new Error('Failed to create client');
    }
  };

  const update = async (id: number, input: ClientInput) => {
    try {
      const client = await window.kronobar.clients.update(id, input);
      await refresh();
      showToast('Client mis à jour');
      return client;
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
      throw new Error('Failed to update client');
    }
  };

  const archive = async (id: number) => {
    try {
      await window.kronobar.clients.archive(id);
      await refresh();
      showToast('Client archivé');
    } catch {
      showToast('Erreur lors de l\'archivage', 'error');
    }
  };

  const unarchive = async (id: number) => {
    try {
      await window.kronobar.clients.unarchive(id);
      await refresh();
      showToast('Client désarchivé');
    } catch {
      showToast('Erreur lors du désarchivage', 'error');
    }
  };

  return { clients, loading, refresh, create, update, archive, unarchive };
}
