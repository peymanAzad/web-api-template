import express from "express";
import { cookieName, createAuthMiddleware } from "../../auth/authConfig";
import { createAccessToken } from "../../auth/createAccessToken";
import { sendRefreshToken } from "../../auth/sendRefreshToken";
import { ErrorResponse } from "../types/errorResponse";
import { IAuthService } from "../../../services.contracts/auth/IAuthService";
import { loginSchema, registerSchema } from "../schemas/userSchema";
import { userMap } from "../tools/userMap";

const router = express.Router();

const main = (authService: IAuthService) => {
	const authMiddleware = createAuthMiddleware({}, authService);

	router.post("/register", async (req, res) => {
		try {
			const userInput = await registerSchema.validate(req.body, {
				abortEarly: false,
			});
			const exists = await authService.getByUsername(userInput.username);
			if (exists) {
				const errors: ErrorResponse = {
					errors: [
						{
							filed: "username",
							message: "username is already taken",
						},
					],
				};
				return res.send(errors);
			}
			try {
				const user = await authService.register(userInput);
				const access_token = await createAccessToken(user);
				await sendRefreshToken(user, res);

				return res.send({
					...userMap(user),
					access_token,
				});
			} catch (error) {
				console.error(error);
				return res.sendStatus(500);
			}
		} catch (err) {
			return res.send({ errors: err.errors });
		}
	});

	router.get("/login", authMiddleware, (req, res) => {
		if (!req.isAuthenticated || !req.user) return res.sendStatus(401);
		return res.send(userMap(req.user));
	});

	router.post("/login", async (req, res) => {
		try {
			const userInput = await loginSchema.validate(req.body, {
				abortEarly: false,
			});
			const user = await authService.login(userInput);
			if (!user) {
				const response: ErrorResponse = {
					errors: [{ filed: "error", message: "invalid username or password" }],
				};
				return res.send(response);
			}
			const access_token = await createAccessToken(user);
			await sendRefreshToken(user, res);
			return res.send({ access_token });
		} catch (err) {
			return res.send({ errors: err.errors });
		}
	});

	router.delete("/login", (_, res) => {
		res.clearCookie(cookieName, { path: "/refresh_token" });
		res.sendStatus(200);
	});

	return router;
};

export default main;
