import { DefaultCrudRepository, BelongsToAccessor, repository } from "@loopback/repository";
import { Hero, HeroRelations, Planet, Species } from "../models";
import { DbDataSource } from "../datasources";
import { inject, Getter } from "@loopback/core";
import { SpeciesRepository } from "./species.repository";
import { PlanetRepository } from "./planet.repository";

export class HeroRepository extends DefaultCrudRepository<Hero, typeof Hero.prototype.id, HeroRelations> {
	public readonly friend: BelongsToAccessor<Hero, typeof Hero.prototype.id>;
	public readonly planet: BelongsToAccessor<Planet, typeof Hero.prototype.id>;
	public readonly species: BelongsToAccessor<Species, typeof Hero.prototype.id>;

	constructor(
		@inject("datasources.db") dataSource: DbDataSource,
		@repository.getter("SpeciesRepository") speciesRepositoryGetter: Getter<SpeciesRepository>,
		@repository.getter("PlanetRepository") planetRepositoryGetter: Getter<PlanetRepository>
	) {
		super(Hero, dataSource);
		console.log("HeroRepository::constructor:");
		this.friend = this._createBelongsToAccessorFor("friend", Getter.fromValue(this));
		this.planet = this._createBelongsToAccessorFor("planet", planetRepositoryGetter);
		this.species = this._createBelongsToAccessorFor("species", speciesRepositoryGetter);
	}
}
