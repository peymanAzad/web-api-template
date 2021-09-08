import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../services.contracts/auth/IAuthService";
import jwt from "jsonwebtoken";

export const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "jid";

interface authMiddlewareOptions {
	successRedirect?: string;
	failureRedirect?: string;
}

export const jwtVerifyPromise = (
	token: string,
	secret: string,
	options?: jwt.VerifyOptions
) =>
	new Promise<jwt.JwtPayload | undefined>((res, rej) => {
		jwt.verify(token, secret, options, (err, payload) => {
			if (err) rej(err);
			else res(payload);
		});
	});

export const jwtSignPromise = (
	payload: Object,
	secret: string,
	options: jwt.SignOptions
) =>
	new Promise<string | undefined>((res, rej) => {
		if (payload) {
			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					rej(err);
				}
				res(token);
			});
		} else rej("invalid payload");
	});

export const authenticateRequest = async (
	req: Request,
	authService: IAuthService
) => {
	req.isAuthenticated = false;
	const authorization = req.headers["authorization"];
	if (!authorization) return false;

	try {
		const token = authorization.split(" ")[1];
		const payload = await jwtVerifyPromise(
			token,
			process.env.ACCESS_TOKEN_SECRET!
		);
		if (!payload) return false;
		const user = await authService.getById(payload.userId);
		if (!user) return false;
		req.user = user;
		req.isAuthenticated = true;
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const createAuthMiddleware =
	(options: authMiddlewareOptions, authService: IAuthService) =>
	(req: Request, res: Response, next: NextFunction) => {
		const fail = () =>
			options.failureRedirect ? res.redirect(options.failureRedirect) : next();
		req.isAuthenticated = false;
		authenticateRequest(req, authService)
			.then((result) => {
				if (result) return next();
				else return fail();
			})
			.catch(() => {
				return fail();
			});
	};
