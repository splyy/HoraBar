import { useSettings } from './useSettings';

export function useFormatDuration() {
  const { settings } = useSettings();

  return (minutes: number): string => {
    if (settings.time_format === 'decimal') {
      return (minutes / 60).toFixed(2) + 'h';
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m.toString().padStart(2, '0')}`;
  };
}

export function useFormatDays() {
  const { settings } = useSettings();

  return (minutes: number): string => {
    const days = minutes / (settings.hours_per_day * 60);
    if (Number.isInteger(days) || Math.abs(days - Math.round(days)) < 0.01) {
      return `${Math.round(days)}j`;
    }
    return `${days.toFixed(1)}j`;
  };
}

export function formatDurationHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

export function formatDurationDecimal(minutes: number): string {
  return (minutes / 60).toFixed(2) + 'h';
}
