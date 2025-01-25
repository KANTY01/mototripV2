import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const { database, username, password, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false
});

const modelFiles = fs.readdirSync(__dirname)
  .filter(file => 
    file !== 'index.js' &&
    file.endsWith('.js') &&
    !file.includes('.test.js')
  );

const models = {};
for (const file of modelFiles) {
  const { default: model } = await import(`./${file}`);
  const createdModel = model(sequelize, Sequelize);
  models[createdModel.name] = createdModel;
}

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export default models;
