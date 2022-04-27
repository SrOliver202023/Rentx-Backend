import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import createConnection from '../index';

async function create() {
  const connection = await createConnection();

  const id = uuidv4();
  const password = await hash(String(process.env.APP_PASSWORD_ADMIN), 8);

  await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    VALUES ('${id}', '${process.env.APP_NAME_ADMIN}', '${process.env.APP_EMAIL_ADMIN}', '${password}', true, 'now()', 'XXXXXXXXX')
  `);

  await connection.close();
}

create().then(() => console.log("User admin created!"));