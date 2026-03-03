import { app } from 'electron';
import initSqlJs, { type Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { runMigrations } from './migrations';

let db: Database | null = null;
let dbPath: string = '';

function getWasmPath(): string {
  // Try multiple locations to find the WASM file
  const candidates = [
    // Development: node_modules relative to project root
    path.join(app.getAppPath(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
    // Development: app.getAppPath() may be inside .vite/build/, go up to project root
    path.resolve(app.getAppPath(), '..', '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
    // Production: packaged alongside the app
    path.join(process.resourcesPath ?? '', 'sql-wasm.wasm'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error(`sql-wasm.wasm not found. Searched: ${candidates.join(', ')}`);
}

export async function initDatabase(): Promise<void> {
  const wasmPath = getWasmPath();
  const wasmBinary = fs.readFileSync(wasmPath);

  const SQL = await initSqlJs({ wasmBinary });

  dbPath = path.join(app.getPath('userData'), 'kronobar.db');

  // Load existing DB or create new
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Run migrations
  runMigrations(db);

  // Save after migrations
  saveDatabase();
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function saveDatabase(): void {
  if (!db || !dbPath) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}
