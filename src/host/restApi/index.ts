import { Express } from "express";
import express from "express";
import { IAuthService } from "../../services.contracts/auth/IAuthService";
import authRouter from "./routers/authRouter";

const main = (app: Express, authService: IAuthService) => {
	app.use(express.json());
	app.use("/rest", authRouter(authService));
	return app;
};

export default main;
