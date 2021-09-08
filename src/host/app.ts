import express from "express";
import { AuthService } from "../services/authService";
import graphqlApi from "./graphql";
import restApi from "./restApi";
import auth from "./auth";

const createApp = async (port: number) => {
	const app = express();
	const authService = new AuthService();

	await auth(app, authService);
	await graphqlApi(app, authService);
	await restApi(app, authService);

	app.listen(port, () => {
		console.log("server listens on ", port);
	});

	return app;
};
export default createApp;
