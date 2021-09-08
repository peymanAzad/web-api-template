import { buildSchema } from "type-graphql";
import { Context } from "./types";
import { Express } from "express";
import { IAuthService } from "../../services.contracts/auth/IAuthService";
import { UserResolver } from "./resolvers/userResolver";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";

const api = async (app: Express, authService: IAuthService) => {
	const schema = await buildSchema({
		resolvers: [UserResolver],
		validate: false,
	});
	app.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
		})
	);
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

// const typesdef = `
// 	type Student {
// 		id: Int!
// 		name: String!
// 		courses: [Course]
// 	}
// 	type Course {
// 		id: Int!
// 		name: String
// 		roomId: Int
// 	}

// 	type Query {
// 		students: [Student]
// 	}
// `;

// interface student {
//     id: number;
//     name: string;
//     courses: number[];
// }
// interface course {
//     id: number;
//     name: string;
//     roomId: number;
// }

// const data: { students: student[]; courses: course[] } = {
//     students: [
//         { id: 1, name: "test", courses: [1, 2] },
//         { id: 2, name: "test2", courses: [1] },
//         { id: 3, name: "test3", courses: [2] },
//         { id: 4, name: "test4", courses: [] },
//     ],
//     courses: [
//         { id: 1, name: "ctest", roomId: 100 },
//         { id: 2, name: "ctest2", roomId: 200 },
//     ],
// };

// const resolvers = {
//     Query: {
//         students: async () => data.students,
//     },
//     Student: {
//         async courses(parent: student) {
//             if (!parent.courses) return [];
//             return data.courses.filter((f) => parent.courses.includes(f.id));
//         },
//     },
// };
