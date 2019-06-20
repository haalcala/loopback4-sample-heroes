import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Species extends Entity {
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

  @property({
    type: 'number',
  })
  lifespan?: number;


  constructor(data?: Partial<Species>) {
    super(data);
  }
}

export interface SpeciesRelations {
  // describe navigational properties here
}

export type SpeciesWithRelations = Species & SpeciesRelations;
