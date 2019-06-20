import { Entity, model, property, belongsTo } from "@loopback/repository";
import { Planet } from "./planet.model";
import { Species } from "./species.model";

@model({ settings: {} })
export class Hero extends Entity {
	@property({
		type: "number",
		id: true,
		required: true
	})
	id: number;

	@property({
		type: "string",
		required: true
	})
	name: string;

	// @property({
	//   type: 'string',
	// })
	@belongsTo(() => Hero, { keyTo: "id" })
	friendId?: string;

	// @property({
	// 	type: "string"
	// })
	@belongsTo(() => Planet, { keyTo: "id" })
	planetId?: string;

	// @property({
	// 	type: "string"
	// })
	@belongsTo(() => Species, { keyTo: "id" })
	speciesId?: string;

	constructor(data?: Partial<Hero>) {
		super(data);
	}
}

export interface HeroRelations {
	// describe navigational properties here
}

export type HeroWithRelations = Hero & HeroRelations;
