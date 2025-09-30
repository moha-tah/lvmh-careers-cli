import { config } from '../config/index.js';

export function getConfigDir(): string {
  return config.path.replace('/config.json', '');
}
