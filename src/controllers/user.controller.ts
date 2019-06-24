import { post, requestBody, HttpErrors } from "@loopback/rest";
import { repository } from "@loopback/repository";
import { Credentials, JWT_SECRET } from "../auth";
import { promisify } from "util";
import { UserRepository } from "../repositories/user.repository";
import { UserRoleRepository } from "../repositories/user-role.repository";
import { ActivationRepository } from "../repositories/activation.repository";
import { Activation } from "../models/activation.model";
import { myUtil } from "../MyUtil";

const { sign } = require("jsonwebtoken");
const signAsync = promisify(sign);

export class UserController {
	constructor(
		@repository(UserRepository) private userRepository: UserRepository,
		@repository(UserRoleRepository) private userRoleRepository: UserRoleRepository,
		@repository(ActivationRepository) private activationRepository: ActivationRepository
	) {}

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

	@post("/users/register")
	async register(@requestBody() userInfo: { email: string }) {
		console.log("UserController.register:: userInfo:", userInfo);

		let act = await this.activationRepository.findOne({ where: { email: userInfo.email } });

		console.log("UserController.register:: act:", act);

		if (act) {
			await this.activationRepository.delete(act);
		}

		act = new Activation();
		act.email = userInfo.email;
		act.createdAt = new Date();
		act.token = await myUtil.getEmailToken(act.email);

		await this.activationRepository.create(act);

		return {
			ok: 1
		};
	}

	@post("/users/confirmRegistration")
	async confirmRegistration(@requestBody() user_info: { email: string; token: string; password: string }) {
		return {
			ok: 1
		};
	}
}
