import * as migration_20260604_211707 from './20260604_211707';
import * as migration_20260604_232155 from './20260604_232155';
import * as migration_20260605_160310 from './20260605_160310';

export const migrations = [
  {
    up: migration_20260604_211707.up,
    down: migration_20260604_211707.down,
    name: '20260604_211707'
  },
  {
    up: migration_20260604_232155.up,
    down: migration_20260604_232155.down,
    name: '20260604_232155'
  },
  {
    up: migration_20260605_160310.up,
    down: migration_20260605_160310.down,
    name: '20260605_160310'
  },
];
