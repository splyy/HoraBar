import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from './shared/constants/ipc-channels';
import type { HoraBarAPI } from './shared/types';

const api: HoraBarAPI = {
  clients: {
    list: (includeArchived) => ipcRenderer.invoke(IPC.CLIENTS_LIST, includeArchived),
    create: (input) => ipcRenderer.invoke(IPC.CLIENTS_CREATE, input),
    update: (id, input) => ipcRenderer.invoke(IPC.CLIENTS_UPDATE, id, input),
    archive: (id) => ipcRenderer.invoke(IPC.CLIENTS_ARCHIVE, id),
    unarchive: (id) => ipcRenderer.invoke(IPC.CLIENTS_UNARCHIVE, id),
  },
  projects: {
    list: (clientId, includeArchived) => ipcRenderer.invoke(IPC.PROJECTS_LIST, clientId, includeArchived),
    create: (input) => ipcRenderer.invoke(IPC.PROJECTS_CREATE, input),
    update: (id, input) => ipcRenderer.invoke(IPC.PROJECTS_UPDATE, id, input),
    archive: (id) => ipcRenderer.invoke(IPC.PROJECTS_ARCHIVE, id),
    unarchive: (id) => ipcRenderer.invoke(IPC.PROJECTS_UNARCHIVE, id),
  },
  timeEntries: {
    list: (date) => ipcRenderer.invoke(IPC.TIME_ENTRIES_LIST, date),
    listByRange: (start, end) => ipcRenderer.invoke(IPC.TIME_ENTRIES_LIST_BY_RANGE, start, end),
    create: (input) => ipcRenderer.invoke(IPC.TIME_ENTRIES_CREATE, input),
    update: (id, input) => ipcRenderer.invoke(IPC.TIME_ENTRIES_UPDATE, id, input),
    delete: (id) => ipcRenderer.invoke(IPC.TIME_ENTRIES_DELETE, id),
    getTodayTotal: (date) => ipcRenderer.invoke(IPC.TIME_ENTRIES_TODAY_TOTAL, date),
    getStats: (start, end) => ipcRenderer.invoke(IPC.TIME_ENTRIES_STATS, start, end),
  },
  settings: {
    get: (key) => ipcRenderer.invoke(IPC.SETTINGS_GET, key),
    set: (key, value) => ipcRenderer.invoke(IPC.SETTINGS_SET, key, value),
    getAll: () => ipcRenderer.invoke(IPC.SETTINGS_GET_ALL),
  },
};

contextBridge.exposeInMainWorld('horabar', api);
