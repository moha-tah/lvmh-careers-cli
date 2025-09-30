import { config } from './index.js';

export function isConfigValid(): boolean {
  try {
    const locale = config.get('locale');
    return (
      config.has('locale') &&
      locale !== undefined &&
      locale !== null &&
      typeof locale === 'string' &&
      locale.length > 0
    );
  } catch {
    return false;
  }
}
