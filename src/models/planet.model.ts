import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Planet extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;


  constructor(data?: Partial<Planet>) {
    super(data);
  }
}

export interface PlanetRelations {
  // describe navigational properties here
}

export type PlanetWithRelations = Planet & PlanetRelations;
