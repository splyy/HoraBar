import { useCallback, useEffect, useState } from 'react';
import { useToast } from './useToast';
import type { TrackingEntryInput, TrackingEntryWithDetails } from '../../shared/types';

export function useTracking(date: string) {
  const [entries, setEntries] = useState<TrackingEntryWithDetails[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    const [data, total] = await Promise.all([
      window.kronobar.tracking.list(date),
      window.kronobar.tracking.getTodayTotal(date),
    ]);
    setEntries(data);
    setTotalMinutes(total);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: TrackingEntryInput) => {
    try {
      const entry = await window.kronobar.tracking.create(input);
      await refresh();
      showToast('Entrée ajoutée');
      return entry;
    } catch {
      showToast('Erreur lors de l\'ajout', 'error');
      throw new Error('Failed to create tracking entry');
    }
  };

  const update = async (id: number, input: TrackingEntryInput) => {
    try {
      const entry = await window.kronobar.tracking.update(id, input);
      await refresh();
      showToast('Entrée mise à jour');
      return entry;
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
      throw new Error('Failed to update tracking entry');
    }
  };

  const remove = async (id: number) => {
    try {
      await window.kronobar.tracking.delete(id);
      await refresh();
      showToast('Entrée supprimée');
    } catch {
      showToast('Erreur lors de la suppression', 'error');
      throw new Error('Failed to delete tracking entry');
    }
  };

  return { entries, totalMinutes, loading, refresh, create, update, remove };
}

export function useTrackingByRange(
  startDate: string,
  endDate: string,
  clientId?: number,
  projectId?: number,
) {
  const [entries, setEntries] = useState<TrackingEntryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.kronobar.tracking.listByRange(startDate, endDate, clientId, projectId);
    setEntries(data);
    setLoading(false);
  }, [startDate, endDate, clientId, projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: TrackingEntryInput) => {
    try {
      await window.kronobar.tracking.create(input);
      await refresh();
      showToast('Entrée ajoutée');
    } catch {
      showToast('Erreur lors de l\'ajout', 'error');
    }
  };

  const update = async (id: number, input: TrackingEntryInput) => {
    try {
      await window.kronobar.tracking.update(id, input);
      await refresh();
      showToast('Entrée mise à jour');
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const remove = async (id: number) => {
    try {
      await window.kronobar.tracking.delete(id);
      await refresh();
      showToast('Entrée supprimée');
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  return { entries, loading, refresh, create, update, remove };
}
