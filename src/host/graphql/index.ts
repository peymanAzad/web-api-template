import { buildSchema } from "type-graphql";
import { Context } from "./types";
import { Express } from "express";
import { IAuthService } from "../../services.contracts/auth/IAuthService";
import { UserResolver } from "./resolvers/userResolver";
import { ApolloServer } from "apollo-server-express";

const api = async (app: Express, authService: IAuthService) => {
	const schema = await buildSchema({
		resolvers: [UserResolver],
		validate: false,
	});

	const server = new ApolloServer({
		schema,
		context: ({ req, res }): Context => ({
			request: req,
			response: res,
			authService,
		}),
	});
	await server.start();
	server.applyMiddleware({ app, cors: false });

	return app;
};
export default api;
