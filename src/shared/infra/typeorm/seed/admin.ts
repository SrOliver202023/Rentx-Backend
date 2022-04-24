import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import createConnection from '../index';

async function create() {
  const connection = await createConnection(process.env.NODE_ENV_HOST);

  const id = uuidv4();
  const password = await hash(process.env.APP_PASSWORD_ADMIN, 8);

  await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    VALUES ('${id}', ${process.env.APP_ADMIN}, 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXXXXX')
  `);

  await connection.close();
}

create().then(() => console.log("User admin created!"));