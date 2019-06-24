import { Entity, model, property } from "@loopback/repository";

@model({ settings: {} })
export class Activation extends Entity {
	@property({
		type: "string",
		id: true,
		required: true
	})
	email: string;

	@property({
		type: "string"
	})
	token?: string;

	@property({
		type: "date",
		required: true
	})
	createdAt: Date;

	constructor(data?: Partial<Activation>) {
		super(data);
	}
}

export interface ActivationRelations {
	// describe navigational properties here
}

export type ActivationWithRelations = Activation & ActivationRelations;
