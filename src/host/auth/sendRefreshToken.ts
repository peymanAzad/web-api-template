import { Response } from "express";
import { User } from "../../entities/User";
import { cookieName, jwtSignPromise } from "./authConfig";

export const sendRefreshToken = async (user: User, res: Response) => {
	const token = await jwtSignPromise(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_TOKEN_SECRET!,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
		}
	);
	res.cookie(cookieName, token, {
		httpOnly: true,
		path: "/refresh_token",
	});
};
