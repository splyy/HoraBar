import { getDatabase, saveDatabase } from '../database/connection';
import { queryAll, queryOne, run } from '../database/helpers';
import type { Project, ProjectInput } from '../../shared/types';

export function listProjects(clientId?: number, includeArchived = false): Project[] {
  const db = getDatabase();
  let sql = 'SELECT * FROM projects';
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (clientId) {
    conditions.push('client_id = ?');
    params.push(clientId);
  }
  if (!includeArchived) {
    conditions.push('archived_at IS NULL');
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY name';

  return queryAll<Project>(db, sql, params);
}

export function getProject(id: number): Project | undefined {
  const db = getDatabase();
  return queryOne<Project>(db, 'SELECT * FROM projects WHERE id = ?', [id]);
}

export function createProject(input: ProjectInput): Project {
  const db = getDatabase();
  const { lastId } = run(
    db,
    'INSERT INTO projects (client_id, name, description) VALUES (?, ?, ?)',
    [input.client_id, input.name, input.description ?? null]
  );
  saveDatabase();
  return getProject(lastId)!;
}

export function updateProject(id: number, input: ProjectInput): Project {
  const db = getDatabase();
  run(
    db,
    `UPDATE projects SET client_id = ?, name = ?, description = ?, updated_at = datetime('now') WHERE id = ?`,
    [input.client_id, input.name, input.description ?? null, id]
  );
  saveDatabase();
  return getProject(id)!;
}

export function archiveProject(id: number): void {
  const db = getDatabase();
  run(db, `UPDATE projects SET archived_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`, [id]);
  saveDatabase();
}

export function unarchiveProject(id: number): void {
  const db = getDatabase();
  run(db, `UPDATE projects SET archived_at = NULL, updated_at = datetime('now') WHERE id = ?`, [id]);
  saveDatabase();
}
