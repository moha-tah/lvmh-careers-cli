import Conf from 'conf';

import { ConfigSchema, configSchema } from './schema.js';

export const config = new Conf<ConfigSchema>({
  projectName: 'lvmh-careers-cli',
  schema: configSchema,
});
