import { ipcMain } from 'electron';
// eslint-disable-next-line import/no-unresolved
import { IPC } from '@/shared/constants/ipc-channels';
import * as clientsService from '../services/clients';
import * as projectsService from '../services/projects';
import * as timeEntriesService from '../services/time-entries';
import * as settingsService from '../services/settings';

export function registerIpcHandlers(): void {
  // --- Clients ---
  ipcMain.handle(IPC.CLIENTS_LIST, (_event, includeArchived?: boolean) => {
    return clientsService.listClients(includeArchived);
  });

  ipcMain.handle(IPC.CLIENTS_CREATE, (_event, input) => {
    return clientsService.createClient(input);
  });

  ipcMain.handle(IPC.CLIENTS_UPDATE, (_event, id: number, input) => {
    return clientsService.updateClient(id, input);
  });

  ipcMain.handle(IPC.CLIENTS_ARCHIVE, (_event, id: number) => {
    clientsService.archiveClient(id);
  });

  ipcMain.handle(IPC.CLIENTS_UNARCHIVE, (_event, id: number) => {
    clientsService.unarchiveClient(id);
  });

  // --- Projects ---
  ipcMain.handle(IPC.PROJECTS_LIST, (_event, clientId?: number, includeArchived?: boolean) => {
    return projectsService.listProjects(clientId, includeArchived);
  });

  ipcMain.handle(IPC.PROJECTS_CREATE, (_event, input) => {
    return projectsService.createProject(input);
  });

  ipcMain.handle(IPC.PROJECTS_UPDATE, (_event, id: number, input) => {
    return projectsService.updateProject(id, input);
  });

  ipcMain.handle(IPC.PROJECTS_ARCHIVE, (_event, id: number) => {
    projectsService.archiveProject(id);
  });

  ipcMain.handle(IPC.PROJECTS_UNARCHIVE, (_event, id: number) => {
    projectsService.unarchiveProject(id);
  });

  // --- Time Entries ---
  ipcMain.handle(IPC.TIME_ENTRIES_LIST, (_event, date: string) => {
    return timeEntriesService.listTimeEntries(date);
  });

  ipcMain.handle(IPC.TIME_ENTRIES_LIST_BY_RANGE, (_event, startDate: string, endDate: string) => {
    return timeEntriesService.listTimeEntriesByRange(startDate, endDate);
  });

  ipcMain.handle(IPC.TIME_ENTRIES_CREATE, (_event, input) => {
    return timeEntriesService.createTimeEntry(input);
  });

  ipcMain.handle(IPC.TIME_ENTRIES_UPDATE, (_event, id: number, input) => {
    return timeEntriesService.updateTimeEntry(id, input);
  });

  ipcMain.handle(IPC.TIME_ENTRIES_DELETE, (_event, id: number) => {
    timeEntriesService.deleteTimeEntry(id);
  });

  ipcMain.handle(IPC.TIME_ENTRIES_TODAY_TOTAL, (_event, date: string) => {
    return timeEntriesService.getTodayTotal(date);
  });

  ipcMain.handle(IPC.TIME_ENTRIES_STATS, (_event, startDate: string, endDate: string) => {
    return timeEntriesService.getStatsByPeriod(startDate, endDate);
  });

  // --- Settings ---
  ipcMain.handle(IPC.SETTINGS_GET, (_event, key: string) => {
    return settingsService.getSetting(key);
  });

  ipcMain.handle(IPC.SETTINGS_SET, (_event, key: string, value: unknown) => {
    settingsService.setSetting(key, value);
  });

  ipcMain.handle(IPC.SETTINGS_GET_ALL, () => {
    return settingsService.getAllSettings();
  });
}
