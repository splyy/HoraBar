import { app } from 'electron';
import { TrayManager } from './main/tray';
import { registerIpcHandlers } from './main/ipc/handlers';
import { initDatabase, closeDatabase } from './main/database/connection';

// Hide dock icon (menu bar app only)
app.dock?.hide();

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let trayManager: TrayManager | null = null;

app.whenReady().then(async () => {
  try {
    console.log('[HoraBar] App ready, initializing...');
    await initDatabase();
    console.log('[HoraBar] Database initialized');
    registerIpcHandlers();
    console.log('[HoraBar] IPC handlers registered');
    trayManager = TrayManager.getInstance();
    console.log('[HoraBar] Tray created');
  } catch (err) {
    console.error('[HoraBar] Fatal startup error:', err);
  }
});

app.on('second-instance', () => {
  trayManager?.showWindow();
});

// macOS: keep app running when all windows closed
app.on('window-all-closed', (e: Event) => {
  e.preventDefault();
});

app.on('before-quit', () => {
  closeDatabase();
});
