import { useMemo, useState } from 'react';
import { useTracking } from '../../hooks/useTracking';
import { useFormatDuration, useFormatDays } from '../../hooks/useFormatDuration';
import { TimeEntryForm } from '../forms/TimeEntryForm';
import { EmptyState } from '../common/EmptyState';
import { AlertDialog } from '../common/AlertDialog';
import { Tooltip } from '../common/Tooltip';
import { IconPencil, IconTrash, IconPlus, IconClock } from '../common/Icons';
import type { TrackingEntryWithDetails } from '../../../shared/types';
import styles from './Today.module.css';

function getToday(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

interface ClientGroup {
  clientId: number;
  clientName: string;
  clientColor: string;
  entries: TrackingEntryWithDetails[];
  totalMinutes: number;
}

export function Today() {
  const today = getToday();
  const { entries, totalMinutes, loading, create, update, remove } = useTracking(today);
  const formatDuration = useFormatDuration();
  const formatDays = useFormatDays();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TrackingEntryWithDetails | null>(null);

  const groups = useMemo<ClientGroup[]>(() => {
    const map = new Map<number, ClientGroup>();
    for (const entry of entries) {
      let group = map.get(entry.client_id);
      if (!group) {
        group = {
          clientId: entry.client_id,
          clientName: entry.client_name,
          clientColor: entry.client_color,
          entries: [],
          totalMinutes: 0,
        };
        map.set(entry.client_id, group);
      }
      group.entries.push(entry);
      group.totalMinutes += entry.duration;
    }
    return Array.from(map.values());
  }, [entries]);

  const handleEdit = (entry: TrackingEntryWithDetails) => {
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
        date={today}
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

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Aujourd'hui</h2>
          <div className={styles.date}>{formatDate(today)}</div>
        </div>
        <div className={styles.total}>{formatDuration(totalMinutes)} · {formatDays(totalMinutes)}</div>
      </div>

      <button className={styles.addButton} onClick={() => setShowForm(true)}>
        <IconPlus size={14} /> Ajouter une entrée
      </button>

      {loading ? null : entries.length === 0 ? (
        <EmptyState icon={<IconClock size={32} />} message="Aucune entrée aujourd'hui. Commencez à tracker !" />
      ) : (
        groups.map((group) => (
          <div key={group.clientId} className={styles.clientGroup}>
            <div className={styles.clientHeader}>
              <span className={styles.clientDot} style={{ backgroundColor: group.clientColor }} />
              <span className={styles.clientName}>{group.clientName}</span>
              <span className={styles.clientTotal}>{formatDuration(group.totalMinutes)}</span>
            </div>
            {group.entries.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <div className={styles.entryInfo}>
                  <div className={styles.entryProject}>{entry.project_name}</div>
                  {entry.description && (
                    <div className={styles.entryDescription}>{entry.description}</div>
                  )}
                </div>
                <div className={styles.entryDuration}>{formatDuration(entry.duration)}</div>
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
