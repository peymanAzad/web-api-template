import { cookieName } from "../../auth/authConfig";
import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { UserResponse } from "../outputTypes/userResponse";
import { Context } from "../types";
import { User } from "../../../entities/User";
import { RegisterInput, UserInput } from "../inputTypes/userInput";
import { validateInput } from "../tools/validator";
import { createAccessToken } from "../../auth/createAccessToken";
import { sendRefreshToken } from "../../auth/sendRefreshToken";
import { isAuthMiddleware } from "../middlewars/isAuth";

@Resolver(User)
export class UserResolver {
	@Query(() => UserResponse)
	@UseMiddleware(isAuthMiddleware)
	async me(@Ctx() { request }: Context) {
		return { user: request.user };
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg("registerInput", () => RegisterInput!) registerInput: RegisterInput,
		@Ctx() context: Context
	) {
		const errors = await validateInput(registerInput);
		if (registerInput.password !== registerInput.confirmPassword) {
			errors.push({
				field: "confirm password",
				message: "confirm password not match password",
			});
		}
		if (errors.length > 0) {
			return { errors };
		}

		const existUser = await context.authService.getByUsername(
			registerInput.username
		);
		if (existUser) {
			errors.push({
				field: "username",
				message: "the username is already taken",
			});
			return { errors };
		}

		try {
			const user = await context.authService.register(registerInput);
			const access_token = await createAccessToken(user);
			await sendRefreshToken(user, context.response);

			return { user, access_token };
		} catch (error) {
			//do some logging stuff
			throw new Error("internal server error");
		}
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("userInput", () => UserInput!) userInput: UserInput,
		@Ctx() context: Context
	): Promise<UserResponse> {
		const errors = await validateInput(userInput);
		if (errors.length > 0) {
			return { errors };
		}
		try {
			const user = await context.authService.login({
				username: userInput.username,
				password: userInput.password,
			});
			if (!user) {
				errors.push({
					field: "error",
					message: "invalid username or password",
				});
				return { errors };
			}
			const access_token = await createAccessToken(user);
			await sendRefreshToken(user, context.response);

			return { user, access_token };
		} catch (error) {
			errors.push({
				field: "error",
				message: error.message || "internal server error",
			});
			return { errors };
		}
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { response }: Context) {
		response.clearCookie(cookieName, { path: "/refresh_token" });
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuthMiddleware)
	async revokeRefreshTokens(@Ctx() { request, authService }: Context) {
		if (!request.isAuthenticated || !request.user?.id) return false;
		try {
			const userId = Number(request.user.id);
			return await authService.increamentTokenVersion(userId);
		} catch (error) {
			console.log("revoke token: ", error);
			return false;
		}
	}
}
