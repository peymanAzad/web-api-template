import { User } from "../../../entities/User";
import { Field, ObjectType } from "type-graphql";
import { BaseResponse } from "./baseResponse";

@ObjectType()
export class UserResponse extends BaseResponse {
	@Field(() => User, { nullable: true })
	user?: User;
	@Field(() => String, { nullable: true })
	access_token?: string;
}
