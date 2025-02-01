// Sequelize CLI Wrapper for ES Module Compatibility
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// Dynamic import handler
async function loadESM(modulePath) {
  const module = await import(modulePath);
  return module.default || module;
}

// Migration wrapper
export async function runMigrations() {
  const sequelizeConfig = await loadESM('../config/config.js');
  const umzug = (await import('umzug')).default;
  
  const migrator = new umzug({
    migrations: {
      glob: ['migrations/*.js', { cwd: process.cwd() }],
    },
    context: sequelizeConfig.development,
    storage: 'sequelize',
    storageOptions: {
      sequelize: await loadESM('../db/db.js'),
    },
    logger: console,
  });

  await migrator.up();
}

// Seeder wrapper
export async function runSeeders() {
  const sequelizeConfig = await loadESM('../config/config.js');
  const umzug = (await import('umzug')).default;
  
  const seeder = new umzug({
    migrations: {
      glob: ['seeders/*.js', { cwd: process.cwd() }],
    },
    context: sequelizeConfig.development,
    storage: 'sequelize',
    storageOptions: {
      sequelize: await loadESM('../db/db.js'),
    },
    logger: console,
  });

  await seeder.up();
}