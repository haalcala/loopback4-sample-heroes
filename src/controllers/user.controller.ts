import { post, requestBody, HttpErrors, get, RestBindings, Request } from "@loopback/rest";
import { repository } from "@loopback/repository";
import { Credentials, JWT_SECRET, secured, SecuredType } from "../auth";
import { promisify } from "util";
import { UserRepository } from "../repositories/user.repository";
import { UserRoleRepository } from "../repositories/user-role.repository";
import { ActivationRepository } from "../repositories/activation.repository";
import { Activation } from "../models/activation.model";
import { myUtil } from "../MyUtil";
import { User } from "../models/user.model";
import shortid = require("shortid");
import { UserRole } from "../models/user-role.model";
import { inject } from "@loopback/core";
import { decode } from "jsonwebtoken";
import { LoginInput } from "../models";

const { sign } = require("jsonwebtoken");
const signAsync = promisify(sign);

export class UserController {
	constructor(
		@inject(RestBindings.Http.REQUEST) private req: Request,
		@repository(UserRepository) private userRepository: UserRepository,
		@repository(UserRoleRepository) private userRoleRepository: UserRoleRepository,
		@repository(ActivationRepository) private activationRepository: ActivationRepository
	) {}

	@post("/users/login", {
		requestBody: {
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							username: {
								type: "string"
							},
							password: {
								type: "string"
							}
						},
						schema: { "x-ts-type": LoginInput }
					}
				}
			}
		},
		responses: {
			"200": {
				description: "Login",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								token: {
									type: "string"
								},
								id: {
									type: "string"
								},
								email: {
									type: "string"
								}
							}
						}
					}
				}
			}
		}
	})
	async login(@requestBody() credentials: LoginInput) {
		console.log("UserController.login:: credentials:", credentials);

		const { username, password } = credentials;

		if (!username || !password) {
			throw new HttpErrors.Unauthorized("Invalid credentials");
		}

		const user = await this.userRepository.findOne({ where: { email: username } });
		if (!user) throw new HttpErrors.Unauthorized("Invalid credentials");

		const isPasswordMatched = user.password === myUtil.getSha256(user.email + "." + user.salt + "." + password);
		if (!isPasswordMatched) throw new HttpErrors.Unauthorized("Invalid credentials");

		const tokenObject = { username };
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

		const { email } = userInfo;

		const user = await this.userRepository.findOne({ where: { email } });

		if (user) {
			throw new HttpErrors.InternalServerError("Email already exists.");
		}

		let act = await this.activationRepository.findOne({ where: { email } });

		console.log("UserController.register:: act:", act);

		if (act) {
			await this.activationRepository.delete(act);
		}

		act = new Activation();
		act.email = email;
		act.createdAt = new Date();
		act.token = await myUtil.getEmailToken(act.email);

		await this.activationRepository.create(act);

		return {
			ok: 1
		};
	}

	@post("/users/confirmRegistration")
	async confirmRegistration(@requestBody() { email, token, password }: { email: string; token: string; password: string }) {
		if (!password) {
			throw new HttpErrors.BadRequest("Missing required input email/password");
		}

		const act = await this.activationRepository.findOne({ where: { email, token } });

		console.log("UserController.confirmRegistration:: act:", act);

		if (!act) {
			throw new HttpErrors.Unauthorized("Invalid credentials");
		}

		await this.activationRepository.delete(act);

		const user = new User();

		user.id = user.email = act.email;
		user.salt = shortid.generate();
		user.password = myUtil.getSha256(email + "." + user.salt + "." + password);
		user.createdAt = user.updatedAt = new Date();

		await this.userRepository.create(user);

		const userRole = new UserRole();

		userRole.id = shortid.generate();
		userRole.userId = user.email;
		userRole.roleId = "ADMIN";

		await this.userRoleRepository.create(userRole);

		return {
			ok: 1,
			user
		};
	}

	@get("/users/account", {
		responses: {
			"200": {
				description: "Account",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string"
								}
							}
						}
					}
				}
			}
		}
	})
	@secured(SecuredType.IS_AUTHENTICATED)
	async account() {
		console.log(this.req.query);

		// const tok = decode(this.req.query.access_token);
		// @ts-ignore
		const tok = decode(this.req.headers["x-token"]);

		if (!tok) {
			throw new HttpErrors.Unauthorized("Invalid credentials");
		}

		// @ts-ignore
		const user = await this.userRepository.findById(tok.username);

		if (!user) {
			throw new HttpErrors.Unauthorized("Invalid credentials");
		}

		return {
			ok: 1,
			user: ["email", "createdAt"].reduce((val: object, prop) => {
				// @ts-ignore
				val[prop] = user[prop];

				return val;
			}, {})
		};
	}
}
