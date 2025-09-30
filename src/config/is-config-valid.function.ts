import { config } from './index.js';

export function isConfigValid(): boolean {
  try {
    return config.has('locale') && config.get('locale') !== undefined;
  } catch {
    return false;
  }
}
