import * as migration_20261020_184437_initial from './20261020_184437_initial';
import * as migration_20261020_203319_content_model from './20261020_203319_content_model';
import * as migration_20261020_213016_home_photos from './20261020_213016_home_photos';
import * as migration_20261021_083356_phase4_templates from './20261021_083356_phase4_templates';
import * as migration_20261021_110721_phase5_quote_system from './20261021_110721_phase5_quote_system';
import * as migration_20261021_110741_phase5_lead_files from './20261021_110741_phase5_lead_files';

export const migrations = [
  {
    up: migration_20261020_184437_initial.up,
    down: migration_20261020_184437_initial.down,
    name: '20261020_184437_initial',
  },
  {
    up: migration_20261020_203319_content_model.up,
    down: migration_20261020_203319_content_model.down,
    name: '20261020_203319_content_model',
  },
  {
    up: migration_20261020_213016_home_photos.up,
    down: migration_20261020_213016_home_photos.down,
    name: '20261020_213016_home_photos',
  },
  {
    up: migration_20261021_083356_phase4_templates.up,
    down: migration_20261021_083356_phase4_templates.down,
    name: '20261021_083356_phase4_templates',
  },
  {
    up: migration_20261021_110721_phase5_quote_system.up,
    down: migration_20261021_110721_phase5_quote_system.down,
    name: '20261021_110721_phase5_quote_system',
  },
  {
    up: migration_20261021_110741_phase5_lead_files.up,
    down: migration_20261021_110741_phase5_lead_files.down,
    name: '20261021_110741_phase5_lead_files'
  },
];
