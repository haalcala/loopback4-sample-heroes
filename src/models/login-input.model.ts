import { model, property } from "@loopback/repository";

@model({ settings: {} })
export class LoginInput {
	@property({
		type: "string",
		required: true
	})
	password: string;

	@property({
		type: "string",
		required: true
	})
	username: string;

	constructor(data?: Partial<LoginInput>) {}
}

export interface LoginInputRelations {
	// describe navigational properties here
}

export type LoginInputWithRelations = LoginInput & LoginInputRelations;
