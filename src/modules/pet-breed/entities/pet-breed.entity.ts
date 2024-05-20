import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

import { CreatePetBreedPayload } from '../dtos/create-pet-breed.dto';
import { UpdatePetBreedPayload } from '../dtos/update-pet-breed.dto';

@Entity('pet_breeds')
export class PetBreed extends Base {
  @Column('varchar')
  breed_name: string;

  @Column('uuid')
  @Index()
  species_id: string;

  @ManyToOne(() => PetSpecies, { eager: true })
  @JoinColumn({ name: 'species_id' })
  species: PetSpecies;

  static create(params: CreatePetBreedPayload): PetBreed {
    const petBreedItem = new PetBreed();
    Object.assign(petBreedItem, params);
    return petBreedItem;
  }

  static update(params: UpdatePetBreedPayload): PetBreed {
    const petBreedItem = new PetBreed();
    Object.assign(petBreedItem, params);
    return petBreedItem;
  }
}
