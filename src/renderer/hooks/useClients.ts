import { useCallback, useEffect, useState } from 'react';
import type { Client, ClientInput } from '../../shared/types';

export function useClients(includeArchived = false) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.horabar.clients.list(includeArchived);
    setClients(data);
    setLoading(false);
  }, [includeArchived]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: ClientInput) => {
    const client = await window.horabar.clients.create(input);
    await refresh();
    return client;
  };

  const update = async (id: number, input: ClientInput) => {
    const client = await window.horabar.clients.update(id, input);
    await refresh();
    return client;
  };

  const archive = async (id: number) => {
    await window.horabar.clients.archive(id);
    await refresh();
  };

  const unarchive = async (id: number) => {
    await window.horabar.clients.unarchive(id);
    await refresh();
  };

  return { clients, loading, refresh, create, update, archive, unarchive };
}
