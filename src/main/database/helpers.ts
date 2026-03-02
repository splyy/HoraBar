import type { Database } from 'sql.js';

/**
 * Run a query and return all rows as objects.
 */
export function queryAll<T>(db: Database, sql: string, params: unknown[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params.map(coerce));
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

/**
 * Run a query and return the first row as object, or undefined.
 */
export function queryOne<T>(db: Database, sql: string, params: unknown[] = []): T | undefined {
  const stmt = db.prepare(sql);
  stmt.bind(params.map(coerce));
  let result: T | undefined;
  if (stmt.step()) {
    result = stmt.getAsObject() as T;
  }
  stmt.free();
  return result;
}

/**
 * Run an INSERT/UPDATE/DELETE and return info about the operation.
 */
export function run(db: Database, sql: string, params: unknown[] = []): { lastId: number } {
  const stmt = db.prepare(sql);
  stmt.bind(params.map(coerce));
  stmt.step();
  stmt.free();
  const lastId = queryOne<{ id: number }>(db, 'SELECT last_insert_rowid() as id')!.id;
  return { lastId };
}

/**
 * Coerce JS values to sql.js compatible types.
 */
function coerce(v: unknown): unknown {
  if (v === undefined) return null;
  if (typeof v === 'boolean') return v ? 1 : 0;
  return v;
}
