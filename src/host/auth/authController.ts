import { Express } from "express";
import { IAuthService } from "../../services.contracts/auth/IAuthService";
import { User } from "../../entities/User";
import {
	cookieName,
	createAuthMiddleware,
	jwtVerifyPromise,
} from "./authConfig";
import { sendRefreshToken } from "./sendRefreshToken";
import { createAccessToken } from "./createAccessToken";

declare global {
	namespace Express {
		interface Request {
			user: User | undefined;
			isAuthenticated: boolean;
		}
	}
}

export const authCtrl = (app: Express, authService: IAuthService) => {
	const authMiddleware = createAuthMiddleware({}, authService);

	app.get("/", function (_, res) {
		res.send("hello world");
	});

	app.post("/revoke_refresh_token", authMiddleware, async (req, res) => {
		if (!req.isAuthenticated || !req.user) {
			return res.sendStatus(401);
		}

		try {
			const result = await authService.increamentTokenVersion(req.user.id);
			return res.send(result);
		} catch (err) {
			console.log(err);
			return res.sendStatus(500);
		}
	});

	app.post("/refresh_token", async (req, res) => {
		const token = req.cookies[cookieName];
		if (!token) {
			return res.status(400).send({ ok: false, accessToken: "" });
		}

		let payload: any = null;
		try {
			payload = await jwtVerifyPromise(
				token,
				process.env.REFRESH_TOKEN_SECRET!
			);
		} catch (err) {
			console.log(err);
			return res.send({ ok: false, accessToken: "" });
		}

		// token is valid and
		// we can send back an access token
		const user = await authService.getById(payload.userId);

		if (!user) {
			return res.send({ ok: false, accessToken: "" });
		}

		if (user.tokenVersion !== payload.tokenVersion) {
			return res.send({ ok: false, accessToken: "" });
		}

		sendRefreshToken(user, res);

		return res.send({ ok: true, accessToken: await createAccessToken(user) });
	});
};
