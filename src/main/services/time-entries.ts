import { getDatabase, saveDatabase } from '../database/connection';
import { queryAll, queryOne, run } from '../database/helpers';
import type { TimeEntry, TimeEntryInput, TimeEntryWithDetails } from '../../shared/types';

export function listTimeEntries(date: string): TimeEntryWithDetails[] {
  const db = getDatabase();
  return queryAll<TimeEntryWithDetails>(
    db,
    `SELECT te.*, p.name as project_name, p.client_id, c.name as client_name, c.color as client_color
     FROM time_entries te
     JOIN projects p ON te.project_id = p.id
     JOIN clients c ON p.client_id = c.id
     WHERE te.date = ?
     ORDER BY te.created_at DESC`,
    [date]
  );
}

export function listTimeEntriesByRange(startDate: string, endDate: string): TimeEntryWithDetails[] {
  const db = getDatabase();
  return queryAll<TimeEntryWithDetails>(
    db,
    `SELECT te.*, p.name as project_name, p.client_id, c.name as client_name, c.color as client_color
     FROM time_entries te
     JOIN projects p ON te.project_id = p.id
     JOIN clients c ON p.client_id = c.id
     WHERE te.date >= ? AND te.date <= ?
     ORDER BY te.date DESC, te.created_at DESC`,
    [startDate, endDate]
  );
}

export function getTimeEntry(id: number): TimeEntry | undefined {
  const db = getDatabase();
  return queryOne<TimeEntry>(db, 'SELECT * FROM time_entries WHERE id = ?', [id]);
}

export function createTimeEntry(input: TimeEntryInput): TimeEntry {
  const db = getDatabase();
  const { lastId } = run(
    db,
    'INSERT INTO time_entries (project_id, date, duration, description) VALUES (?, ?, ?, ?)',
    [input.project_id, input.date, input.duration, input.description ?? null]
  );
  saveDatabase();
  return getTimeEntry(lastId)!;
}

export function updateTimeEntry(id: number, input: TimeEntryInput): TimeEntry {
  const db = getDatabase();
  run(
    db,
    `UPDATE time_entries SET project_id = ?, date = ?, duration = ?, description = ?, updated_at = datetime('now') WHERE id = ?`,
    [input.project_id, input.date, input.duration, input.description ?? null, id]
  );
  saveDatabase();
  return getTimeEntry(id)!;
}

export function deleteTimeEntry(id: number): void {
  const db = getDatabase();
  run(db, 'DELETE FROM time_entries WHERE id = ?', [id]);
  saveDatabase();
}

export function getTodayTotal(date: string): number {
  const db = getDatabase();
  const result = queryOne<{ total: number }>(
    db,
    'SELECT COALESCE(SUM(duration), 0) as total FROM time_entries WHERE date = ?',
    [date]
  );
  return result?.total ?? 0;
}

export function getStatsByPeriod(
  startDate: string,
  endDate: string
): { client_id: number; client_name: string; client_color: string; daily_rate: number | null; project_id: number; project_name: string; total_minutes: number }[] {
  const db = getDatabase();
  return queryAll(
    db,
    `SELECT c.id as client_id, c.name as client_name, c.color as client_color, c.daily_rate,
            p.id as project_id, p.name as project_name,
            COALESCE(SUM(te.duration), 0) as total_minutes
     FROM time_entries te
     JOIN projects p ON te.project_id = p.id
     JOIN clients c ON p.client_id = c.id
     WHERE te.date >= ? AND te.date <= ?
     GROUP BY c.id, p.id
     ORDER BY c.name, p.name`,
    [startDate, endDate]
  );
}
