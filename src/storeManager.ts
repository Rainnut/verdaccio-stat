import { createConnection, EntityTarget } from "typeorm";

async function getConnection () {
  return await createConnection({
    "type": "sqlite",
    "database": "/Users/zer/.config/verdaccio/database.sqlite",
    "synchronize": true,
    "logging": false,
    "entities": [
      __dirname + "/entity/*.js"
    ],});
}
const connection = getConnection();

export default async (target: EntityTarget<any>) => {
  const conn = await connection;
  return conn.getRepository(target);
};