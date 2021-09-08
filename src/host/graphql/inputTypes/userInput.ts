import { IsNotEmpty, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType("userInput")
export class UserInput {
	@Field()
	@MinLength(5, { message: "username should be more than 5 characters" })
	@IsNotEmpty({ message: "username is required" })
	username: string;

	@Field()
	@MinLength(5, { message: "password should be more than 5 characters" })
	@IsNotEmpty({ message: "password is required" })
	password: string;
}

@InputType("registerInput")
export class RegisterInput extends UserInput {
	@Field()
	@MinLength(5, {
		message: "confirm password should be more than 5 characters",
	})
	@IsNotEmpty({ message: "password is required" })
	confirmPassword: string;
}
