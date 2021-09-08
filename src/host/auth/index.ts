import { Express } from "express";
import cookieParser from "cookie-parser";
import { IAuthService } from "../../services.contracts/auth/IAuthService";
import { authCtrl } from "./authController";

const main = (app: Express, authService: IAuthService) => {
	app.use(cookieParser());

	authCtrl(app, authService);
};

export default main;
