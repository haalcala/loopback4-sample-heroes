import { post, requestBody, HttpErrors } from "@loopback/rest";
import { repository } from "@loopback/repository";
import { Credentials, JWT_SECRET } from "../auth";
import { promisify } from "util";
import { UserRepository } from "../repositories/user.repository";
import { UserRoleRepository } from "../repositories/user-role.repository";

const { sign } = require("jsonwebtoken");
const signAsync = promisify(sign);

export class UserController {
	constructor(@repository(UserRepository) private userRepository: UserRepository, @repository(UserRoleRepository) private userRoleRepository: UserRoleRepository) {}

	@post("/users/login")
	async login(@requestBody() credentials: Credentials) {
		console.log("UserController.login:: credentials:", credentials);

		if (!credentials.username || !credentials.password) {
			throw new HttpErrors.Unauthorized("Invalid credentials");
		}

		const user = await this.userRepository.findOne({ where: { id: credentials.username } });
		if (!user) throw new HttpErrors.Unauthorized("Invalid credentials");

		const isPasswordMatched = user.password === credentials.password;
		if (!isPasswordMatched) throw new HttpErrors.Unauthorized("Invalid credentials");

		const tokenObject = { username: credentials.username };
		const token = await signAsync(tokenObject, JWT_SECRET);
		const roles = await this.userRoleRepository.find({ where: { userId: user.id } });
		const { id, email } = user;

		return {
			token,
			id: id as string,
			email,
			roles: roles.map(r => r.roleId)
		};
	}
}
