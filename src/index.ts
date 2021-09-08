import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import createApp from "./host/app";

const main = async () => {
	const conn = await createConnection();
	await conn.runMigrations();

	const port = Number(process.env.PORT) || 4000;
	await createApp(port);
};

main();
