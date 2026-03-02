// --- Clients ---
export interface Client {
  id: number;
  name: string;
  color: string;
  daily_rate: number | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientInput {
  name: string;
  color?: string;
  daily_rate?: number | null;
}

// --- Projects ---
export interface Project {
  id: number;
  client_id: number;
  name: string;
  description: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInput {
  client_id: number;
  name: string;
  description?: string | null;
}

// --- Time Entries ---
export interface TimeEntry {
  id: number;
  project_id: number;
  date: string;
  duration: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeEntryWithDetails extends TimeEntry {
  project_name: string;
  client_id: number;
  client_name: string;
  client_color: string;
}

export interface TimeEntryInput {
  project_id: number;
  date: string;
  duration: number;
  description?: string | null;
}

// --- Settings ---
export interface Settings {
  time_format: 'hhmm' | 'decimal';
  hours_per_day: number;
  currency: string;
  launch_at_login: boolean;
}

// --- Stats ---
export interface StatEntry {
  client_id: number;
  client_name: string;
  client_color: string;
  daily_rate: number | null;
  project_id: number;
  project_name: string;
  total_minutes: number;
}

// --- IPC API ---
export interface HoraBarAPI {
  clients: {
    list(includeArchived?: boolean): Promise<Client[]>;
    create(input: ClientInput): Promise<Client>;
    update(id: number, input: ClientInput): Promise<Client>;
    archive(id: number): Promise<void>;
    unarchive(id: number): Promise<void>;
  };
  projects: {
    list(clientId?: number, includeArchived?: boolean): Promise<Project[]>;
    create(input: ProjectInput): Promise<Project>;
    update(id: number, input: ProjectInput): Promise<Project>;
    archive(id: number): Promise<void>;
    unarchive(id: number): Promise<void>;
  };
  timeEntries: {
    list(date: string): Promise<TimeEntryWithDetails[]>;
    listByRange(startDate: string, endDate: string): Promise<TimeEntryWithDetails[]>;
    create(input: TimeEntryInput): Promise<TimeEntry>;
    update(id: number, input: TimeEntryInput): Promise<TimeEntry>;
    delete(id: number): Promise<void>;
    getTodayTotal(date: string): Promise<number>;
    getStats(startDate: string, endDate: string): Promise<StatEntry[]>;
  };
  settings: {
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    getAll(): Promise<Settings>;
  };
}
