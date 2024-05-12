import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { PetSpecies } from 'src/modules/pet_species/entities/pet-species.entity';

// export enum PetSpecies {
//   Cachorro = 'Cachorro',
//   Gato = 'Gato',
//   Ave = 'Ave',
//   Coelho = 'Coelho',
//   Hamster = 'Hamster',
//   Peixe = 'Peixe',
//   Tartaruga = 'Tartaruga',
//   Cobra = 'Cobra',
//   Lagarto = 'Lagarto',
// }

@Entity('pets')
export class Pet extends Base {
  @Index()
  @Column('varchar')
  pet_name: string;

  @Column('varchar')
  pet_breed: string; // Raça

  @Column('date', { nullable: true })
  date_of_birth: Date | null;

  @Column('varchar')
  pet_gender: string;

  @Column('varchar')
  pet_color: string;

  @Column('varchar', { nullable: true })
  alergies: string | null;

  @Column('varchar', { nullable: true })
  medical_conditions: string | null;

  @Column('varchar', { nullable: true })
  current_medication: string | null;

  @Column('varchar', { nullable: true })
  pet_image_url: string | null;

  @Column('varchar', { nullable: true })
  pet_microship_id: string;

  @ManyToOne(() => User, (user) => user.pets, { eager: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor: User;

  @Column('uuid')
  tutor_id: string;

  @ManyToOne(() => PetSpecies, { eager: true })
  @JoinColumn({ name: 'pet_species_id' })
  pet_species: PetSpecies;

  @Column('uuid')
  pet_species_id: string;
}
