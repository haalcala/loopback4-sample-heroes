import {DefaultCrudRepository} from '@loopback/repository';
import {Species, SpeciesRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SpeciesRepository extends DefaultCrudRepository<
  Species,
  typeof Species.prototype.id,
  SpeciesRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Species, dataSource);
  }
}
