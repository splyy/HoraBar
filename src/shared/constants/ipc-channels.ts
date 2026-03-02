export const IPC = {
  // Clients
  CLIENTS_LIST: 'clients:list',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_ARCHIVE: 'clients:archive',
  CLIENTS_UNARCHIVE: 'clients:unarchive',

  // Projects
  PROJECTS_LIST: 'projects:list',
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_UPDATE: 'projects:update',
  PROJECTS_ARCHIVE: 'projects:archive',
  PROJECTS_UNARCHIVE: 'projects:unarchive',

  // Time Entries
  TIME_ENTRIES_LIST: 'timeEntries:list',
  TIME_ENTRIES_LIST_BY_RANGE: 'timeEntries:listByRange',
  TIME_ENTRIES_CREATE: 'timeEntries:create',
  TIME_ENTRIES_UPDATE: 'timeEntries:update',
  TIME_ENTRIES_DELETE: 'timeEntries:delete',
  TIME_ENTRIES_TODAY_TOTAL: 'timeEntries:todayTotal',
  TIME_ENTRIES_STATS: 'timeEntries:stats',

  // Settings
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_GET_ALL: 'settings:getAll',
} as const;
