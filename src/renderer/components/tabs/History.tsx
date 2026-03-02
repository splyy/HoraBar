import { useMemo, useState } from 'react';
import { useTimeEntriesByRange } from '../../hooks/useTimeEntries';
import { useFormatDuration, useFormatDays } from '../../hooks/useFormatDuration';
import { useClients } from '../../hooks/useClients';
import { useProjects } from '../../hooks/useProjects';
import { TimeEntryForm } from '../forms/TimeEntryForm';
import { EmptyState } from '../common/EmptyState';
import { Select } from '../common/Select';
import { AlertDialog } from '../common/AlertDialog';
import { Tooltip } from '../common/Tooltip';
import { IconChevronLeft, IconChevronRight, IconClipboard, IconPencil, IconTrash, IconPlus } from '../common/Icons';
import type { TimeEntryWithDetails } from '../../../shared/types';
import styles from './History.module.css';

type Period = 'day' | 'week' | 'month' | 'year';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getDateRange(date: Date, period: Period): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  switch (period) {
    case 'day':
      return { start: fmt(date), end: fmt(date) };
    case 'week': {
      const d = new Date(date);
      const day = d.getDay();
      const diff = day === 0 ? 6 : day - 1; // Monday start
      d.setDate(d.getDate() - diff);
      const start = fmt(d);
      d.setDate(d.getDate() + 6);
      return { start, end: fmt(d) };
    }
    case 'month': {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return { start: fmt(start), end: fmt(end) };
    }
    case 'year': {
      return { start: `${date.getFullYear()}-01-01`, end: `${date.getFullYear()}-12-31` };
    }
  }
}

function navigateDate(date: Date, period: Period, direction: -1 | 1): Date {
  const d = new Date(date);
  switch (period) {
    case 'day':
      d.setDate(d.getDate() + direction);
      break;
    case 'week':
      d.setDate(d.getDate() + direction * 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() + direction);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + direction);
      break;
  }
  return d;
}

function formatPeriodLabel(date: Date, period: Period): string {
  switch (period) {
    case 'day':
      return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    case 'week': {
      const { start, end } = getDateRange(date, 'week');
      const s = new Date(start + 'T00:00:00');
      const e = new Date(end + 'T00:00:00');
      return `${s.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — ${e.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
    }
    case 'month':
      return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    case 'year':
      return date.getFullYear().toString();
  }
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

interface DayGroup {
  date: string;
  entries: TimeEntryWithDetails[];
  totalMinutes: number;
}

export function History() {
  const [period, setPeriod] = useState<Period>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clientFilter, setClientFilter] = useState<number | ''>('');
  const [projectFilter, setProjectFilter] = useState<number | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntryWithDetails | null>(null);

  const { start, end } = getDateRange(currentDate, period);
  const { entries, loading, create, update, remove } = useTimeEntriesByRange(start, end);
  const { clients } = useClients();
  const { projects } = useProjects(clientFilter || undefined);
  const formatDuration = useFormatDuration();
  const formatDays = useFormatDays();

  const filtered = useMemo(() => {
    let result = entries;
    if (clientFilter) {
      result = result.filter((e) => e.client_id === clientFilter);
    }
    if (projectFilter) {
      result = result.filter((e) => e.project_id === projectFilter);
    }
    return result;
  }, [entries, clientFilter, projectFilter]);

  const groups = useMemo<DayGroup[]>(() => {
    const map = new Map<string, DayGroup>();
    for (const entry of filtered) {
      let group = map.get(entry.date);
      if (!group) {
        group = { date: entry.date, entries: [], totalMinutes: 0 };
        map.set(entry.date, group);
      }
      group.entries.push(entry);
      group.totalMinutes += entry.duration;
    }
    return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [filtered]);

  const totalMinutes = filtered.reduce((sum, e) => sum + e.duration, 0);

  const handleEdit = (entry: TimeEntryWithDetails) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  if (showForm) {
    return (
      <TimeEntryForm
        date={editingEntry?.date ?? start}
        entry={editingEntry}
        onSave={async (input) => {
          if (editingEntry) {
            await update(editingEntry.id, input);
          } else {
            await create(input);
          }
          handleFormClose();
        }}
        onCancel={handleFormClose}
      />
    );
  }

  const today = getToday();
  const isCurrentPeriod = start <= today && end >= today;

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2>Historique</h2>
          <span className={styles.total}>{formatDuration(totalMinutes)} · {formatDays(totalMinutes)}</span>
        </div>

        <div className={styles.periodSelector}>
          {(['day', 'week', 'month', 'year'] as Period[]).map((p) => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(p)}
            >
              {{ day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Année' }[p]}
            </button>
          ))}
        </div>

        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={() => setCurrentDate(navigateDate(currentDate, period, -1))}>
            <IconChevronLeft size={16} />
          </button>
          <span className={styles.navLabel}>{formatPeriodLabel(currentDate, period)}</span>
          <button className={styles.navBtn} onClick={() => setCurrentDate(navigateDate(currentDate, period, 1))}>
            <IconChevronRight size={16} />
          </button>
          {!isCurrentPeriod && (
            <button
              className={`${styles.periodBtn} ${styles.todayBtn}`}
              onClick={() => setCurrentDate(new Date())}
            >
              Aujourd'hui
            </button>
          )}
        </div>

        <div className={styles.filters}>
          <Select
            size="sm"
            value={clientFilter ? String(clientFilter) : 'all'}
            onValueChange={(v) => {
              setClientFilter(v === 'all' ? '' : parseInt(v));
              setProjectFilter('');
            }}
            options={[
              { value: 'all', label: 'Tous les clients' },
              ...clients.map((c) => ({ value: String(c.id), label: c.name })),
            ]}
          />
          <Select
            size="sm"
            value={projectFilter ? String(projectFilter) : 'all'}
            onValueChange={(v) => setProjectFilter(v === 'all' ? '' : parseInt(v))}
            options={[
              { value: 'all', label: 'Tous les projets' },
              ...projects.map((p) => ({ value: String(p.id), label: p.name })),
            ]}
          />
        </div>
      </div>

      <button className={styles.addButton} onClick={() => setShowForm(true)}>
        <IconPlus size={14} /> Ajouter une entrée
      </button>

      {loading ? null : groups.length === 0 ? (
        <EmptyState icon={<IconClipboard size={32} />} message="Aucune entrée pour cette période" />
      ) : (
        groups.map((group) => (
          <div key={group.date} className={styles.dayGroup}>
            <div className={styles.dayHeader}>
              <span className={styles.dayDate}>{formatDayLabel(group.date)}</span>
              <span className={styles.dayTotal}>{formatDuration(group.totalMinutes)} · {formatDays(group.totalMinutes)}</span>
            </div>
            {group.entries.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <span className={styles.entryDot} style={{ backgroundColor: entry.client_color }} />
                <div className={styles.entryInfo}>
                  <div className={styles.entryProject}>{entry.project_name}</div>
                  <div className={styles.entryClient}>{entry.client_name}</div>
                  {entry.description && (
                    <div className={styles.entryDescription}>{entry.description}</div>
                  )}
                </div>
                <span className={styles.entryDuration}>{formatDuration(entry.duration)}</span>
                <div className={styles.entryActions}>
                  <Tooltip content="Modifier">
                    <button className={styles.actionBtn} onClick={() => handleEdit(entry)}>
                      <IconPencil size={13} />
                    </button>
                  </Tooltip>
                  <AlertDialog
                    trigger={
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`}>
                        <IconTrash size={13} />
                      </button>
                    }
                    title="Supprimer l'entrée"
                    description="Cette action est irréversible. Voulez-vous vraiment supprimer cette entrée ?"
                    onConfirm={() => handleDelete(entry.id)}
                    variant="danger"
                  />
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
