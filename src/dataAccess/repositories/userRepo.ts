import { User } from "../../entities/User";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	getByUsername(username: string) {
		return this.findOne({ where: { username } });
	}
}
