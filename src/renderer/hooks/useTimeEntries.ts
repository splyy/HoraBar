import { useCallback, useEffect, useState } from 'react';
import type { TimeEntryInput, TimeEntryWithDetails } from '../../shared/types';

export function useTimeEntries(date: string) {
  const [entries, setEntries] = useState<TimeEntryWithDetails[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [data, total] = await Promise.all([
      window.horabar.timeEntries.list(date),
      window.horabar.timeEntries.getTodayTotal(date),
    ]);
    setEntries(data);
    setTotalMinutes(total);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: TimeEntryInput) => {
    const entry = await window.horabar.timeEntries.create(input);
    await refresh();
    return entry;
  };

  const update = async (id: number, input: TimeEntryInput) => {
    const entry = await window.horabar.timeEntries.update(id, input);
    await refresh();
    return entry;
  };

  const remove = async (id: number) => {
    await window.horabar.timeEntries.delete(id);
    await refresh();
  };

  return { entries, totalMinutes, loading, refresh, create, update, remove };
}

export function useTimeEntriesByRange(startDate: string, endDate: string) {
  const [entries, setEntries] = useState<TimeEntryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.horabar.timeEntries.listByRange(startDate, endDate);
    setEntries(data);
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: TimeEntryInput) => {
    await window.horabar.timeEntries.create(input);
    await refresh();
  };

  const update = async (id: number, input: TimeEntryInput) => {
    await window.horabar.timeEntries.update(id, input);
    await refresh();
  };

  const remove = async (id: number) => {
    await window.horabar.timeEntries.delete(id);
    await refresh();
  };

  return { entries, loading, refresh, create, update, remove };
}
