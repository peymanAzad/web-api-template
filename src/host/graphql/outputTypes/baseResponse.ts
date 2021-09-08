import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class ErrorResponse {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
export class BaseResponse {
	@Field(() => [ErrorResponse], { nullable: true })
	errors?: ErrorResponse[];
}
