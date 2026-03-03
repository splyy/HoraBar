import { useCallback, useEffect, useState } from 'react';
import type { TrackingEntryInput, TrackingEntryWithDetails } from '../../shared/types';

export function useTracking(date: string) {
  const [entries, setEntries] = useState<TrackingEntryWithDetails[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

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
    const entry = await window.kronobar.tracking.create(input);
    await refresh();
    return entry;
  };

  const update = async (id: number, input: TrackingEntryInput) => {
    const entry = await window.kronobar.tracking.update(id, input);
    await refresh();
    return entry;
  };

  const remove = async (id: number) => {
    await window.kronobar.tracking.delete(id);
    await refresh();
  };

  return { entries, totalMinutes, loading, refresh, create, update, remove };
}

export function useTrackingByRange(startDate: string, endDate: string) {
  const [entries, setEntries] = useState<TrackingEntryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.kronobar.tracking.listByRange(startDate, endDate);
    setEntries(data);
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: TrackingEntryInput) => {
    await window.kronobar.tracking.create(input);
    await refresh();
  };

  const update = async (id: number, input: TrackingEntryInput) => {
    await window.kronobar.tracking.update(id, input);
    await refresh();
  };

  const remove = async (id: number) => {
    await window.kronobar.tracking.delete(id);
    await refresh();
  };

  return { entries, loading, refresh, create, update, remove };
}
