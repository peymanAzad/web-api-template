import { User } from "../../../entities/User";
import { UserResponse } from "../types/userResponse";

export const userMap = (user: User): UserResponse => ({
	user: { id: user.id, username: user.username },
});
