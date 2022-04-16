import { Sequelize } from "sequelize";

import defineModels from "./models/defineModels.js";

const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 5432;

const {
	PGHOST: host,
	PGPORT: port,
	PGDATABASE: databaseName,
	PGUSER: user,
	PGPASSWORD: password
} = process.env;

const DATABASE_URI = `postgres://${user}:${password}@${host || DEFAULT_HOST}:${port || DEFAULT_PORT}/${databaseName}`;
const SEQUELIZE_OPTIONS = {};

const sequelize = new Sequelize(DATABASE_URI, SEQUELIZE_OPTIONS);

await sequelize.authenticate();

const { Section, Professor } = defineModels(sequelize);

await sequelize.sync();

export { Section, Professor };
