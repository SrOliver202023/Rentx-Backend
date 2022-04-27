const dotenv = require('dotenv');
dotenv.config();

const rootDir = process.env.ENV_IN === 'DEV' ? './src' : './dist';
const extension = process.env.ENV_IN === 'DEV' ? '.ts' : '.js';

module.exports = {
  "type": "postgres",
  "port": process.env.DB_PORT,
  "host": process.env.DB_HOST,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "migrations": [
    `${rootDir}/shared/infra/typeorm/migrations/*${extension}`
  ],
  "entities": [
    `${rootDir}/modules/**/entities/*${extension}`
  ],
  "cli": {
    "migrationsDir": `${rootDir}/shared/infra/typeorm/migrations`
  }
};