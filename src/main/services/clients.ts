import { getDatabase, saveDatabase } from '../database/connection';
import { queryAll, queryOne, run } from '../database/helpers';
import type { Client, ClientInput } from '../../shared/types';

export function listClients(includeArchived = false): Client[] {
  const db = getDatabase();
  if (includeArchived) {
    return queryAll<Client>(db, 'SELECT * FROM clients ORDER BY name');
  }
  return queryAll<Client>(db, 'SELECT * FROM clients WHERE archived_at IS NULL ORDER BY name');
}

export function getClient(id: number): Client | undefined {
  const db = getDatabase();
  return queryOne<Client>(db, 'SELECT * FROM clients WHERE id = ?', [id]);
}

export function createClient(input: ClientInput): Client {
  const db = getDatabase();
  const { lastId } = run(
    db,
    'INSERT INTO clients (name, color, daily_rate) VALUES (?, ?, ?)',
    [input.name, input.color || '#3B82F6', input.daily_rate ?? null]
  );
  saveDatabase();
  return getClient(lastId)!;
}

export function updateClient(id: number, input: ClientInput): Client {
  const db = getDatabase();
  run(
    db,
    `UPDATE clients SET name = ?, color = ?, daily_rate = ?, updated_at = datetime('now') WHERE id = ?`,
    [input.name, input.color || '#3B82F6', input.daily_rate ?? null, id]
  );
  saveDatabase();
  return getClient(id)!;
}

export function archiveClient(id: number): void {
  const db = getDatabase();
  run(db, `UPDATE clients SET archived_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`, [id]);
  saveDatabase();
}

export function unarchiveClient(id: number): void {
  const db = getDatabase();
  run(db, `UPDATE clients SET archived_at = NULL, updated_at = datetime('now') WHERE id = ?`, [id]);
  saveDatabase();
}
