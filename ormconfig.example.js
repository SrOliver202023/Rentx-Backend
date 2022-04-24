const dotenv = require('dotenv');
dotenv.config();

const rootDir = process.ENV_IN === 'DEV' ? './src' : './dist';
const extension = process.ENV_IN === 'DEV' ? '.ts' : '.js';
console.log(`Environments: ${process.env.ENV_IN}`);

module.exports = {
  "type": "postgres",
  "port": 5432,
  "host": "localhost",
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