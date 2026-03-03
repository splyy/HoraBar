import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormatDuration, useFormatDays } from '../../hooks/useFormatDuration';
import { useSettings } from '../../hooks/useSettings';
import { EmptyState } from '../common/EmptyState';
import { Select } from '../common/Select';
import { IconChart } from '../common/Icons';
import type { StatEntry } from '@/shared/types';
import styles from './Stats.module.css';

type PeriodKey = 'this_week' | 'this_month' | 'this_year' | 'last_month' | 'last_year';

function getPeriodRange(key: PeriodKey): { start: string; end: string } {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  switch (key) {
    case 'this_week': {
      const d = new Date(now);
      const day = d.getDay();
      const diff = day === 0 ? 6 : day - 1;
      d.setDate(d.getDate() - diff);
      const start = fmt(d);
      d.setDate(d.getDate() + 6);
      return { start, end: fmt(d) };
    }
    case 'this_month':
      return {
        start: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
        end: fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
      };
    case 'this_year':
      return { start: `${now.getFullYear()}-01-01`, end: `${now.getFullYear()}-12-31` };
    case 'last_month':
      return {
        start: fmt(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        end: fmt(new Date(now.getFullYear(), now.getMonth(), 0)),
      };
    case 'last_year':
      return { start: `${now.getFullYear() - 1}-01-01`, end: `${now.getFullYear() - 1}-12-31` };
  }
}

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: 'this_week', label: 'Cette semaine' },
  { key: 'this_month', label: 'Ce mois' },
  { key: 'this_year', label: 'Cette année' },
  { key: 'last_month', label: 'Mois dernier' },
  { key: 'last_year', label: 'Année dernière' },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
};

interface ClientStats {
  clientId: number;
  clientName: string;
  clientColor: string;
  dailyRate: number | null;
  totalMinutes: number;
  revenue: number | null;
  projects: { projectId: number; projectName: string; totalMinutes: number }[];
}

export function Stats() {
  const [periodKey, setPeriodKey] = useState<PeriodKey>('this_week');
  const [stats, setStats] = useState<StatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const formatDuration = useFormatDuration();
  const formatDays = useFormatDays();
  const { settings } = useSettings();

  const currencySymbol = CURRENCY_SYMBOLS[settings.currency] ?? '€';

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const { start, end } = getPeriodRange(periodKey);
    const data = await window.kronobar.tracking.getStats(start, end);
    setStats(data);
    setLoading(false);
  }, [periodKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const clientStats = useMemo<ClientStats[]>(() => {
    const map = new Map<number, ClientStats>();
    for (const s of stats) {
      let cs = map.get(s.client_id);
      if (!cs) {
        cs = {
          clientId: s.client_id,
          clientName: s.client_name,
          clientColor: s.client_color,
          dailyRate: s.daily_rate,
          totalMinutes: 0,
          revenue: null,
          projects: [],
        };
        map.set(s.client_id, cs);
      }
      cs.totalMinutes += s.total_minutes;
      cs.projects.push({
        projectId: s.project_id,
        projectName: s.project_name,
        totalMinutes: s.total_minutes,
      });
    }
    // Calculate revenue: (minutes / (hours_per_day * 60)) * daily_rate
    for (const cs of map.values()) {
      if (cs.dailyRate) {
        cs.revenue = (cs.totalMinutes / (settings.hours_per_day * 60)) * cs.dailyRate;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalMinutes - a.totalMinutes);
  }, [stats, settings.hours_per_day]);

  const totalMinutes = clientStats.reduce((sum, c) => sum + c.totalMinutes, 0);
  const totalRevenue = clientStats.reduce((sum, c) => sum + (c.revenue ?? 0), 0);
  const maxClientMinutes = Math.max(...clientStats.map((c) => c.totalMinutes), 1);

  return (
    <div>
      <div className={styles.header}>
        <h2>Statistiques</h2>
        <Select
          size="sm"
          value={periodKey}
          onValueChange={(v) => setPeriodKey(v as PeriodKey)}
          options={PERIOD_OPTIONS.map((o) => ({ value: o.key, label: o.label }))}
        />
      </div>

      {loading ? null : clientStats.length === 0 ? (
        <EmptyState icon={<IconChart size={32} />} message="Aucune donnée pour cette période" />
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Temps total</div>
              <div className={`${styles.cardValue} ${styles.cardAccent}`}>
                {formatDuration(totalMinutes)}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Jours travaillés</div>
              <div className={styles.cardValue}>
                {formatDays(totalMinutes)}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Revenu</div>
              <div className={`${styles.cardValue} ${styles.cardSuccess}`}>
                {totalRevenue > 0 ? `${totalRevenue.toFixed(0)}${currencySymbol}` : '—'}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Clients / Projets</div>
              <div className={styles.cardValue}>{clientStats.length} / {new Set(stats.map(s => s.project_id)).size}</div>
            </div>
          </div>

          <div className={styles.sectionTitle}>Par client</div>
          {clientStats.map((cs) => (
            <div key={cs.clientId} className={styles.clientBlock}>
              <div className={styles.clientRow}>
                <span className={styles.clientDot} style={{ backgroundColor: cs.clientColor }} />
                <span className={styles.clientName}>{cs.clientName}</span>
                <span className={styles.clientHours}>{formatDuration(cs.totalMinutes)}</span>
                {cs.revenue !== null && (
                  <span className={styles.clientRevenue}>
                    {cs.revenue.toFixed(0)}{currencySymbol}
                  </span>
                )}
              </div>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${(cs.totalMinutes / maxClientMinutes) * 100}%`,
                    backgroundColor: cs.clientColor,
                  }}
                />
              </div>
              {cs.projects.map((p) => (
                <div key={p.projectId} className={styles.projectRow}>
                  <span className={styles.projectName}>{p.projectName}</span>
                  <span className={styles.projectHours}>{formatDuration(p.totalMinutes)}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
