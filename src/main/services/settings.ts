import { getDatabase, saveDatabase } from '../database/connection';
import { queryAll, queryOne, run } from '../database/helpers';
import type { Settings } from '../../shared/types';

export function getSetting<T>(key: string): T | undefined {
  const db = getDatabase();
  const row = queryOne<{ value: string }>(db, 'SELECT value FROM settings WHERE key = ?', [key]);
  if (!row) return undefined;
  return JSON.parse(row.value) as T;
}

export function setSetting<T>(key: string, value: T): void {
  const db = getDatabase();
  run(db, 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, JSON.stringify(value)]);
  saveDatabase();
}

export function getAllSettings(): Settings {
  const db = getDatabase();
  const rows = queryAll<{ key: string; value: string }>(db, 'SELECT key, value FROM settings');
  const settings: Record<string, unknown> = {};
  for (const row of rows) {
    settings[row.key] = JSON.parse(row.value);
  }
  return settings as unknown as Settings;
}
