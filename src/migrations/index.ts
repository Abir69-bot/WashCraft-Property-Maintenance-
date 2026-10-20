import * as migration_20261020_184437_initial from './20261020_184437_initial';
import * as migration_20261020_203319_content_model from './20261020_203319_content_model';

export const migrations = [
  {
    up: migration_20261020_184437_initial.up,
    down: migration_20261020_184437_initial.down,
    name: '20261020_184437_initial',
  },
  {
    up: migration_20261020_203319_content_model.up,
    down: migration_20261020_203319_content_model.down,
    name: '20261020_203319_content_model'
  },
];
