import {DefaultCrudRepository} from '@loopback/repository';
import {Planet, PlanetRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PlanetRepository extends DefaultCrudRepository<
  Planet,
  typeof Planet.prototype.id,
  PlanetRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Planet, dataSource);
  }
}
