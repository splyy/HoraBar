import type { KronoBarAPI } from './shared/types';

declare global {
  interface Window {
    kronobar: KronoBarAPI;
  }
}
