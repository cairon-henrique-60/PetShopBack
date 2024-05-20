import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';

import { CreateOrUpdateSpeciesPayload } from '../dtos/create-or-update-pet-species.dto';

@Entity('pet_species')
export class PetSpecies extends Base {
  @Column('varchar')
  species_name: string;

  @OneToMany(() => PetBreed, (petBreed) => petBreed.species)
  breeds: PetBreed[];

  static createOrUpdate(params: CreateOrUpdateSpeciesPayload): PetSpecies {
    const petSpeciesItem = new PetSpecies();

    Object.assign(petSpeciesItem, params);
    return petSpeciesItem;
  }
}
