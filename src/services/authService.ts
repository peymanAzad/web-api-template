import { User } from "../entities/User";
import { userType } from "../services.contracts/auth/userType";
import { getConnection } from "typeorm";
import { IAuthService } from "../services.contracts/auth/IAuthService";
import argon from "argon2";
import { UserRepository } from "../dataAccess/repositories/userRepo";

export class AuthService implements IAuthService {
	private readonly userRepo: UserRepository;
	constructor(userRepo?: UserRepository) {
		if (userRepo) this.userRepo = userRepo;
		else this.userRepo = getConnection().getCustomRepository(UserRepository);
	}
	async increamentTokenVersion(userId: number): Promise<boolean> {
		const result = await this.userRepo.increment(
			{ id: userId },
			"tokenVersion",
			1
		);
		return result.affected ? result.affected > 0 : true;
	}

	getByUsername(username: string): Promise<User | undefined> {
		return this.userRepo.getByUsername(username);
	}

	getById(id: number): Promise<User | undefined> {
		return this.userRepo.findOne(id);
	}

	async register(userInput: userType): Promise<User> {
		const user = new User();
		user.username = userInput.username;
		user.password = await argon.hash(userInput.password);
		user.roles = "00000"; //do some role stuff here

		try {
			const saved = this.userRepo.save(user);
			return saved;
		} catch (error) {
			throw Error("username already exists");
		}
	}

	async login(userInput: userType): Promise<User | undefined> {
		const user = await this.userRepo.findOne({ username: userInput.username });
		if (user) {
			const verify = await argon.verify(user?.password, userInput.password);
			return verify ? user : undefined;
		}
		return user;
	}

	static isAuthorized(user: userType, role: string): boolean {
		if (!user.roles) return false;
		if (user.roles.length !== role.length)
			throw Error("roles length is not equal");
		for (let i = role.length - 1; i >= 0; --i) {
			const char = user.roles.charAt(i);
			if (role.charAt(i) !== char && char === "0") return false;
		}
		return true;
	}
}
