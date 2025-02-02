// Sequelize CLI Wrapper for ES Module Compatibility
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'path';

const execAsync = promisify(exec);

const command = process.argv[2];
const specificFile = process.argv[3];

// Dynamic import handler
async function loadESM(modulePath) {
  try {
    const module = await import(modulePath);
    return module.default || module;
  } catch (error) {
    console.error(`Error loading module ${modulePath}:`, error);
    process.exit(1);
  }
}

// Migration wrapper
async function runMigrations() {
  try {
    const sequelizeConfig = await loadESM('./config/config.js');
    const umzug = (await import('umzug')).default;
    
    const migrator = new umzug({
      migrations: {
        glob: ['migrations/*.js', { cwd: process.cwd() }],
      },
      context: sequelizeConfig.development,
      storage: 'sequelize',
      storageOptions: {
        sequelize: await loadESM('./src/db/db.js'),
      },
      logger: console,
    });

    if (specificFile) {
      console.log(`Running specific migration: ${specificFile}`);
      await migrator.up({ migrations: [specificFile] });
    } else {
      console.log('Running all pending migrations...');
      await migrator.up();
    }
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Seeder wrapper
async function runSeeders() {
  try {
    const sequelizeConfig = await loadESM('./config/config.js');
    const umzug = (await import('umzug')).default;
    
    const seeder = new umzug({
      migrations: {
        glob: ['seeders/*.js', { cwd: process.cwd() }],
      },
      context: sequelizeConfig.development,
      storage: 'sequelize',
      storageOptions: {
        sequelize: await loadESM('./src/db/db.js'),
      },
      logger: console,
    });

    if (specificFile) {
      console.log(`Running specific seeder: ${specificFile}`);
      await seeder.up({ migrations: [specificFile] });
    } else {
      console.log('Running all seeders...');
      await seeder.up();
    }
    console.log('Seeders completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    if (command === 'runMigrations') {
      await runMigrations();
    } else if (command === 'runSeeders') {
      await runSeeders();
    } else {
      console.error('Invalid command. Use: runMigrations or runSeeders');
      process.exit(1);
    }
  } catch (error) {
    console.error('Execution failed:', error);
    process.exit(1);
  }
}

main();