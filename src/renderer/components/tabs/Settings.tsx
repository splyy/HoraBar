import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useClients } from '../../hooks/useClients';
import { useProjects } from '../../hooks/useProjects';
import { IconPencil, IconArchive, IconUnarchive, IconPlus } from '../common/Icons';
import { Select } from '../common/Select';
import { Tooltip } from '../common/Tooltip';
import type { Client, ClientInput, Project, ProjectInput } from '@/shared/types';
import styles from './Settings.module.css';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
const CURRENCIES = [
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'GBP', label: 'GBP (£)' },
];

type SubTab = 'general' | 'clients' | 'projects';

export function Settings() {
  const [subTab, setSubTab] = useState<SubTab>('general');
  const { settings, updateSetting } = useSettings();
  const { clients, create: createClient, update: updateClient, archive: archiveClient, unarchive: unarchiveClient, refresh: refreshClients } = useClients(true);
  const { projects, create: createProject, update: updateProject, archive: archiveProject, unarchive: unarchiveProject } = useProjects(undefined, true);

  return (
    <div className={styles.settings}>
      <h2>Réglages</h2>

      <div className={styles.subTabs}>
        {([
          { id: 'general', label: 'Général' },
          { id: 'clients', label: 'Clients' },
          { id: 'projects', label: 'Projets' },
        ] as { id: SubTab; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            className={`${styles.subTab} ${subTab === tab.id ? styles.subTabActive : ''}`}
            onClick={() => setSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'general' && (
        <GeneralSection settings={settings} updateSetting={updateSetting} />
      )}

      {subTab === 'clients' && (
        <ClientsSection
          clients={clients}
          onCreate={createClient}
          onUpdate={updateClient}
          onArchive={archiveClient}
          onUnarchive={unarchiveClient}
        />
      )}

      {subTab === 'projects' && (
        <ProjectsSection
          clients={clients.filter((c) => !c.archived_at)}
          projects={projects}
          onCreate={async (input) => {
            await createProject(input);
            await refreshClients();
          }}
          onUpdate={updateProject}
          onArchive={archiveProject}
          onUnarchive={unarchiveProject}
        />
      )}
    </div>
  );
}

// --- General Section ---
function GeneralSection({ settings, updateSetting }: {
  settings: ReturnType<typeof useSettings>['settings'];
  updateSetting: ReturnType<typeof useSettings>['updateSetting'];
}) {
  return (
    <div className={styles.section}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Format du temps</span>
        <div className={styles.rowValue}>
          <Select
            size="sm"
            value={settings.time_format}
            onValueChange={(v) => updateSetting('time_format', v as 'hhmm' | 'decimal')}
            options={[
              { value: 'hhmm', label: 'HH:MM' },
              { value: 'decimal', label: 'Décimal' },
            ]}
          />
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabel}>Devise</span>
        <div className={styles.rowValue}>
          <Select
            size="sm"
            value={settings.currency}
            onValueChange={(v) => updateSetting('currency', v)}
            options={CURRENCIES}
          />
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabel}>Heures par jour</span>
        <div className={styles.rowValue}>
          <input
            type="number"
            className={styles.smallInput}
            value={settings.hours_per_day}
            min={1}
            max={24}
            onChange={(e) => updateSetting('hours_per_day', parseInt(e.target.value) || 7)}
          />
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.rowLabel}>Lancer au démarrage</span>
        <div className={styles.rowValue}>
          <button
            className={`${styles.toggle} ${settings.launch_at_login ? styles.toggleActive : ''}`}
            onClick={() => updateSetting('launch_at_login', !settings.launch_at_login)}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Clients Section ---
function ClientsSection({ clients, onCreate, onUpdate, onArchive, onUnarchive }: {
  clients: Client[];
  onCreate: (input: ClientInput) => Promise<Client>;
  onUpdate: (id: number, input: ClientInput) => Promise<Client>;
  onArchive: (id: number) => Promise<void>;
  onUnarchive: (id: number) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleSave = async (input: ClientInput) => {
    if (editingClient) {
      await onUpdate(editingClient.id, input);
    } else {
      await onCreate(input);
    }
    setShowForm(false);
    setEditingClient(null);
  };

  return (
    <div className={styles.section}>
      <div className={styles.itemList}>
        {clients.map((client) => (
          <div key={client.id} className={`${styles.item} ${client.archived_at ? styles.itemArchived : ''}`}>
            <span className={styles.itemDot} style={{ backgroundColor: client.color }} />
            <div className={styles.itemInfo}>
              <div className={styles.itemName}>{client.name}</div>
              {client.daily_rate && (
                <div className={styles.itemDetail}>{client.daily_rate}€/j</div>
              )}
            </div>
            <div className={styles.itemActions}>
              <Tooltip content="Modifier">
                <button
                  className={styles.iconBtn}
                  onClick={() => { setEditingClient(client); setShowForm(true); }}
                >
                  <IconPencil size={13} />
                </button>
              </Tooltip>
              <Tooltip content={client.archived_at ? 'Désarchiver' : 'Archiver'}>
                <button
                  className={styles.iconBtn}
                  onClick={() => client.archived_at ? onUnarchive(client.id) : onArchive(client.id)}
                >
                  {client.archived_at ? <IconUnarchive size={13} /> : <IconArchive size={13} />}
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <ClientForm
          client={editingClient}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingClient(null); }}
        />
      ) : (
        <button className={styles.addItemBtn} onClick={() => setShowForm(true)}>
          <IconPlus size={14} /> Ajouter un client
        </button>
      )}
    </div>
  );
}

function ClientForm({ client, onSave, onCancel }: {
  client: Client | null;
  onSave: (input: ClientInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(client?.name ?? '');
  const [color, setColor] = useState(client?.color ?? COLORS[0]);
  const [dailyRate, setDailyRate] = useState(client?.daily_rate?.toString() ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSave({
      name: name.trim(),
      color,
      daily_rate: dailyRate ? parseFloat(dailyRate) : null,
    });
  };

  return (
    <form className={styles.inlineForm} onSubmit={handleSubmit}>
      <div className={styles.inlineFormRow}>
        <div className={styles.colorPresets}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.colorChip} ${color === c ? styles.colorChipActive : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
          <Tooltip content="Couleur personnalisée">
            <input
              type="color"
              className={styles.colorInput}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </Tooltip>
        </div>
      </div>
      <div className={styles.inlineFormRow}>
        <input
          className={styles.inlineInput}
          placeholder="Nom du client"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className={styles.inlineFormRow}>
        <input
          className={styles.inlineInput}
          type="number"
          step="0.01"
          placeholder="TJM (optionnel)"
          value={dailyRate}
          onChange={(e) => setDailyRate(e.target.value)}
        />
      </div>
      <div className={styles.inlineFormActions}>
        <button type="button" className={`${styles.btnSm} ${styles.btnGhost}`} onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className={`${styles.btnSm} ${styles.btnPrimary}`} disabled={!name.trim()}>
          {client ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}

// --- Projects Section ---
function ProjectsSection({ clients, projects, onCreate, onUpdate, onArchive, onUnarchive }: {
  clients: Client[];
  projects: Project[];
  onCreate: (input: ProjectInput) => Promise<void>;
  onUpdate: (id: number, input: ProjectInput) => Promise<Project>;
  onArchive: (id: number) => Promise<void>;
  onUnarchive: (id: number) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleSave = async (input: ProjectInput) => {
    if (editingProject) {
      await onUpdate(editingProject.id, input);
    } else {
      await onCreate(input);
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const clientMap = new Map(clients.map((c) => [c.id, c]));

  return (
    <div className={styles.section}>
      <div className={styles.itemList}>
        {projects.map((project) => {
          const client = clientMap.get(project.client_id);
          return (
            <div key={project.id} className={`${styles.item} ${project.archived_at ? styles.itemArchived : ''}`}>
              <span className={styles.itemDot} style={{ backgroundColor: client?.color ?? '#999' }} />
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{project.name}</div>
                <div className={styles.itemDetail}>{client?.name ?? 'Client inconnu'}</div>
              </div>
              <div className={styles.itemActions}>
                <Tooltip content="Modifier">
                  <button
                    className={styles.iconBtn}
                    onClick={() => { setEditingProject(project); setShowForm(true); }}
                  >
                    <IconPencil size={13} />
                  </button>
                </Tooltip>
                <Tooltip content={project.archived_at ? 'Désarchiver' : 'Archiver'}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => project.archived_at ? onUnarchive(project.id) : onArchive(project.id)}
                  >
                    {project.archived_at ? <IconUnarchive size={13} /> : <IconArchive size={13} />}
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>

      {showForm ? (
        <ProjectForm
          clients={clients}
          project={editingProject}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProject(null); }}
        />
      ) : (
        <button className={styles.addItemBtn} onClick={() => setShowForm(true)} disabled={clients.length === 0}>
          <IconPlus size={14} /> Ajouter un projet
        </button>
      )}
    </div>
  );
}

function ProjectForm({ clients, project, onSave, onCancel }: {
  clients: Client[];
  project: Project | null;
  onSave: (input: ProjectInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [clientId, setClientId] = useState<number | ''>(project?.client_id ?? (clients[0]?.id ?? ''));
  const [name, setName] = useState(project?.name ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientId) return;
    await onSave({
      client_id: clientId as number,
      name: name.trim(),
    });
  };

  return (
    <form className={styles.inlineForm} onSubmit={handleSubmit}>
      <div className={styles.inlineFormRow}>
        <Select
          value={String(clientId)}
          onValueChange={(v) => setClientId(v ? parseInt(v) : '')}
          options={clients.map((c) => ({ value: String(c.id), label: c.name }))}
          placeholder="Client"
          className={styles.flexOne}
        />
      </div>
      <div className={styles.inlineFormRow}>
        <input
          className={styles.inlineInput}
          placeholder="Nom du projet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className={styles.inlineFormActions}>
        <button type="button" className={`${styles.btnSm} ${styles.btnGhost}`} onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className={`${styles.btnSm} ${styles.btnPrimary}`} disabled={!name.trim() || !clientId}>
          {project ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
