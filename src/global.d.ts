import type { HoraBarAPI } from './shared/types';

declare global {
  interface Window {
    horabar: HoraBarAPI;
  }
}
