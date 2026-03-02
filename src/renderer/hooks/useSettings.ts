import { useCallback, useEffect, useState } from 'react';
import type { Settings } from '../../shared/types';

const defaultSettings: Settings = {
  time_format: 'hhmm',
  hours_per_day: 7,
  currency: 'EUR',
  launch_at_login: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await window.horabar.settings.getAll();
    setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    await window.horabar.settings.set(key, value);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, loading, refresh, updateSetting };
}
