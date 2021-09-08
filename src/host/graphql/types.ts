import { Request, Response } from "express";
import { IAuthService } from "../../services.contracts/auth/IAuthService";

export type Context = {
	request: Request;
	response: Response;
	authService: IAuthService;
};
