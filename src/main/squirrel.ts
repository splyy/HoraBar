import { app } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Handle Squirrel.Windows lifecycle events (install, update, uninstall).
 * Returns true if a Squirrel event was handled (the app should exit immediately).
 */
export function handleSquirrelEvents(): boolean {
  if (process.platform !== 'win32') return false;

  const squirrelEvent = process.argv[1];
  if (!squirrelEvent?.startsWith('--squirrel-')) return false;

  const appFolder = path.resolve(process.execPath, '..');
  const rootFolder = path.resolve(appFolder, '..');
  const updateExe = path.join(rootFolder, 'Update.exe');
  const exeName = path.basename(process.execPath);

  const runUpdate = (args: string[]) => {
    try {
      spawn(updateExe, args, { detached: true });
    } catch {
      // Update.exe may not exist in dev
    }
  };

  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Create desktop & start menu shortcuts
      runUpdate(['--createShortcut', exeName]);
      return true;

    case '--squirrel-uninstall':
      // Remove shortcuts
      runUpdate(['--removeShortcut', exeName]);
      return true;

    case '--squirrel-obsolete':
      // Called on the old version during an update
      app.quit();
      return true;

    default:
      return false;
  }
}
