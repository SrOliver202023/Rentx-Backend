const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "type": "postgres",
  "port": 5432,
  "host": process.env.NODE_ENV_HOST,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "migrations": [
    "./src/shared/infra/typeorm/migrations/*.ts"
  ],
  "entities": [
    "./src/modules/**/entities/*.ts"
  ],
  "cli": {
    "migrationsDir": "./src/shared/infra/typeorm/migrations"
  }
};