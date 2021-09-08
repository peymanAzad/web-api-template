import * as yup from "yup";
import { ErrorElement } from "../types/errorResponse";

export const loginSchema = yup.object().shape({
	username: yup
		.string()
		.required(
			(): ErrorElement => ({
				filed: "username",
				message: "username is required",
			})
		)
		.min(
			5,
			({ min }): ErrorElement => ({
				filed: "username",
				message: `username should be at least ${min} characters`,
			})
		),
	password: yup
		.string()
		.required(
			(): ErrorElement => ({
				filed: "password",
				message: "password is required",
			})
		)
		.min(5, ({ min }) => ({
			filed: "password",
			message: `password should be at least ${min} characters`,
		})),
});

export const registerSchema = loginSchema.shape({
	confirmPassword: yup
		.string()
		.required(
			(): ErrorElement => ({
				filed: "confirmPassword",
				message: "confirm password is required",
			})
		)
		.oneOf(
			[yup.ref("password"), null],
			(): ErrorElement => ({
				filed: "confrimPassword",
				message: "confirm password and password must match",
			})
		),
});
