import { Entity, model, property } from "@loopback/repository";

@model({ settings: {} })
export class User extends Entity {
	@property({
		type: "string",
		id: true,
		required: true
	})
	id: string;

	@property({
		type: "string",
		required: true
	})
	email: string;

	@property({
		type: "string",
		required: true
	})
	password: string;

	@property({
		type: "string",
		required: true
	})
	salt: string;

	@property({
		type: "date",
		required: true
	})
	createdAt: Date;

	@property({
		type: "date",
		required: true
	})
	updatedAt: Date;

	constructor(data?: Partial<User>) {
		super(data);
	}
}

export interface UserRelations {
	// describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
