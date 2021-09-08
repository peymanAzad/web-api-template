import { User } from "../../entities/User";
import { jwtSignPromise } from "./authConfig";

export const createAccessToken = async (user: User) => {
	return jwtSignPromise({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
	});
};
