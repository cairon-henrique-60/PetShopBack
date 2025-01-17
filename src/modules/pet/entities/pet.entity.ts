import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Calendar } from 'src/modules/calendar/entities/calendar.entity';
import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

import type { CreatePetPayload } from '../dtos/create-pet.dto';
import type { UpdatePetPayload } from '../dtos/update-pet.dto';

type CreatePetParams = CreatePetPayload & { tutor_id: string };
type UpdatePetParams = UpdatePetPayload & { tutor_id: string };

@Entity('pets')
export class Pet extends Base {
  @Index()
  @Column('varchar')
  pet_name: string;

  @Column('uuid')
  @Index()
  pet_breed_id: string; // Id da Raça. EX: Golden Retriever

  @Column('uuid')
  @Index()
  pet_species_id: string; // Id da Especie. EX: Cachorro

  @Column('date', { nullable: true })
  date_of_birth: NullableValue<Date>;

  @Column('char')
  pet_gender: string;

  @Column('varchar')
  pet_color: string;

  @Column('varchar', { nullable: true })
  alergies: NullableValue<string>;

  @Column('varchar', { nullable: true })
  medical_conditions: NullableValue<string>;

  @Column('varchar', { nullable: true })
  current_medication: NullableValue<string>;

  @Column('varchar', { nullable: true })
  pet_microship_id: string;

  @Column('uuid')
  @Index()
  tutor_id: string;

  @ManyToOne(() => User, (user) => user.pets, { eager: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor: User;

  @ManyToOne(() => PetSpecies, { eager: true })
  @JoinColumn({ name: 'pet_species_id' })
  pet_species: PetSpecies;

  @ManyToOne(() => PetBreed, { eager: true })
  @JoinColumn({ name: 'pet_breed_id' })
  pet_breed: PetBreed;

  @OneToMany(() => Calendar, (calendar) => calendar.pet)
  calendars: Calendar[];

  static create(params: CreatePetParams): Pet {
    const petItem = new Pet();
    Object.assign(petItem, params);
    return petItem;
  }

  static update(params: UpdatePetParams): Pet {
    const petItem = new Pet();
    Object.assign(petItem, params);
    return petItem;
  }
}
