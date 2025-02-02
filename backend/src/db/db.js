import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '../../config/config.json');
const config = JSON.parse(await import('fs').then(fs => fs.promises.readFile(configPath, 'utf8')));

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize({
  ...dbConfig,
  storage: path.join(__dirname, '../../', dbConfig.storage),
  logging: false
});

export default sequelize;
