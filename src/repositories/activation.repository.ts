import {DefaultCrudRepository} from '@loopback/repository';
import {Activation, ActivationRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ActivationRepository extends DefaultCrudRepository<
  Activation,
  typeof Activation.prototype.email,
  ActivationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Activation, dataSource);
  }
}
