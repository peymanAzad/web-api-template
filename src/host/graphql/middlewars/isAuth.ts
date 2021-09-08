import { authenticateRequest } from "../../auth/authConfig";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types";

export const isAuthMiddleware: MiddlewareFn<Context> = async (
	{ context },
	next
) => {
	await authenticateRequest(context.request, context.authService);
	return next();
};
